# Proyek BundaSehat - Workspace Rules & Behavioral Guidelines

File ini berisi seluruh panduan pengembangan, aturan ketat, dan spesifikasi proyek **BundaSehat** (Web Screening Komplikasi Ibu Hamil & Persalinan).

---

## ⛔ ATURAN KETAT (MUST FOLLOW AT ALL TIMES)

### 1. DILARANG LANGSUNG EDIT KODE SAAT USER BERTANYA / DISKUSI (SANGAT KETAT)
- **DILARANG KERAS** langsung melakukan edit/modifikasi file kode ketika prompt user bersifat bertanya, berdiskusi, menganalisis, atau menggunakan frasa seperti *"aku tanya aja nih"*, *"kenapa bisa begini"*, *"menurutmu gimana"*, atau sejenisnya!
- **WAJIB** selalu menjawab, menjelaskan, atau memberikan analisis terlebih dahulu dan **MENUNGGU KONFIRMASI / INSTRUKSI EKSPLISIT** dari user sebelum melakukan perubahan kode apa pun pada file proyek.

### 2. No Auto-Commit / Auto-Push (DILARANG SANGAT KERAS)
- **DILARANG KERAS** menjalankan perintah `git add`, `git commit`, `git push`, atau perintah Git apa pun secara otomatis!
- **WAJIB** menunggu instruksi atau izin eksplisit dari user sebelum mengeksekusi perintah Git apa pun.

### 3. Strictly No Emoji Icons
- **DILARANG KERAS** menggunakan Unicode emoji (seperti 🚀, 💡, ⚙️, ❌, 🩺) sebagai ikon pada UI/komponen.
- **WAJIB** selalu menggunakan pustaka ikon resmi `lucide-react`.

### 4. Button & Control Styling Rule
- Semua tombol (Button), Input text, Select trigger, dan DatePicker **WAJIB** menggunakan gaya melengkung sempurna (`rounded-full`).

### 5. Modern Component Library First
- Prioritaskan penggunaan Tailwind CSS dengan komponen berbasis **Shadcn UI** yang diletakkan di `resources/js/Components/ui/`.
- Hindari gaya HTML native yang terlihat seperti template default.

### 6. States Matter (Loading, Empty, & Error State)
- Selalu buatkan visual yang jelas untuk **Loading State** (spinner/skeleton), **Empty State** (jika data kosong), dan **Error State** (jika validasi/API gagal) pada komponen yang mengambil atau memproses data.

### 7. No Truncated Code
- Selalu tulis kode secara lengkap dari awal hingga akhir.
- **DILARANG** memotong kode dengan komentar seperti `// ... rest of the code` atau `// TODO: implement logic`.

### 8. TypeScript Strictness
- Hindari penggunaan tipe `any`. Definisikan `interface` atau `type` eksplisit di `resources/js/types/` untuk setiap props, state, dan respons API.

### 9. Modular Components
- Pecah kode ke dalam komponen-komponen kecil yang memiliki fungsi tunggal (*Single Responsibility Principle*).
- Jaga file komponen agar tidak terlalu panjang (<200 baris per file).

### 10. Defensive Coding
- Selalu sertakan error handling (`try-catch`, `null`/`undefined` check) pada kalkulasi skoring, HPHT, MAP, atau pemanggilan API.

### 11. Brief Context After Code
- Berikan penjelasan perubahan kode secara singkat dan to-the-point di **BAWAH** blok kode, bukan sebelum kode.

### 12. No Extra-Bold Font Weight (Ketebalan Teks Maksimal Bold)
- **DILARANG KERAS** menggunakan font weight extra bold (`font-extrabold`, `font-black`, `font-800`, `font-900`) di seluruh antarmuka (UI).
- **WAJIB** membatasi ketebalan font maksimal sampai tingkat `font-bold` (`font-700`) agar tampilan UI tetap clean, elegan, professional, dan nyaman dibaca.

