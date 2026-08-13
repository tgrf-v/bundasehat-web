<?php

namespace App\Services;

use Carbon\Carbon;

class ScoringService
{
    /**
     * Hitung Mean Arterial Pressure (MAP).
     * MAP = (Sistolik + 2 × Diastolik) / 3
     */
    public function calculateMAP(int $sistolik, int $diastolik): float
    {
        if ($sistolik <= 0 || $diastolik <= 0) {
            return 0;
        }

        return round(($sistolik + 2 * $diastolik) / 3, 2);
    }

    /**
     * Hitung usia kehamilan dalam minggu dan HPL (Naegele's rule).
     *
     * @return array{weeks: int, dueDate: string|null}
     */
    public function calculateGestationalAge(?string $hphtString): array
    {
        if (empty($hphtString)) {
            return ['weeks' => 0, 'dueDate' => null];
        }

        try {
            $hpht = Carbon::parse($hphtString);
            $today = Carbon::now();

            $diffDays = $today->diffInDays($hpht);
            $weeks = (int) floor($diffDays / 7);

            // Naegele's rule: HPHT + 7 hari - 3 bulan + 1 tahun
            $hpl = $hpht->copy()
                ->addDays(7)
                ->subMonths(3)
                ->addYear();

            $formattedDate = $hpl->translatedFormat('j F Y');

            return [
                'weeks' => max(0, $weeks),
                'dueDate' => $formattedDate,
            ];
        } catch (\Exception $e) {
            return ['weeks' => 0, 'dueDate' => null];
        }
    }

