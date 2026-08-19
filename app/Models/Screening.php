<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Screening extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        // Relasi
        'ibu_hamil_id',
        'bidan_id',
        'tipe_screening',

        // Input DSS
        'nama_pasien',
        'nik',
        'pekerjaan',
        'pendidikan',
        'umur',
        'paritas',
        'hpht',
        'sistolik',
        'diastolik',
        'edema_level',
        'keluhan_spesifik',
        'sudah_dapat_treatment',
        'detail_treatment',
        'wilayah_puskesmas',

        // Input ES (Bidan)
        'gravida',
        'abortus',
        'imt',
        'letak_janin',
        'umur_kehamilan',
        'jenis_persalinan',
        'hb',
        'leokosit',
        'trombosit',

        // Persalinan-specific
        'posisi_janin',
        'ada_riwayat_sc',
        'kondisi_ketuban',

        // Output kalkulasi
        'kode_screening',
        'skor_kspr',
        'map_value',
        'tingkat_risiko',
        'kategori_risiko',
        'status_label',
        'diagnosa_komplikasi',
        'rekomendasi_faskes',
        'rekomendasi_tempat',
        'penolong_persalinan',
        'saran_terapi',
        'detail_skor',
        'taksiran_hpl',

        // Output ML (FastAPI Microservice)
        'diagnosa_ml',
        'kategori_ml',
        'skor_risiko_ml',
        'probabilitas_ml',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'keluhan_spesifik' => 'array',
            'diagnosa_komplikasi' => 'array',
            'saran_terapi' => 'array',
            'detail_skor' => 'array',
            'probabilitas_ml' => 'array',
            'sudah_dapat_treatment' => 'boolean',
            'ada_riwayat_sc' => 'boolean',
            'map_value' => 'decimal:2',
            'imt' => 'decimal:2',
            'hb' => 'decimal:2',
            'skor_risiko_ml' => 'decimal:2',
        ];
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function ibuHamil(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ibu_hamil_id');
    }

    public function bidan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'bidan_id');
    }
}
