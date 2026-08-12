# Product Requirement Document (PRD)
## BundaSehat: Platform Digital Pendampingan Ibu Hamil & Persalinan Sehat

---

| Parameter | Detail Dokumen |
|---|---|
| **Nama Produk** | BundaSehat |
| **Versi Dokumen** | 1.0.0 (Production-Ready Spec) |
| **Status Produk** | Active Development / Refined Release |
| **Terakhir Diperbarui** | 12 Agustus 2026 |
| **Pemilik Produk** | Tim Pengembang Kebidanan & Digital Health BundaSehat |

---

## 1. Ringkasan Eksekutif & Tujuan Produk

### 1.1 Latar Belakang
Tingginya angka komplikasi kehamilan dan persalinan di Indonesia sering disebabkan oleh tiga keterlambatan (*Three Delays*): keterlambatan mengenali tanda bahaya, keterlambatan mengambil keputusan rujukan, dan keterlambatan mencapai fasilitas kesehatan. 

**BundaSehat** hadir sebagai platform web interaktif yang merubuhkan hambatan tersebut melalui integrasi algoritma medis berbasis **Kartu Skor Poedji Rochjati (KSPR)**, indikator **Mean Arterial Pressure (MAP)** untuk deteksi dini preeklamsia, kalkulator **Usia Kehamilan & HPL (Naegele's Rule)**, serta panduan **Terapi Komplementer** yang tervalidasi oleh tenaga kesehatan (Bidan & Nakes Wilayah).

### 1.2 Tujuan Utama (Product Goals)
1. **Deteksi Dini Mandiri**: Memungkinkan ibu hamil dan keluarga melakukan pemeriksaan mandiri faktor risiko kehamilan secara cepat dan akurat.
2. **Percepatan Rujukan Medis**: Memberikan rekomendasi penolong (Bidan Wilayah, Bidan & Dokter Umum, atau Dokter Spesialis Kebidanan/Sp.OG) dan tempat persalinan rujukan (BPM, Puskesmas PONED, atau Rumah Sakit SC) secara transparan.
3. **Edukasi Terapi Komplementer**: Menyediakan modul edukasi kamus kesehatan A-Z dan panduan video terapi fisik/relaksasi non-farmakologi (misal: Pijat Oxytocin, Senam Pelenturan Panggul) untuk mendukung fisik dan emosional ibu hamil.

---

## 2. Target Pengguna (User Personas)

### 2.1 Persona Utama: Ibu Hamil (Bunda)
- **Karakteristik**: Wanita usia reproduksi (18–40 tahun) yang sedang dalam masa kehamilan Trimester 1, 2, atau 3.
- **Kebutuhan**:
  - Mengukur tingkat risiko kehamilannya dengan bahasa yang mudah dipahami (tanpa istilah/singkatan medis rumit).
  - Mengetahui Taksiran Hari Perkiraan Lahir (HPL) secara pasti.
  - Mendapatkan panduan gerakan relaksasi dan penanganan keluhan fisik sehari-hari.

### 2.2 Persona Sekunder: Bidan Wilayah & Tenaga Kesehatan (Nakes)
- **Karakteristik**: Bidan Praktik Mandiri, Bidan Desa, atau Petugas Kesehatan Puskesmas.
- **Kebutuhan**:
  - Memantau riwayat skor risiko pasien secara digital.
  - Memastikan pasien risiko tinggi (*Resti*) mendapatkan pengawasan dan rujukan tepat waktu ke Puskesmas PONED atau Rumah Sakit rujukan SC.

---

## 3. Arsitektur Algoritma Medis & Sistem Skoring

### 3.1 Kartu Skor Poedji Rochjati (KSPR) & Aturan Bobot Skor
Aplikasi menghitung total skor risiko berdasarkan input kondisi fisik pasien dengan akumulasi bobot skor medis berikut:

| Kriteria / Kondisi Medis | Bobot Skor | Kategori Indikator |
|---|---|---|
| **Skor Awal Ibu Hamil** | **+2 Poin** | Dasar (Semua Ibu Hamil) |
| Usia < 20 Tahun | +4 Poin | Risiko Usia Muda |
| Usia Primi Tua / $\ge$ 35 Tahun | +4 Poin | Risiko Usia Tua |
| Paritas $\ge$ 4 (Grande Multipara) | +4 Poin | Risiko Paritas Tinggi |
| Pre-Hipertensi Gestasional (Sistolik 120–139 / Diastolik 80–89) | +4 Poin | Risiko Tekanan Darah |
| HDK / Preeklamsia Berat (Sistolik $\ge$ 140 / Diastolik $\ge$ 90) | +8 Poin | Red Flag Hipertensi |
| Indikator MAP $\ge$ 90 mmHg (*Mean Arterial Pressure*) | +4 Poin | Deteksi Dini Preeklamsia |
| Edema Ekstremitas Ringan (Kaki) | +4 Poin | Edema |
| Edema Ekstremitas Sedang (Tungkai / Betis) | +4 Poin | Edema |
| Edema Anasarka (Wajah & Kelopak Tangan) | +8 Poin | Red Flag Preeklamsia Berat |
| Nyeri Kepala Berat & Pandangan Kabur | +8 Poin | Red Flag Neurologis |
| Nyeri Epigastrium / Ulu Hati | +8 Poin | Red Flag Impending Eklamsia |
| Anemia / Pucat & Cepat Lelah | +4 Poin | Keluhan Fisik |
| Perdarahan Jalan Lahir / Flek | +8 Poin | Red Flag Obstetri |
| Gerakan Janin Berkurang | +8 Poin | Red Flag Gawat Janin |
| Riwayat Seksio Sesarea (SC) Sebelumnya | +4 Poin | Histori Operasi |

### 3.2 Klasifikasi Tingkat Risiko & Rekomendasi Rujukan

| Rentang Skor / Kondisi | Kategori Risiko | Rekomendasi Tempat Persalinan | Penolong Persalinan |
|---|---|---|---|
| **Skor = 2** | **Risiko Rendah** | Bidan Praktik Mandiri (BPM) / Puskesmas | Bidan Wilayah |
| **Skor 6 – 10** | **Risiko Tinggi** | Puskesmas Rawat Inap / PONED | Bidan & Dokter Umum |
| **Skor $\ge$ 12** atau terdapat *Red Flag* | **Risiko Sangat Tinggi** | Wajib Rujukan Rumah Sakit (Faskes SC) | Dokter Spesialis Kebidanan (Sp.OG) |

> **Catatan Penggunaan Istilah**: Seluruh label status di UI aplikasi menggunakan bahasa yang ramah pengguna (**"Risiko Rendah"**, **"Risiko Tinggi"**, **"Risiko Sangat Tinggi"**) tanpa mencantumkan singkatan teknis medis (seperti *KRR*, *KRT*, *KRST*).

### 3.3 Formula Kalkulasi Usia Kehamilan & HPL (Naegele's Rule)
Calculated automatically based on HPHT (*Hari Pertama Haid Terakhir*):
$$\text{HPL} = (\text{Tgl HPHT} + 7) \quad/\quad (\text{Bln HPHT} - 3) \quad/\quad (\text{Thn HPHT} + 1)$$

---

## 4. Spesifikasi Modul & Fitur Produk

### 4.1 Modul Landing Page (`resources/js/Pages/Welcome.tsx`)
- **Hero Section**:
  - Judul Utama: *"Pendamping Kehamilan & Persalinan Sehat"* (ditata dalam 3 baris terpisah secara eksplisit dengan spasi vertical `space-y-2 sm:space-y-3`).
  - Sub-judul: *"Skrining risiko kehamilan, hitung HPL otomatis, dan panduan terapi komplementer terpercaya."*
  - Tombol Utama: **`Masuk`** (mengarahkan langsung ke Beranda Pasien demo).
- **Section Layanan & Fitur Unggulan**:
  - Menggunakan komponen *Accordion* yang bersih untuk 4 pilar utama (Skrining Kehamilan, Skrining Persalinan, Kamus Kesehatan, Video Terapi).
- **Section Tentang Kami**:
  - Penjelasan visi BundaSehat & kolaborasi kepakaran kebidanan (Bu Asih & Nakes Wilayah). Jarak antar-section disesuaikan secara proporsional.

### 4.2 Modul Beranda Pasien (`resources/js/Pages/Beranda.tsx`)
- **Shortcut Navigation Cards**:
  - Akses cepat ke Skrining Kehamilan, Skrining Persalinan, dan Kamus Kesehatan.
- **Overhauled Screening Result Card (Kartu Full-Width 2-Kolom)**:
  - **Kolom Kiri**: Gambar banner kehamilan dengan *multi-stop linear gradient fade-to-white* yang sangat mulus pada layar desktop (`w-1/2`) dan vertikal pada mobile (`h-28`), dilengkapi tag melayang *"Hasil Skrining Terakhir"*.
  - **Kolom Kanan (Rata Tengah / Centered)**:
    - Informasi HPL dan judul tingkat risiko (`text-2xl sm:text-3xl font-bold`).
    - Pengukur meter risiko 3 warna (*Green - Yellow - Red*) dengan tinggi responsive `h-4 sm:h-5` yang tampil sempurna di layar ponsel.
    - Pin indikator skor melayang yang menunjuk posisi skor risiko pasien (2 - 20 Poin).
    - Penjelasan rekomendasi tempat & penolong persalinan.
    - Tombol aksi: **`Lihat Detail Hasil`** (kiri) dan **`Screening Ulang`** dengan ikon `RefreshCw` (kanan).

### 4.3 Modul Skrining Kehamilan & Persalinan (`Screening/Kehamilan.tsx`, `Persalinan.tsx`, `Hasil.tsx`)
- **Multi-Step Form Flow**:
  - **Step 1**: Data Diri Pasien, NIK, Umur, Paritas, dan Tanggal HPHT.
  - **Step 2**: Pengukuran Tekanan Darah (Sistolik/Diastolik), kalkulasi otomatis MAP, dan tingkat Edema.
  - **Step 3**: Keluhan spesifik trimester dan riwayat medis.
- **Layout Mobile Edge-to-Edge**:
  - Pembungkus pada mobile diatur tanpa padding luar (`px-0 sm:px-6 lg:px-12`) dan tanpa border samping (`border-0 sm:border`).
  - Ketinggian pembungkus menggunakan `min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)]` sehingga rapat dan pas di atas Mobile Bottom Navigation Bar tanpa celah kosong.
- **Hasil & Rujukan Medis (`Hasil.tsx`)**:
  - Ringkasan medis lengkap yang dapat dicetak (*Printable Medical Summary*).

### 4.4 Modul Kamus Kesehatan & Video Terapi (`Kamus/Index.tsx`)
- **Kamus Kesehatan A-Z**:
  - Pencarian kata kunci penyakit, gejala fisik kehamilan, dan penanganan awal.
- **Library Video Terapi Komplementer**:
  - Kartu video dengan *badge category pill* (`TERAPI FISIK`, `SENAM HAMIL`, `RELAKSASI`), durasi video (`6:24`), deskripsi singkat, dan tombol play transparan yang muncul saat kursor diarahkan (*hover-only play icon*).
  - **Cinema Mode Lightbox Player**: Pop-up pemutar video YouTube dengan tema *Dark Lightbox* (`bg-slate-950/80 backdrop-blur-md`), judul putih, dan container slate-900 yang elegan.

### 4.5 Modul Profil Pasien (`Profil/Index.tsx`)
- **Header Profil Pengguna**:
  - Avatar foto bundar pengguna (`https://images.unsplash.com/...`) yang seragam dengan tombol avatar di Navbar Atas.
  - Nama pengguna: **Tegar Rifa'i** (dapat diklik untuk masuk ke mode Edit Data Diri).
- **Sub-View Halaman Dedicated**:
  - **Edit Data Diri**: Form dengan input berbentuk kapsul (*pill-shaped input* `rounded-full h-12`), tombol **`BATAL`** di kiri bawah dan **`SIMPAN PERUBAHAN`** di kanan bawah (`justify-between`).
  - **Riwayat Skrining**: Tabel riwayat pemantauan skoring risiko dengan *badge status* tanpa singkatan (`Ringan`, `Sedang`, `Tinggi`).
  - **Syarat & Ketentuan**, **Kebijakan Privasi**, dan **Bantuan**: Halaman dedicated lengkap dengan tombol kembali `←`.

### 4.6 Modul Layout Global (`Layouts/BundaSehatLayout.tsx`)
- **Navbar Atas Fixed Desktop**:
  - Logo BundaSehat, link navigasi (Beranda, Kehamilan, Persalinan, Kamus, Profil), dan **Tombol Avatar Foto Bundar Pengguna** (tanpa teks nama).
- **Bottom Navigation Bar Mobile (`md:hidden`)**:
  - Bilah navigasi fixed melayang di bawah layar HP (*Softglasses style* `bg-white/75 backdrop-blur-xl border-t border-white/50 shadow-soft-lg`) dengan 5 menu berikon Lucide (Beranda, Kehamilan, Persalinan, Kamus, Profil).

---

## 5. Arsitektur Teknologi & Standar Kode

### 5.1 Technology Stack

| Layer | Teknologi yang Digunakan |
|---|---|
| **Core Backend** | PHP 8.2+ / Laravel 11 Framework |
| **Single Page Bridge** | Inertia.js (React Adapter) |
| **Frontend UI Logic** | React 18 / TypeScript Strict Mode (`no any`) |
| **Styling & Theme** | Vanilla CSS + Tailwind CSS v3 |
| **Icon Library** | Lucide React (Strictly Zero Unicode Emojis in UI) |
| **UI Components** | Custom Modular Components based on Shadcn UI Principles |
| **Build System** | Vite v8 + Rollup Bundler |

### 5.2 Aturan & Guidelines Pengembang (Developer Rules)
1. **Strict No Emoji Icons**: Dilarang keras menggunakan Unicode emoji (misal: 🚀, 💡, ⚙️) sebagai ikon UI. Selalu gunakan pustaka ikon resmi `lucide-react`.
2. **Defensive Coding & Null-Safety**: Selalu sertakan error handling dan null/undefined check pada kalkulasi skor medis dan rendering properti API.
3. **Modular Component Architecture**: Memecah kode ke dalam komponen-komponen kecil dengan fungsi tunggal (Single Responsibility Principle) dengan panjang file < 200 baris.
4. **State Management**: Selalu buatkan visual visual untuk *loading state*, *empty state*, dan *error state*.
5. **No Auto-Commit**: Dilarang melakukan perintah Git commit/push secara otomatis tanpa persetujuan eksplisit dari pengguna.

---

## 6. Rencana Pengujian & Verifikasi (Quality Assurance)

### 6.1 Pengujian Medis & Kalkulasi Skor
- **Skenario 1 (Ibu Hamil Normal)**: HPHT terisi, Usia 25 tahun, Sistolik 110/70, tanpa keluhan $\rightarrow$ Skor 2 (Risiko Rendah).
- **Skenario 2 (Preeklamsia Sedang)**: Sistolik 130/85 (Pre-Hipertensi) + MAP 100 mmHg + Edema Kaki $\rightarrow$ Skor 10 (Risiko Tinggi).
- **Skenario 3 (Emergency / Red Flag)**: Sistolik 150/100 + Nyeri Ulu Hati $\rightarrow$ Skor $\ge$ 12 (Risiko Sangat Tinggi / Wajib Rujukan RS).

### 6.2 Pengujian Tampilan Responsif (Mobile & Desktop)
- **Layar Desktop ($\ge$ 1024px)**: Kartu Beranda tampil 2-kolom split dengan gradasi memudar ke kanan `w-1/2`.
- **Layar HP / Mobile ($<$ 640px)**: Halaman skrining tampil *edge-to-edge full width* tanpa margin luar, height `min-h-[calc(100vh-144px)]` pas di atas bottom navigation bar, dan meteran garis risiko `h-4` tampil utuh.

---

*Dokumen PRD ini disusun sebagai acuan resmi pengembangan dan pemeliharaan aplikasi **BundaSehat**.*