    /**
     * Evaluasi screening KSPR & MAP — port penuh dari scoringEngine.ts.
     *
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function evaluateScreening(array $input): array
    {
        $score = 2; // Skor awal ibu hamil (KSPR)
        $komplikasi = [];
        $detailSkorList = [
            ['deskripsi' => 'Skor Awal Ibu Hamil (KSPR)', 'skor' => 2],
        ];

        $umur = (int) ($input['umur'] ?? 0);
        $paritas = (int) ($input['paritas'] ?? 0);
        $sistolik = (int) ($input['sistolik'] ?? 0);
        $diastolik = (int) ($input['diastolik'] ?? 0);
        $edemaLevel = $input['edema_level'] ?? 'none';
        $keluhanSpesifik = $input['keluhan_spesifik'] ?? [];
        $sudahDapatTreatment = (bool) ($input['sudah_dapat_treatment'] ?? false);
        $hpht = $input['hpht'] ?? null;

        // ── Evaluasi Umur & Paritas ──
        if ($umur < 20) {
            $score += 4;
            $komplikasi[] = 'Usia Terlalu Muda (<20 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Usia Terlalu Muda (<20 Tahun)', 'skor' => 4];
        } elseif ($umur >= 35) {
            $score += 4;
            $komplikasi[] = 'Usia Resti / Terlalu Tua (>=35 Tahun)';
            $detailSkorList[] = ['deskripsi' => 'Usia Primi Tua / Terlalu Tua (>=35 Tahun)', 'skor' => 4];
        }

        if ($paritas >= 4) {
            $score += 4;
            $komplikasi[] = 'Grande Multipara (Paritas >= 4)';
            $detailSkorList[] = ['deskripsi' => 'Grande Multipara (Paritas >= 4)', 'skor' => 4];
        }

        // ── Evaluasi Tekanan Darah & MAP ──
        $mapVal = $this->calculateMAP($sistolik, $diastolik);
        $isHipertensiBerat = $sistolik >= 140 || $diastolik >= 90;
        $isHipertensiRingan = ($sistolik >= 120 && $sistolik < 140)
            || ($diastolik >= 80 && $diastolik < 90);

        if ($isHipertensiBerat) {
            $score += 8;
            $komplikasi[] = 'Hipertensi Dalam Kehamilan (HDK) / Preeklamsia';
            $detailSkorList[] = ['deskripsi' => 'Hipertensi Dalam Kehamilan (Sistolik >=140 / Diastolik >=90)', 'skor' => 8];
        } elseif ($isHipertensiRingan) {
            $score += 4;
            $komplikasi[] = 'Pre-Hipertensi Gestasional';
            $detailSkorList[] = ['deskripsi' => 'Pre-Hipertensi Gestasional', 'skor' => 4];
        }

        if ($mapVal >= 90 && !in_array('Indikator MAP Tinggi (>= 90 mmHg)', $komplikasi, true)) {
            $score += 4;
            $komplikasi[] = 'Indikator MAP Tinggi (>= 90 mmHg)';
            $detailSkorList[] = ['deskripsi' => 'Mean Arterial Pressure (MAP) >= 90 mmHg', 'skor' => 4];
        }

        // ── Evaluasi Edema ──
        if ($edemaLevel === 'ringan_kaki') {
            $score += 4;
            $komplikasi[] = 'Edema Ekstremitas Ringan (Kaki)';
            $detailSkorList[] = ['deskripsi' => 'Edema Ekstremitas Ringan (Kaki)', 'skor' => 4];
        } elseif ($edemaLevel === 'sedang_tungkai') {
            $score += 4;
            $komplikasi[] = 'Edema Ekstremitas Sedang (Tungkai/Betis)';
            $detailSkorList[] = ['deskripsi' => 'Edema Ekstremitas Sedang (Tungkai/Betis)', 'skor' => 4];
        } elseif ($edemaLevel === 'berat_wajah_tangan') {
            $score += 8;
            $komplikasi[] = 'Edema Anasarka / Wajah & Tangan (Gejala Preeklamsia Berat)';
            $detailSkorList[] = ['deskripsi' => 'Edema Anasarka (Wajah & Kelopak Tangan)', 'skor' => 8];
        }

        // ── Evaluasi Keluhan Spesifik ──
        if (in_array('pusing_berat_kabur', $keluhanSpesifik, true)) {
            $score += 8;
            $komplikasi[] = 'Nyeri Kepala Berat & Pandangan Kabur';
            $detailSkorList[] = ['deskripsi' => 'Nyeri Kepala Berat & Pandangan Kabur', 'skor' => 8];
        }
        if (in_array('nyeri_ulu_hati', $keluhanSpesifik, true)) {
            $score += 8;
            $komplikasi[] = 'Nyeri Epigastrium / Ulu Hati (Tanda Impending Eklamsia)';
            $detailSkorList[] = ['deskripsi' => 'Nyeri Ulu Hati Epigastrium', 'skor' => 8];
        }
        if (in_array('anemia_pucat', $keluhanSpesifik, true)) {
            $score += 4;
            $komplikasi[] = 'Anemia Dalam Kehamilan';
            $detailSkorList[] = ['deskripsi' => 'Anemia / Pucat & Cepat Lelah', 'skor' => 4];
        }
        if (in_array('perdarahan', $keluhanSpesifik, true)) {
            $score += 8;
            $komplikasi[] = 'Perdarahan Antepartum / Postpartum';
            $detailSkorList[] = ['deskripsi' => 'Perdarahan Jalan Lahir / Flek', 'skor' => 8];
        }
        if (in_array('gerakan_janin_berkurang', $keluhanSpesifik, true)) {
            $score += 8;
            $komplikasi[] = 'Gawat Janin / Fetal Distress';
            $detailSkorList[] = ['deskripsi' => 'Gerakan Janin Berkurang', 'skor' => 8];
        }
        if (in_array('riwayat_sc', $keluhanSpesifik, true)) {
            $score += 4;
            $komplikasi[] = 'Bekas Seksio Sesarea (Bekas SC)';
            $detailSkorList[] = ['deskripsi' => 'Riwayat Operasi SC Sebelumnya', 'skor' => 4];
        }

        if ($sudahDapatTreatment && count($komplikasi) === 0) {
            $komplikasi[] = 'Dalam Terapi Penanganan Awal (Perlu Evaluasi Lanjutan)';
        }

        // ── Klasifikasi Risiko ──
        $riskLevel = 'Ringan';
        $katRisiko = 'KRR';
        $statusLabel = 'Risiko Ringan / Rendah';

        $hasRedFlag = $isHipertensiBerat && (
            $edemaLevel !== 'none'
            || in_array('pusing_berat_kabur', $keluhanSpesifik, true)
            || in_array('nyeri_ulu_hati', $keluhanSpesifik, true)
        );

        if ($score >= 12 || $hasRedFlag) {
            $riskLevel = 'Berat';
            $katRisiko = 'KRST';
            $statusLabel = 'Risiko Sangat Tinggi / Berat';
        } elseif ($score >= 6) {
            $riskLevel = 'Sedang';
            $katRisiko = 'KRT';
            $statusLabel = 'Risiko Tinggi / Sedang';
        }

        // ── Rekomendasi Faskes ──
        $faskes = '';
        $tempat = '';
        $penolong = '';

        if ($riskLevel === 'Berat') {
            $tempat = 'Wajib Rujukan Rumah Sakit (RS Facilitas SC)';
            $penolong = 'Dokter Spesialis Kebidanan (Sp.OG)';
            $faskes = 'Wajib Rujukan Segera ke Rumah Sakit (Faskes Rujukan Lanjutan) dan Didampingi Dokter Spesialis Kebidanan & Kandungan (Sp.OG).';
        } elseif ($riskLevel === 'Sedang') {
            $tempat = 'Puskesmas Rawat Inap / PONED';
            $penolong = 'Bidan & Dokter Umum';
            $faskes = 'Dapat Dilayani di Puskesmas / Rumah Sakit Type C dengan Pendampingan Bidan & Dokter Umum.';
        } else {
            $tempat = 'Bidan Praktik Mandiri (BPM) / Puskesmas';
            $penolong = 'Bidan Wilayah';
            $faskes = 'Boleh Bersalin di Bidan Praktik Mandiri (BPM) atau Puskesmas Rawat Inap dengan Pengawasan Bidan.';
        }

        // ── Saran Terapi ──
        $saranTerapiList = [];

        if ($isHipertensiBerat || in_array('pusing_berat_kabur', $keluhanSpesifik, true)) {
            $saranTerapiList[] = 'Kompres Warm Compress pada leher & pundak';
            $saranTerapiList[] = 'Teknik Pernapasan Deep Breathing Relaksasi';
            $saranTerapiList[] = 'Aromaterapi Lavender Meredakan Kecemasan';
        } elseif ($edemaLevel !== 'none') {
            $saranTerapiList[] = 'Elevasi Kaki (Posisikan Kaki Lebih Tinggi saat Istirahat)';
            $saranTerapiList[] = 'Kompres Lengkung Pergelangan Kaki';
            $saranTerapiList[] = 'Pijat Ringan Efusi Ekstremitas';
        } else {
            $saranTerapiList[] = 'Pijat Oxytocin Tulang Belakang (Bantuan Suami)';
            $saranTerapiList[] = 'Senam Pelenturan Panggul Trimester 3';
            $saranTerapiList[] = 'Minum Air Putih Cukup (8-10 Gelas/Hari)';
        }

        // ── Gestational Age & HPL ──
        $gestational = $this->calculateGestationalAge($hpht);

        // ── Generate Kode Screening Unik ──
        $kodeScreening = 'SCR-' . date('Ymd') . '-' . str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);

        return [
            'kode_screening' => $kodeScreening,
            'skor_kspr' => $score,
            'map_value' => $mapVal,
            'tingkat_risiko' => $riskLevel,
            'kategori_risiko' => $katRisiko,
            'status_label' => $statusLabel,
            'diagnosa_komplikasi' => array_values(array_unique($komplikasi)),
            'rekomendasi_faskes' => $faskes,
            'rekomendasi_tempat' => $tempat,
            'penolong_persalinan' => $penolong,
            'saran_terapi' => $saranTerapiList,
            'detail_skor' => $detailSkorList,
            'taksiran_hpl' => $gestational['dueDate'],
        ];
    }
}
