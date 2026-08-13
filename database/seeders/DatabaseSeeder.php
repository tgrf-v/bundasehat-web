<?php

namespace Database\Seeders;

use App\Models\BidanProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Superadmin (Bu Asih - Dosen Kebidanan)
        User::create([
            'name' => 'Bu Asih (Superadmin)',
            'email' => 'superadmin@bundasehat.test',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'no_telepon' => '081200000001',
        ]);

        // 2. Bidan (Bidan Wilayah Demo)
        $bidan = User::create([
            'name' => 'Bidan Sari',
            'email' => 'bidan@bundasehat.test',
            'password' => Hash::make('password'),
            'role' => 'bidan',
            'no_telepon' => '081200000002',
        ]);

        BidanProfile::create([
            'user_id' => $bidan->id,
            'no_str' => 'STR-BDN-2026-001',
            'puskesmas_wilayah' => 'Puskesmas Kecamatan Cilandak',
        ]);

        // 3. Ibu Hamil (Pasien Demo)
        User::create([
            'name' => 'Ibu Rahma Rahayu',
            'email' => 'ibuhamil@bundasehat.test',
            'password' => Hash::make('password'),
            'role' => 'ibu_hamil',
            'no_telepon' => '081200000003',
        ]);
    }
}
