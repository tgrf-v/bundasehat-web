<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'no_telepon',
        'nik',
        'tanggal_lahir',
        'pekerjaan',
        'pendidikan',
        'hpht',
        'puskesmas',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // ──────────────────────────────────────────────
    // Role Helpers
    // ──────────────────────────────────────────────

    public function isSuperadmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isBidan(): bool
    {
        return $this->role === 'bidan';
    }

    public function isIbuHamil(): bool
    {
        return $this->role === 'ibu_hamil';
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function bidanProfile(): HasOne
    {
        return $this->hasOne(BidanProfile::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class, 'ibu_hamil_id');
    }

    public function bidanScreenings(): HasMany
    {
        return $this->hasMany(Screening::class, 'bidan_id');
    }
}
