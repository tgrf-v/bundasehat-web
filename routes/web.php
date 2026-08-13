<?php

use App\Http\Controllers\Admin\BidanController;
use App\Http\Controllers\ScreeningController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ──────────────────────────────────────────────
// Login Route (Guest Only — belum login)
// ──────────────────────────────────────────────
// Halaman login di-handle oleh auth.php (Breeze),
// tapi kita tetap definisikan fallback redirect di sini.

// Redirect /beranda → / (alias)
Route::get('/beranda', function () {
    return redirect('/');
});

// ──────────────────────────────────────────────
// Protected Routes — Semua halaman butuh AUTH
// ──────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Beranda
    Route::get('/', function () {
        $user = auth()->user();
        $latestScreening = null;

        if ($user !== null) {
            $latest = $user->screenings()->latest()->first();
            if ($latest !== null) {
                $latestScreening = [
                    'kode_screening' => $latest->kode_screening,
                    'tingkat_risiko' => $latest->tingkat_risiko,
                    'kategori_risiko' => $latest->kategori_risiko,
                    'skor_kspr' => $latest->skor_kspr,
                    'map_value' => (float) $latest->map_value,
                    'created_at' => $latest->created_at?->translatedFormat('j F Y, H:i') . ' WIB',
                ];
            }
        }

        return Inertia::render('Beranda', [
            'latestScreening' => $latestScreening,
        ]);
    })->name('beranda');

    // Tentang Kami
    Route::get('/tentang-kami', function () {
        return Inertia::render('TentangKami');
    })->name('tentang-kami');

    // Screening Kehamilan (GET — tampilkan form)
    Route::get('/screening/kehamilan', function () {
        return Inertia::render('Screening/Kehamilan');
    })->name('screening.kehamilan');

    // Screening Persalinan (GET — tampilkan form)
    Route::get('/screening/persalinan', function () {
        return Inertia::render('Screening/Persalinan');
    })->name('screening.persalinan');

    // Screening POST — simpan & hitung skor
    Route::post('/screening', [ScreeningController::class, 'store'])->name('screening.store');

    // Screening Hasil (detail 1 screening)
    Route::get('/screening/{screening}', [ScreeningController::class, 'show'])->name('screening.show');

    // Kamus Kesehatan & Terapi Komplementer
    Route::get('/kamus', function () {
        return Inertia::render('Kamus/Index');
    })->name('kamus.index');

    // Profil & Riwayat Screening
    Route::get('/profil', [ScreeningController::class, 'history'])->name('profil.index');

    // Design System Showcase (dev only)
    Route::get('/design-system', function () {
        return Inertia::render('DesignSystem');
    })->name('design-system');
});

// ──────────────────────────────────────────────
// Superadmin Routes — Kelola Akun Bidan
// ──────────────────────────────────────────────
Route::middleware(['auth', 'role:superadmin'])->prefix('admin')->group(function () {
    Route::get('/bidan', [BidanController::class, 'index'])->name('admin.bidan.index');
    Route::post('/bidan', [BidanController::class, 'store'])->name('admin.bidan.store');
    Route::delete('/bidan/{bidan}', [BidanController::class, 'destroy'])->name('admin.bidan.destroy');
});

require __DIR__.'/auth.php';
