<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Sebelum Login)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Beranda (Setelah Login)
Route::get('/beranda', function () {
    return Inertia::render('Beranda');
})->name('beranda');

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
