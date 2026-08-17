<?php

namespace Database\Seeders;

use App\Models\KamusItem;
use Illuminate\Database\Seeder;

class KamusItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ──────────────────────────────────────────────
        // 1. ARTIKEL MEDIS & KOMPLIKASI KEBIDANAN A-Z
        // ──────────────────────────────────────────────
        $articles = [
            [
                'type' => 'article',
                'letter' => 'A',
                'title' => 'Anemia pada Ibu Hamil (Kekurangan Sel Darah Merah)',
                'category' => 'Komplikasi Umum',
                'summary' => 'Kondisi di mana kadar hemoglobin (Hb) ibu hamil < 11 g/dL pada trimester 1 & 3, atau < 10.5 g/dL pada trimester 2.',
                'first_aid' => 'Konsumsi suplemen Tablet Tambah Darah (TTD) bersama vitamin C (jus jeruk), hindari teh/kopi saat minum obat, dan perbanyak bayam & hati ayam.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'A',
                'title' => 'Abortus Imminens (Ancaman Keguguran Usia Dini)',
                'category' => 'Gawat Darurat T1',
                'summary' => 'Bercak darah atau perdarahan pervaginam pada usia kehamilan kurang dari 20 minggu dengan ostium uteri masih tertutup.',
                'first_aid' => 'Tirah baring (bed rest) total, batasi aktivitas fisik berat, hindari hubungan suami istri sementara, dan segera konsultasi SpOG.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'A',
                'title' => 'Air Ketuban Merembes / Ketuban Pecah Dini (KPD)',
                'category' => 'Persalinan & Ketuban',
                'summary' => 'Keluarnya cairan ketuban berbau khas amis dari jalan lahir sebelum tanda-tanda persalinan atau pembukaan rahim dimulai.',
                'first_aid' => 'Gunakan pembalut bersih, catat warna & bau cairan, DILARANG mencuci vagina dengan sabun pembersih, dan langsung berangkat ke Puskesmas/RS.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'D',
                'title' => 'Diabetes Melitus Gestasional (DMG / Gula Darah Tinggi)',
                'category' => 'Metabolik',
                'summary' => 'Gangguan toleransi glukosa yang pertama kali terdeteksi saat kehamilan (GDS ≥ 200 mg/dL atau GDP ≥ 126 mg/dL).',
                'first_aid' => 'Kelola pola makan dengan konsultasi gizi, hindari minuman manis berkarbohidrat tinggi, lakukan jalan pagi ringan, dan cek gula rutin.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'D',
                'title' => 'Distosia Bahu (Kemacetan Bahu Janin Saat Persalinan)',
                'category' => 'Komplikasi Persalinan',
                'summary' => 'Kondisi darurat di mana kepala janin sudah lahir tetapi bahu tersangkut di belakang simfisis pubis ibu.',
                'first_aid' => 'Posisi penanganan medis khusus (fleksi panggul maksimal / manuver McRoberts). Penanganan wajib oleh Dokter Spesialis Kebidanan.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'E',
                'title' => 'Eklamsia & Kejang Kebidanan Darurat',
                'category' => 'Risiko Sangat Tinggi',
                'summary' => 'Komplikasi berat dari preeklamsia ditandai timbulnya kejang-kejang disertai penurunan kesadaran pada ibu hamil.',
                'first_aid' => 'Posisikan miring kiri, amankan dari cedera benturan, jangan masukkan benda ke mulut, dan segera panggil ambulans IGD RS rujukan.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'E',
                'title' => 'Edema Tungkai & Wajah (Pembengkakan Ekstremitas)',
                'category' => 'Vaskular',
                'summary' => 'Penumpukan cairan di jaringan tubuh yang menyebabkan kaki, tangan, atau wajah membengkak terutama saat berdiri lama.',
                'first_aid' => 'Tinggikan posisi kaki saat berbaring menggunakan bantal, ganti posisi duduk berkala, kurangi konsumsi makanan tinggi natrium.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'H',
                'title' => 'Hyperemesis Gravidarum (Mual Muntah Berlebihan)',
                'category' => 'Gastrointestinal',
                'summary' => 'Mual dan muntah parah pada awal kehamilan yang menyebabkan dehidrasi, penurunan berat badan > 5%, dan ketonuria.',
                'first_aid' => 'Makan porsi kecil tapi sering (biskuit/roti bakar kering), minum air hangat hangat kuku atau air jahe, hindari bau menyengat.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'H',
                'title' => 'Hipertensi Gestasional (Tekanan Darah Tinggi Kehamilan)',
                'category' => 'Vaskular',
                'summary' => 'Tekanan darah sistolik ≥ 140 mmHg atau diastolik ≥ 90 mmHg yang pertama kali muncul setelah usia kehamilan 20 minggu.',
                'first_aid' => 'Tirah baring (rest) posisi miring ke kiri, batasi asupan garam tinggi, kelola stres dengan relaksasi napas, dan rutin cek tensi mingguan.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'K',
                'title' => 'Kehamilan Ektopik Terganggu (KET / Luar Rahim)',
                'category' => 'Darurat Kebidanan',
                'summary' => 'Implantasi sel telur yang dibuahi terjadi di luar rongga rahim (paling sering di saluran tuba falopi).',
                'first_aid' => 'Kondisi gawat darurat medis mutlak! Jangan berikan obat minum apapun, segera bawa ibu ke IGD Rumah Sakit terdekat.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'P',
                'title' => 'Preeklamsia Berat (PEB) & Sindrom HELLP',
                'category' => 'Risiko Sangat Tinggi',
                'summary' => 'Sindrom kehamilan ditandai tensi ≥ 160/110 mmHg, proteinuria positif, nyeri ulu hati hebat, dan pandangan mata kabur.',
                'first_aid' => 'Segera rujuk ke RS PONEK dengan infus MgSO4 profilaksis kejang oleh tenaga nakes berwenang.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'P',
                'title' => 'Perdarahan Pasca Persalinan (HPP / Hemoragi Postpartum)',
                'category' => 'Darurat Persalinan',
                'summary' => 'Kehilangan darah lebih dari 500 mL setelah persalinan normal atau > 1.000 mL setelah operasi caesar.',
                'first_aid' => 'Lakukan masase fundus uteri secara sirkuler untuk merangsang kontraksi rahim, pasang infus dua jalur, dan berikan uterotonika.',
                'is_published' => true,
            ],
            [
                'type' => 'article',
                'letter' => 'S',
                'title' => 'Sungsang / Letak Sungsang (Breech Presentation)',
                'category' => 'Posisi Janin',
                'summary' => 'Kondisi di mana bokong atau kaki janin berada di bagian bawah rahim mendekati jalan lahir pada usia kehamilan aterm.',
                'first_aid' => 'Lakukan posisi bersujud dada-ke-lutut (knee-chest position) 2x sehari selama 10-15 menit pada usia 30-36 minggu.',
                'is_published' => true,
            ],
        ];

        foreach ($articles as $art) {
            KamusItem::updateOrCreate(
                ['title' => $art['title']],
                $art
            );
        }

        // ──────────────────────────────────────────────
        // 2. VIDEO TERAPI KOMPLEMENTER (NON-OBAT)
        // ──────────────────────────────────────────────
        $videos = [
            [
                'type' => 'video',
                'title' => 'Teknik Pijat Oxytocin Ibu Hamil & Pelancar ASI',
                'category' => 'Trimester 3 · Laktasi',
                'video_badge' => 'TERAPI FISIK',
                'instructor' => 'Bidan Asih, S.ST., M.Keb',
                'youtube_id' => 'dQw4w9WgXcQ',
                'duration' => '08:34',
                'description' => 'Panduan pijatan relaksasi punggung (tulang belakang) untuk merangsang hormon oksitosin alami, menenangkan pikiran, dan memperlancar laktasi.',
                'is_published' => true,
            ],
            [
                'type' => 'video',
                'title' => 'Senam Hamil Trimester 3 Pelancar Pembukaan Persalinan',
                'category' => 'Trimester 3 · Persalinan',
                'video_badge' => 'SENAM HAMIL',
                'instructor' => 'Bidan Asih, S.ST., M.Keb',
                'youtube_id' => 'dQw4w9WgXcQ',
                'duration' => '12:10',
                'description' => 'Gerakan senam panggul dan pelenturan panggul yang aman untuk membantu kepala janin turun optimal ke rongga panggul.',
                'is_published' => true,
            ],
            [
                'type' => 'video',
                'title' => 'Terapi Napas Deep Breathing Meredakan Nyeri Kontraksi',
                'category' => 'Manajemen Nyeri',
                'video_badge' => 'RELAKSASI',
                'instructor' => 'Bidan Asih, S.ST., M.Keb',
                'youtube_id' => 'dQw4w9WgXcQ',
                'duration' => '06:45',
                'description' => 'Teknik olah napas ritmik dan visualisasi afirmasi positif saat gelombang kontraksi persalinan datang agar ibu tetap tenang.',
                'is_published' => true,
            ],
        ];

        foreach ($videos as $vid) {
            KamusItem::updateOrCreate(
                ['title' => $vid['title']],
                $vid
            );
        }
    }
}
