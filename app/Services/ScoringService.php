<?php

namespace App\Services;

use Carbon\Carbon;

class ScoringService
{
    /**
     * Hitung Mean Arterial Pressure (MAP).
     * MAP = (Sistolik + 2 * Diastolik) / 3
     */
    public function calculateMAP(int $sistolik, int $diastolik): float
    {
        if ($sistolik <= 0 || $diastolik <= 0) {
            return 0;
        }
        return round(($sistolik + 2 * $diastolik) / 3, 2);
    }

    /**
     * Hitung usia kehamilan dalam minggu dan HPL (Naegele rule).
     *
     * @return array{weeks: int, dueDate: string|null}
     */
    public function calculateGestationalAge(?string $hphtString): array
    {
        if (empty($hphtString)) {
            return ['weeks' => 0, 'dueDate' => null];
        }
        try {
            $hpht  = Carbon::parse($hphtString);
            $today = Carbon::now();
            $diffDays = $today->diffInDays($hpht);
            $weeks    = (int) floor($diffDays / 7);
            $hpl = $hpht->copy()->addDays(7)->subMonths(3)->addYear();
            return [
                'weeks'   => max(0, $weeks),
                'dueDate' => $hpl->translatedFormat('j F Y'),
            ];
        } catch (\Exception $e) {
            return ['weeks' => 0, 'dueDate' => null];
        }
    }

