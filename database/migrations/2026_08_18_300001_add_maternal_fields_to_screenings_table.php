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
        Schema::table('screenings', function (Blueprint $table) {
            if (!Schema::hasColumn('screenings', 'pekerjaan')) {
                $table->string('pekerjaan')->nullable()->after('nik');
            }
            if (!Schema::hasColumn('screenings', 'pendidikan')) {
                $table->string('pendidikan')->nullable()->after('pekerjaan');
            }
            if (!Schema::hasColumn('screenings', 'probabilitas_ml')) {
                $table->json('probabilitas_ml')->nullable()->after('skor_risiko_ml');
            }
            if (!Schema::hasColumn('screenings', 'kategori_ml')) {
                $table->string('kategori_ml')->nullable()->after('diagnosa_ml');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('screenings', function (Blueprint $table) {
            $table->dropColumn(['pekerjaan', 'pendidikan', 'probabilitas_ml', 'kategori_ml']);
        });
    }
};
