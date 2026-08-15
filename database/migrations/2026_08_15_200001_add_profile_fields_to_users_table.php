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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik', 20)->nullable()->after('no_telepon');
            $table->date('tanggal_lahir')->nullable()->after('nik');
            $table->string('pekerjaan', 100)->nullable()->after('tanggal_lahir');
            $table->string('pendidikan', 50)->nullable()->after('pekerjaan');
            $table->date('hpht')->nullable()->after('pendidikan');
            $table->string('puskesmas', 255)->nullable()->after('hpht');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'tanggal_lahir',
                'pekerjaan',
                'pendidikan',
                'hpht',
                'puskesmas',
            ]);
        });
    }
};