    /**
     * Evaluasi screening KSPR berdasarkan Skor Poedji Rochjati.
     *
     * @param  array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function evaluateScreening(array $input): array
    {
        $score           = 2; // Skor awal otomatis
        $komplikasi      = [];
        $detailSkorList  = [
            ['deskripsi' => 'Skor Awal Ibu Hamil (KSPR)', 'skor' => 2],
        ];

        $kehamilanKe    = (int) ($input['kehamilan_ke'] ?? $input['gravida'] ?? 1);
        $isHamilPertama = $kehamilanKe === 1;
        $umur           = (int) ($input['umur'] ?? 0);
        $hpht           = $input['hpht'] ?? null;
        $sistolik       = (int) ($input['sistolik'] ?? 120);
        $diastolik      = (int) ($input['diastolik'] ?? 80);

        // ══ KELOMPOK I — APGO ══

        // 2. Usia ibu (no double count untuk hamil I + usia >=35)
        if ($isHamilPertama && $umur <= 16) {
            $score += 4;
            $komplikasi[]    = 'Terlalu Muda Hamil I (<=16 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Terlalu Muda Hamil I (<=16 Tahun)', 'skor' => 4];
        } elseif ($isHamilPertama && $umur >= 35) {
            $score += 4;
            $komplikasi[]    = 'Terlalu Tua Hamil I (>=35 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Terlalu Tua Hamil I (>=35 Tahun)', 'skor' => 4];
        } elseif (!$isHamilPertama && $umur >= 35) {
            $score += 4;
            $komplikasi[]    = 'Usia Terlalu Tua (>=35 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Usia Terlalu Tua (>=35 Tahun)', 'skor' => 4];
        }

        // 3. Lama menikah sebelum hamil pertama
        if ($isHamilPertama && ($input['lama_menikah'] ?? '') === '>=4') {
            $score += 4;
            $komplikasi[]    = 'Terlalu Lambat Hamil I (Menikah >=4 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Terlalu Lambat Hamil I (Menikah >=4 Tahun)', 'skor' => 4];
        }

        // 4. Jarak kehamilan (hanya bukan hamil pertama)
        if (!$isHamilPertama) {
            $jarakKehamilan = $input['jarak_kehamilan'] ?? '';
            if ($jarakKehamilan === '<2') {
                $score += 4;
                $komplikasi[]    = 'Jarak Kehamilan Terlalu Cepat (<2 Tahun)';
                $detailSkorList[] = ['deskripsi' => 'Jarak Kehamilan Terlalu Cepat (<2 Tahun)', 'skor' => 4];
            } elseif ($jarakKehamilan === '>10') {
                $score += 4;
                $komplikasi[]    = 'Jarak Kehamilan Terlalu Lama (>10 Tahun)';
                $detailSkorList[] = ['deskripsi' => 'Jarak Kehamilan Terlalu Lama (>10 Tahun)', 'skor' => 4];
            }
        }

        // 5. Jumlah anak hidup >=4
        $jumlahAnakHidup = (int) ($input['jumlah_anak_hidup'] ?? $input['paritas'] ?? 0);
        if ($jumlahAnakHidup >= 4) {
            $score += 4;
            $komplikasi[]    = 'Terlalu Banyak Anak (>=4 Anak Hidup)';
            $detailSkorList[] = ['deskripsi' => 'Terlalu Banyak Anak (>=4 Anak Hidup)', 'skor' => 4];
        }

        // 6. Tinggi badan <=145 cm
        $tinggiBadan = (float) ($input['tinggi_badan'] ?? 0);
        if ($tinggiBadan > 0 && $tinggiBadan <= 145) {
            $score += 4;
            $komplikasi[]    = 'Tinggi Badan <=145 cm (Risiko CPD)';
            $detailSkorList[] = ['deskripsi' => 'Tinggi Badan <=145 cm (Risiko CPD)', 'skor' => 4];
        }

        // 7. Riwayat keguguran
        if (!empty($input['riwayat_keguguran'])) {
            $score += 4;
            $komplikasi[]    = 'Riwayat Keguguran / Gagal Kehamilan';
            $detailSkorList[] = ['deskripsi' => 'Riwayat Keguguran / Gagal Kehamilan', 'skor' => 4];
        }

        // 8. Riwayat persalinan bermasalah (multi-select, akumulatif)
        $riwayatBermasalah = $input['riwayat_persalinan_bermasalah'] ?? [];
        if (!$isHamilPertama) {
            if (in_array('tang_vakum', $riwayatBermasalah, true)) {
                $score += 4;
                $komplikasi[]    = 'Riwayat Persalinan Ditarik Tang / Vakum';
                $detailSkorList[] = ['deskripsi' => 'Riwayat Persalinan Ditarik Tang / Vakum', 'skor' => 4];
            }
            if (in_array('plasenta_manual', $riwayatBermasalah, true)) {
                $score += 4;
                $komplikasi[]    = 'Riwayat Plasenta Manual / Uri Dirogoh';
                $detailSkorList[] = ['deskripsi' => 'Riwayat Plasenta Manual / Uri Dirogoh', 'skor' => 4];
            }
            if (in_array('infus_transfusi', $riwayatBermasalah, true)) {
                $score += 4;
                $komplikasi[]    = 'Riwayat Diberi Infus / Transfusi (Perdarahan)';
                $detailSkorList[] = ['deskripsi' => 'Riwayat Diberi Infus / Transfusi (Perdarahan)', 'skor' => 4];
            }
        }

        // 9. Riwayat operasi sesar
        if (!empty($input['riwayat_sc_kehamilan']) || !empty($input['ada_riwayat_sc'])) {
            $score += 8;
            $komplikasi[]    = 'Riwayat Operasi Sesar (SC)';
            $detailSkorList[] = ['deskripsi' => 'Riwayat Operasi Sesar (SC)', 'skor' => 8];
        }

        // ══ KELOMPOK II — AGO ══

        // 10. Penyakit saat ini (multi-select, akumulatif, masing-masing +4)
        $penyakitList = $input['penyakit_saat_ini'] ?? [];
        $penyakitMap  = [
            'anemia'  => 'Kurang Darah / Anemia dalam Kehamilan',
            'malaria' => 'Malaria dalam Kehamilan',
            'tbc'     => 'TBC Paru dalam Kehamilan',
            'jantung' => 'Payah Jantung dalam Kehamilan',
            'diabetes'=> 'Kencing Manis (Diabetes) dalam Kehamilan',
            'pms'     => 'Penyakit Menular Seksual dalam Kehamilan',
        ];
        foreach ($penyakitMap as $key => $label) {
            if (in_array($key, $penyakitList, true)) {
                $score += 4;
                $komplikasi[]    = $label;
                $detailSkorList[] = ['deskripsi' => $label, 'skor' => 4];
            }
        }

        // 11. Bengkak wajah/tungkai + tekanan darah tinggi
        if (!empty($input['bengkak_darah_tinggi'])) {
            $score += 4;
            $komplikasi[]    = 'Bengkak Wajah / Tungkai Disertai Tekanan Darah Tinggi';
            $detailSkorList[] = ['deskripsi' => 'Bengkak Wajah / Tungkai Disertai Tekanan Darah Tinggi', 'skor' => 4];
        }

        // 12. Hamil kembar
        if (!empty($input['hamil_kembar'])) {
            $score += 4;
            $komplikasi[]    = 'Hamil Kembar (Gemelli)';
            $detailSkorList[] = ['deskripsi' => 'Hamil Kembar (Gemelli)', 'skor' => 4];
        }

        // 13. Hydramnion
        if (!empty($input['hydramnion'])) {
            $score += 4;
            $komplikasi[]    = 'Hydramnion (Cairan Ketuban Berlebih)';
            $detailSkorList[] = ['deskripsi' => 'Hydramnion (Cairan Ketuban Berlebih)', 'skor' => 4];
        }

        // 14. Riwayat bayi mati dalam kandungan
        if (!empty($input['riwayat_bayi_mati'])) {
            $score += 4;
            $komplikasi[]    = 'Riwayat Bayi Mati Dalam Kandungan';
            $detailSkorList[] = ['deskripsi' => 'Riwayat Bayi Mati Dalam Kandungan', 'skor' => 4];
        }

        // 15. Kehamilan serotinus (>42 minggu)
        if (!empty($input['serotinus'])) {
            $score += 4;
            $komplikasi[]    = 'Kehamilan Lebih Bulan / Serotinus (>42 Minggu)';
            $detailSkorList[] = ['deskripsi' => 'Kehamilan Lebih Bulan / Serotinus (>42 Minggu)', 'skor' => 4];
        }

        // ══ KELOMPOK III — GDOB ══

        // 16. Letak sungsang
        if (!empty($input['letak_sungsang'])) {
            $score += 8;
            $komplikasi[]    = 'Letak Bayi Sungsang';
            $detailSkorList[] = ['deskripsi' => 'Letak Bayi Sungsang', 'skor' => 8];
        }

        // 17. Letak lintang
        if (!empty($input['letak_lintang'])) {
            $score += 8;
            $komplikasi[]    = 'Letak Bayi Lintang';
            $detailSkorList[] = ['deskripsi' => 'Letak Bayi Lintang', 'skor' => 8];
        }

        // 18. Perdarahan dalam kehamilan
        if (!empty($input['pendarahan_kehamilan'])) {
            $score += 8;
            $komplikasi[]    = 'Perdarahan Dalam Kehamilan';
            $detailSkorList[] = ['deskripsi' => 'Perdarahan Dalam Kehamilan', 'skor' => 8];
        }

        // 19. Preeklampsia berat / eklampsia
        if (!empty($input['preeklampsia_berat'])) {
            $score += 8;
            $komplikasi[]    = 'Preeklampsia Berat / Kejang-Kejang (Eklampsia)';
            $detailSkorList[] = ['deskripsi' => 'Preeklampsia Berat / Kejang-Kejang (Eklampsia)', 'skor' => 8];
        }

        // ── MAP ──
        $mapVal = $this->calculateMAP($sistolik, $diastolik);

        // ── Klasifikasi Risiko ──
        $riskLevel   = 'Ringan';
        $katRisiko   = 'KRR';
        $statusLabel = 'Risiko Ringan / Rendah';

        if ($score >= 12) {
            $riskLevel   = 'Berat';
            $katRisiko   = 'KRST';
            $statusLabel = 'Risiko Sangat Tinggi / Berat';
        } elseif ($score >= 6) {
            $riskLevel   = 'Sedang';
            $katRisiko   = 'KRT';
            $statusLabel = 'Risiko Tinggi / Sedang';
        }

        // ── Rekomendasi Faskes ──
        $faskes   = '';
        $tempat   = '';
        $penolong = '';

        if ($riskLevel === 'Berat') {
            $tempat   = 'Wajib Rujukan Rumah Sakit (RS / SpOG)';
            $penolong = 'Dokter Spesialis Kebidanan (Sp.OG)';
            $faskes   = 'Dianjurkan bersalin di Rumah Sakit dengan Dokter Spesialis Kebidanan & Kandungan (Sp.OG). Skor >=12 wajib dirujuk segera.';
        } elseif ($riskLevel === 'Sedang') {
            $tempat   = 'Puskesmas Rawat Inap / PONED';
            $penolong = 'Bidan & Dokter Umum';
            $faskes   = 'Dianjurkan bersalin dengan tenaga kesehatan (Bidan / Dokter) di Puskesmas atau Rumah Sakit Type C. Skor >=6 harus ditolong nakes.';
        } else {
            $tempat   = 'Bidan Praktik Mandiri (BPM) / Puskesmas';
            $penolong = 'Bidan Wilayah';
            $faskes   = 'Dapat bersalin di Bidan Praktik Mandiri (BPM) atau Puskesmas Rawat Inap dengan pengawasan Bidan.';
        }

        // ── Saran Terapi ──
        $saranTerapiList = [];
        if (!empty($input['bengkak_darah_tinggi']) || !empty($input['preeklampsia_berat'])) {
            $saranTerapiList[] = 'Kompres Warm Compress pada leher & pundak';
            $saranTerapiList[] = 'Teknik Pernapasan Deep Breathing Relaksasi';
            $saranTerapiList[] = 'Aromaterapi Lavender Meredakan Kecemasan';
        } elseif (in_array('anemia', $penyakitList, true)) {
            $saranTerapiList[] = 'Konsumsi Makanan Tinggi Zat Besi (Bayam, Hati Ayam, Kacang Merah)';
            $saranTerapiList[] = 'Minum Tablet Tambah Darah (TTD) Sesuai Anjuran Bidan';
            $saranTerapiList[] = 'Hindari Minum Teh / Kopi Bersamaan dengan Makan';
        } else {
            $saranTerapiList[] = 'Pijat Oxytocin Tulang Belakang (Bantuan Suami)';
            $saranTerapiList[] = 'Senam Pelenturan Panggul Trimester 3';
            $saranTerapiList[] = 'Minum Air Putih Cukup (8-10 Gelas/Hari)';
        }

        $gestational    = $this->calculateGestationalAge($hpht);
        $kodeScreening  = 'SCR-' . date('Ymd') . '-' . str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);

        return [
            'kode_screening'    => $kodeScreening,
            'skor_kspr'         => $score,
            'map_value'         => $mapVal,
            'tingkat_risiko'    => $riskLevel,
            'kategori_risiko'   => $katRisiko,
            'status_label'      => $statusLabel,
            'diagnosa_komplikasi' => array_values(array_unique($komplikasi)),
            'rekomendasi_faskes'  => $faskes,
            'rekomendasi_tempat'  => $tempat,
            'penolong_persalinan' => $penolong,
            'saran_terapi'      => $saranTerapiList,
            'detail_skor'       => $detailSkorList,
            'taksiran_hpl'      => $gestational['dueDate'],
        ];
    }
}
