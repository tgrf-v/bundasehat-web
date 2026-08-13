<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScreeningRequest;
use App\Models\Screening;
use App\Services\ScoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ScreeningController extends Controller
{
    public function __construct(
        private readonly ScoringService $scoringService,
    ) {}

    /**
     * Simpan screening baru (DSS — Ibu Hamil).
     * Menerima data form → hitung skor KSPR & MAP → simpan ke DB → redirect ke hasil.
     */
    public function store(ScreeningRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = Auth::user();

        if ($user === null) {
            return redirect()->route('login');
        }

        // Untuk persalinan: merge keluhan tambahan berdasarkan kondisi persalinan
        $keluhanSpesifik = $validated['keluhan_spesifik'] ?? [];

        if (($validated['tipe_screening'] ?? '') === 'persalinan') {
            if (!empty($validated['ada_riwayat_sc']) && !in_array('riwayat_sc', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'riwayat_sc';
            }
            if (isset($validated['posisi_janin']) && $validated['posisi_janin'] !== 'kepala_bawah' && !in_array('letak_sungsang_lintang', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'letak_sungsang_lintang';
            }
            if (isset($validated['kondisi_ketuban']) && $validated['kondisi_ketuban'] === 'pecah' && !in_array('ketuban_pecah_dini', $keluhanSpesifik, true)) {
                $keluhanSpesifik[] = 'ketuban_pecah_dini';
            }
        }

        $validated['keluhan_spesifik'] = $keluhanSpesifik;

        // Hitung skor via ScoringService
        $scoringResult = $this->scoringService->evaluateScreening($validated);

        // Map tipe_screening ke format DB
        $tipeDb = $validated['tipe_screening'] === 'kehamilan' ? 'dss' : 'dss';

        // Simpan ke database
        $screening = Screening::create([
            'ibu_hamil_id' => $user->id,
            'bidan_id' => null,
            'tipe_screening' => $tipeDb,

            // Input data
            'nama_pasien' => $validated['nama_pasien'],
            'nik' => $validated['nik'] ?? null,
            'umur' => $validated['umur'],
            'paritas' => $validated['paritas'],
            'hpht' => $validated['hpht'] ?? null,
            'sistolik' => $validated['sistolik'],
            'diastolik' => $validated['diastolik'],
            'edema_level' => $validated['edema_level'],
            'keluhan_spesifik' => $keluhanSpesifik,
            'sudah_dapat_treatment' => $validated['sudah_dapat_treatment'],
            'detail_treatment' => $validated['detail_treatment'] ?? null,
            'wilayah_puskesmas' => $validated['wilayah_puskesmas'] ?? null,

            // Persalinan-specific
            'posisi_janin' => $validated['posisi_janin'] ?? null,
            'ada_riwayat_sc' => $validated['ada_riwayat_sc'] ?? false,
            'kondisi_ketuban' => $validated['kondisi_ketuban'] ?? null,

            // Output kalkulasi
            'kode_screening' => $scoringResult['kode_screening'],
            'skor_kspr' => $scoringResult['skor_kspr'],
            'map_value' => $scoringResult['map_value'],
            'tingkat_risiko' => $scoringResult['tingkat_risiko'],
            'kategori_risiko' => $scoringResult['kategori_risiko'],
            'status_label' => $scoringResult['status_label'],
            'diagnosa_komplikasi' => $scoringResult['diagnosa_komplikasi'],
            'rekomendasi_faskes' => $scoringResult['rekomendasi_faskes'],
            'rekomendasi_tempat' => $scoringResult['rekomendasi_tempat'],
            'penolong_persalinan' => $scoringResult['penolong_persalinan'],
            'saran_terapi' => $scoringResult['saran_terapi'],
            'detail_skor' => $scoringResult['detail_skor'],
            'taksiran_hpl' => $scoringResult['taksiran_hpl'],
        ]);

        return redirect()->route('screening.show', $screening->id);
    }

    /**
     * Tampilkan detail 1 screening (halaman Hasil).
     */
    public function show(Screening $screening): Response
    {
        $user = Auth::user();

        // Pastikan user hanya bisa lihat screening miliknya sendiri
        if ($user === null || ($screening->ibu_hamil_id !== $user->id && $screening->bidan_id !== $user->id)) {
            abort(403, 'Anda tidak memiliki akses ke screening ini.');
        }

        return Inertia::render('Screening/Hasil', [
            'screening' => $this->formatScreeningResult($screening),
        ]);
    }

    /**
     * Ambil riwayat screening user yang login.
     */
    public function history(Request $request): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $screenings = Screening::where('ibu_hamil_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Screening $s) => $this->formatScreeningResult($s));

        return Inertia::render('Profil/Index', [
            'screenings' => $screenings,
        ]);
    }

    /**
     * Format Screening model ke format yang dibutuhkan frontend (ScreeningResult type).
     *
     * @return array<string, mixed>
     */
    private function formatScreeningResult(Screening $screening): array
    {
        return [
            'id' => $screening->id,
            'kode_screening' => $screening->kode_screening,
            'skor_poedji_rochjati' => $screening->skor_kspr,
            'total_skor' => $screening->skor_kspr,
            'tingkat_risiko' => $screening->tingkat_risiko,
            'kategori_risiko' => $screening->kategori_risiko,
            'status_label' => $screening->status_label,
            'map_value' => (float) $screening->map_value,
            'potensi_komplikasi' => $screening->diagnosa_komplikasi ?? [],
            'rekomendasi_faskes' => $screening->rekomendasi_faskes,
            'rekomendasi_tempat' => $screening->rekomendasi_tempat,
            'penolong_persalinan' => $screening->penolong_persalinan,
            'taksiran_hpl' => $screening->taksiran_hpl,
            'saran_terapi_ids' => $screening->tingkat_risiko === 'Berat' ? [3, 4] : ($screening->tingkat_risiko === 'Sedang' ? [1, 2] : [2]),
            'saran_terapi' => $screening->saran_terapi ?? [],
            'detail_skor' => $screening->detail_skor ?? [],
            'input_summary' => [
                'nama_pasien' => $screening->nama_pasien,
                'nik' => $screening->nik,
                'umur' => $screening->umur,
                'paritas' => $screening->paritas,
                'hpht' => $screening->hpht,
                'sistolik' => $screening->sistolik,
                'diastolik' => $screening->diastolik,
                'edema_level' => $screening->edema_level,
                'keluhan_spesifik' => $screening->keluhan_spesifik ?? [],
                'sudah_dapat_treatment' => $screening->sudah_dapat_treatment,
                'detail_treatment' => $screening->detail_treatment,
                'tipe_screening' => $screening->tipe_screening === 'dss' ? 'kehamilan' : $screening->tipe_screening,
                'wilayah_puskesmas' => $screening->wilayah_puskesmas,
            ],
            'nama_pasien' => $screening->nama_pasien,
            'created_at' => $screening->created_at?->translatedFormat('j F Y, H:i') . ' WIB',
        ];
    }
}
