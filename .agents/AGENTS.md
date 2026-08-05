# Proyek BundaSehat - Workspace Rules & Behavioral Guidelines

File ini berisi seluruh panduan pengembangan, aturan ketat, dan spesifikasi proyek **BundaSehat** (Web Screening Komplikasi Ibu Hamil & Persalinan).

---

## ⛔ ATURAN KETAT (MUST FOLLOW AT ALL TIMES)

### 1. No Auto-Commit / Auto-Push (DILARANG SANGAT KERAS)
- **DILARANG KERAS** menjalankan perintah `git add`, `git commit`, `git push`, atau perintah Git apa pun secara otomatis!
- **WAJIB** menunggu instruksi atau izin eksplisit dari user sebelum mengeksekusi perintah Git apa pun.

### 2. Strictly No Emoji Icons
- **DILARANG KERAS** menggunakan Unicode emoji (seperti 🚀, 💡, ⚙️, ❌, 🩺) sebagai ikon pada UI/komponen.
- **WAJIB** selalu menggunakan pustaka ikon resmi `lucide-react`.

### 3. Button Styling Rule
- Semua tombol (Button) **WAJIB** menggunakan gaya melengkung sempurna (`rounded-full`).

### 4. Modern Component Library First
- Prioritaskan penggunaan Tailwind CSS dengan komponen berbasis **Shadcn UI** yang diletakkan di `resources/js/Components/ui/`.
- Hindari gaya HTML native yang terlihat seperti template default.

### 5. States Matter (Loading, Empty, & Error State)
- Selalu buatkan visual yang jelas untuk **Loading State** (spinner/skeleton), **Empty State** (jika data kosong), dan **Error State** (jika validasi/API gagal) pada komponen yang mengambil atau memproses data.

### 6. No Truncated Code
- Selalu tulis kode secara lengkap dari awal hingga akhir.
- **DILARANG** memotong kode dengan komentar seperti `// ... rest of the code` atau `// TODO: implement logic`.

### 7. TypeScript Strictness
- Hindari penggunaan tipe `any`. Definisikan `interface` atau `type` eksplisit di `resources/js/types/` untuk setiap props, state, dan respons API.

### 8. Modular Components
- Pecah kode ke dalam komponen-komponen kecil yang memiliki fungsi tunggal (*Single Responsibility Principle*).
- Jaga file komponen agar tidak terlalu panjang (&lt;200 baris per file).

### 9. Defensive Coding
- Selalu sertakan error handling (`try-catch`, `null`/`undefined` check) pada kalkulasi skoring, HPHT, MAP, atau pemanggilan API.

### 10. Brief Context After Code
- Berikan penjelasan perubahan kode secara singkat dan to-the-point di **BAWAH** blok kode, bukan sebelum kode.

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
