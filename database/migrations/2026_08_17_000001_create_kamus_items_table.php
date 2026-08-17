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
        Schema::create('kamus_items', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['article', 'video'])->default('article')->index();
            $table->char('letter', 1)->nullable()->index(); // Untuk filter alfabet A-Z artikel
            $table->string('title');
            $table->string('category')->index();
            $table->text('summary')->nullable(); // Ringkasan/gejala artikel
            $table->text('first_aid')->nullable(); // Pertolongan pertama mandiri
            $table->string('video_badge')->nullable(); // Badge: 'TERAPI FISIK', 'SENAM HAMIL', dll
            $table->string('instructor')->nullable(); // Nama instruktur video
            $table->string('youtube_id')->nullable(); // ID YouTube misal 'dQw4w9WgXcQ'
            $table->string('duration')->nullable(); // Durasi misal '08:34'
            $table->text('description')->nullable(); // Deskripsi video
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kamus_items');
    }
};
