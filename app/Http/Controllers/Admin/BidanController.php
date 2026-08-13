<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BidanProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class BidanController extends Controller
{
    /**
     * Daftar akun Bidan (untuk Superadmin).
     */
    public function index(): Response
    {
        $bidanList = User::where('role', 'bidan')
            ->with('bidanProfile')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'no_telepon' => $user->no_telepon,
                'no_str' => $user->bidanProfile?->no_str,
                'puskesmas_wilayah' => $user->bidanProfile?->puskesmas_wilayah,
                'created_at' => $user->created_at?->translatedFormat('j F Y'),
            ]);

        return Inertia::render('Admin/Bidan/Index', [
            'bidanList' => $bidanList,
        ]);
    }

    /**
     * Tambah akun Bidan baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Rules\Password::defaults()],
            'no_telepon' => ['nullable', 'string', 'max:20'],
            'no_str' => ['required', 'string', 'max:100'],
            'puskesmas_wilayah' => ['required', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'bidan',
            'no_telepon' => $validated['no_telepon'] ?? null,
        ]);

        BidanProfile::create([
            'user_id' => $user->id,
            'no_str' => $validated['no_str'],
            'puskesmas_wilayah' => $validated['puskesmas_wilayah'],
        ]);

        return redirect()->back()->with('success', 'Akun Bidan berhasil dibuat.');
    }

    /**
     * Nonaktifkan / hapus akun Bidan.
     */
    public function destroy(User $bidan): RedirectResponse
    {
        if ($bidan->role !== 'bidan') {
            abort(403, 'User ini bukan Bidan.');
        }

        $bidan->delete();

        return redirect()->back()->with('success', 'Akun Bidan berhasil dihapus.');
    }
}
