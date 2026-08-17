<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KamusItem extends Model
{
    use HasFactory;

    protected $table = 'kamus_items';

    protected $fillable = [
        'type',
        'letter',
        'title',
        'category',
        'summary',
        'first_aid',
        'video_badge',
        'instructor',
        'youtube_id',
        'duration',
        'description',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Scope untuk mengambil hanya artikel A-Z
     */
    public function scopeArticles($query)
    {
        return $query->where('type', 'article');
    }

    /**
     * Scope untuk mengambil hanya video terapi
     */
    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    /**
     * Scope untuk mengambil hanya konten yang dipublikasikan
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
