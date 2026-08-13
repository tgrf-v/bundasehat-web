<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();

            // Relasi
            $table->foreignId('ibu_hamil_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('bidan_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipe_screening'); // 'dss' atau 'es'

            // Input DSS (Ibu Hamil — 6 variabel dasar)
            $table->string('nama_pasien');
            $table->string('nik')->nullable();
            $table->integer('umur');
            $table->integer('paritas');
            $table->string('hpht')->nullable();
            $table->integer('sistolik');
            $table->integer('diastolik');
            $table->string('edema_level')->default('none');
            $table->json('keluhan_spesifik')->nullable();
            $table->boolean('sudah_dapat_treatment')->default(false);
            $table->text('detail_treatment')->nullable();
            $table->string('wilayah_puskesmas')->nullable();

            // Input ES tambahan (Bidan — 9 variabel klinis)
            $table->integer('gravida')->nullable();
            $table->integer('abortus')->nullable();
            $table->decimal('imt', 5, 2)->nullable();
            $table->string('letak_janin')->nullable();
            $table->integer('umur_kehamilan')->nullable();
            $table->string('jenis_persalinan')->nullable();
            $table->decimal('hb', 5, 2)->nullable();
            $table->integer('leokosit')->nullable();
            $table->integer('trombosit')->nullable();

            // Input persalinan-specific (dari form frontend)
            $table->string('posisi_janin')->nullable();
            $table->boolean('ada_riwayat_sc')->default(false);
            $table->string('kondisi_ketuban')->nullable();

            // Output kalkulasi KSPR & MAP
            $table->string('kode_screening')->unique();
            $table->integer('skor_kspr')->default(0);
            $table->decimal('map_value', 6, 2)->default(0);
            $table->string('tingkat_risiko'); // Ringan, Sedang, Berat
            $table->string('kategori_risiko'); // KRR, KRT, KRST
            $table->string('status_label');
            $table->json('diagnosa_komplikasi')->nullable();
            $table->text('rekomendasi_faskes')->nullable();
            $table->string('rekomendasi_tempat')->nullable();
            $table->string('penolong_persalinan')->nullable();
            $table->json('saran_terapi')->nullable();
            $table->json('detail_skor')->nullable();
            $table->string('taksiran_hpl')->nullable();

            // Output ML (FastAPI — future)
            $table->string('diagnosa_ml')->nullable();
            $table->decimal('skor_risiko_ml', 4, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