### 13. DILARANG MENGGUNAKAN AMBIENT GLOW TANPA IZIN EKSPLISIT
- **DILARANG KERAS** menambahkan efek ambient glow, colored gradient blobs, atau background blur warna-warni tanpa izin dan persetujuan eksplisit dari user!
- Setiap rancangan atau modifikasi desain visual **WAJIB** meminta izin dan menunggu persetujuan eksplisit dari user sebelum diterapkan.

### 14. DILARANG MENGGUNAKAN SECTION BADGE / EYEBROW BADGE TANPA IZIN EKSPLISIT
- **DILARANG KERAS** menambahkan section badge, eyebrow tag, pill chip, atau label kategori kecil di atas judul halaman tanpa instruksi atau izin eksplisit dari user!
- Jika user tidak meminta secara spesifik, **JANGAN PERNAH** menambahkan elemen section badge di antarmuka mana pun.

### 15. DILARANG KERAS MENGAMBIL INISIATIF SENDIRI / MENAMBAHKAN ELEMEN DI LUAR INSTRUKSI (SANGAT KETAT)
- **AI ADALAH ALAT**, USER ADALAH PEMEGANG KEPUTUSAN TERTINGGI.
- **DILARANG KERAS** menambah komponen, kartu (cards), bento grid, seksi baru, fitur, atau merombak layout yang **TIDAK PERNAH DIMINTA SECARA EKSPLISIT** oleh user!
- **WAJIB** hanya mengeksekusi instruksi persis yang diminta oleh user (*Zero Assumptions & Strict Scope Lock*). Segala ide atau penambahan elemen baru **HARUS MENDAPAT IZIN / PERSETUJUAN EKSPLISIT DARI USER** terlebih dahulu sebelum boleh dibuat.

### 16. SPESIFIKASI STRUKTUR NAVBAR BERDASARKAN ROLE (STRICT SCOPE LOCK)
- **Superadmin**: `[Logo] [Search] Beranda | Screening ▾ | Kamus Kesehatan | Tentang Kami | Admin ▾ [Avatar]`
- **Admin / Bidan**: `[Logo] [Search] Beranda | Screening ▾ | Kamus Kesehatan | Tentang Kami [Avatar]`
- **Pasien / Guest**: Landing page header / Login trigger.
- **DILARANG KERAS** menambah menu baru, mengubah struktur hierarki navigasi, atau mengotak-atik permission/role logic navbar tanpa instruksi eksplisit dari user.

---

## 📌 Ringkasan Spesifikasi Proyek BundaSehat

- **Fokus Aplikasi**: Web Screening dan Klasifikasi Tingkat Risiko Komplikasi Ibu Hamil & Persalinan.
- **Teknologi**: Laravel 12 + Inertia.js (React 19 + TypeScript) + Tailwind CSS + Shadcn UI + Lucide Icons.
- **Inspirasi UI/UX**: Menggabungkan nuansa clean & professional ala **Halodoc** (accent Rose `#E11D48`) dengan fitur kebidanan spesifik ala **Hamilku.ID** (primary Emerald `#059669`).
- **Pendekatan Layout**: Responsive Web Design dengan pendekatan **Mobile-First**.

### 👥 3 Peran Pengguna (Roles):
1. **Super Admin (Bu Asih - Dosen Kebidanan)**: Manage Master Data & Kamus Kesehatan, upload & re-train dataset ML (500–10.000 data), analytics & statistik risiko.
2. **Admin (Bidan & Nakes Wilayah)**: Riwayat hasil screening pasien wilayah, filter status risiko (KRT/KRST), input rujukan/intervensi.
3. **Pasien (Ibu Hamil / User Umum)**: Landing page, kalkulator HPHT, form screening kehamilan & persalinan, melihat tingkat risiko (Ringan/Sedang/Berat), panduan terapi komplementer non-obat, dan rekomendasi Faskes.
