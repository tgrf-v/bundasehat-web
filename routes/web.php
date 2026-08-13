<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Path Root / -> Beranda Utama
Route::get('/', function () {
    return Inertia::render('Beranda');
})->name('beranda');

// Form Login (Halaman Akses Tamu / Belum Login)
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// Redirect Alias /beranda ke /
Route::get('/beranda', function () {
    return redirect('/');
});

// Halaman Dedicated Tentang Kami
Route::get('/tentang-kami', function () {
    return Inertia::render('TentangKami');
})->name('tentang-kami');

// Screening Kehamilan
Route::get('/screening/kehamilan', function () {
    return Inertia::render('Screening/Kehamilan');
})->name('screening.kehamilan');

// Screening Persalinan
Route::get('/screening/persalinan', function () {
    return Inertia::render('Screening/Persalinan');
})->name('screening.persalinan');

// Kamus Kesehatan & Terapi Komplementer
Route::get('/kamus', function () {
    return Inertia::render('Kamus/Index');
})->name('kamus.index');

// Profil Saya & Riwayat Screening
Route::get('/profil', function () {
    return Inertia::render('Profil/Index');
})->name('profil.index');

// Design System Showcase (Halaman Pengujian UI Component)
Route::get('/design-system', function () {
    return Inertia::render('DesignSystem');
})->name('design-system');
