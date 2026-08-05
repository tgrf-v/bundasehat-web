<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route Halaman Preview Design System BundaSehat (1 Halaman Full UI Component)
Route::get('/', function () {
    return Inertia::render('DesignSystem');
})->name('design-system');

Route::get('/design-system', function () {
    return Inertia::render('DesignSystem');
});

// Route Aplikasi
Route::get('/screening/kehamilan', function () {
    return Inertia::render('Screening/Kehamilan');
})->name('screening.kehamilan');

Route::get('/screening/persalinan', function () {
    return Inertia::render('Screening/Persalinan');
})->name('screening.persalinan');

Route::get('/screening/hasil', function () {
    return Inertia::render('Screening/Hasil');
})->name('screening.hasil');

Route::get('/kamus', function () {
    return Inertia::render('Kamus/Index');
})->name('kamus.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
