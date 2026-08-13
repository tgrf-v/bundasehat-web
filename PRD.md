# Product Requirement Document (PRD) — BundaSehat Application
**Nama Proyek**: BundaSehat — Web Pendamping Kehamilan & Persalinan Sehat  
**Arsitektur Sistem**: Full-Stack Single Page Application (Laravel + Inertia.js + React) + FastAPI Machine Learning Microservice  
**Tema Desain UI**: Sage Green (`#4F7361` / `emerald-700`) & Warm Coral (`#E28B72` / `coral-500`)  
**Lokasi File Proyek**: `c:\laragon\www\bundasehat`  

---

## 1. Ringkasan Eksekutif & Visi Sistem
BundaSehat adalah aplikasi web berbasis kesehatan ibu dan anak yang mengintegrasikan dua mode sistem keputusan:
1. **Decision Support System (DSS) untuk Ibu Hamil**: Fitur skrining mandiri ringkas (4-5 input umum) untuk deteksi dini risiko kehamilan, estimasi HPL, dan rujukan awal ke Bidan.
2. **Expert System (ES) untuk Bidan / Tenaga Kesehatan**: Fitur pemeriksaan medis medis komprehensif (15 variabel klinis & lab) berbasis Kartu Skor Poedji Rochjati (KSPR), Mean Arterial Pressure (MAP), dan **Model Machine Learning (FastAPI)** untuk diagnosis resmi komplikasi persalinan.

---

## 2. Arsitektur Multi-Role & Hak Akses (RBAC)

### A. Superadmin
- Memiliki hak akses penuh untuk mengelola pengguna.
- **Tugas Utama**: Membuat dan mengelola akun **Bidan** (`name`, `email`, `password`, `no_str`, `puskesmas_wilayah`).

### B. Bidan (Admin Faskes / Expert System User)
- Akun dibuatkan secara resmi oleh **Superadmin**.
- Memiliki hak akses khusus ke modul **Expert System (ES)**.
- Mengisi **15 Parameter Klinis & Laboratorium** saat pasien berkunjung ke klinik.
- Mengeksekusi prediksi diagnosis Machine Learning (via FastAPI).
- Melihat rekam medis seluruh pasien di wilayahnya & menerbitkan rujukan faskes resmi (Puskesmas PONED / RS SpOG).

### C. Ibu Hamil (User Biasa / Decision Support System User)
- Mendaftarkan akun secara mandiri (*Self Registration*).
- Memiliki hak akses ke modul **Decision Support System (DSS)**.
- Mengisi **4 Parameter Umum Mandiri** (Umur, Pekerjaan, Pendidikan, HPHT/Usia Kehamilan, Paritas).
- Melihat hasil estimasi HPL, panduan terapi komplementer, dan riwayat skrining pribadi.

---

## 3. Spesifikasi Database Schema (MySQL / PostgreSQL)

### 3.1 Tabel `users`
| Nama Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | BigInteger (PK) | Auto Increment |
| `name` | String | Nama Lengkap |
| `email` | String (Unique) | Email Login |
| `password` | String | Hash Hashing (Bcrypt) |
| `role` | Enum | `'superadmin'`, `'bidan'`, `'ibu_hamil'` |
| `no_telepon` | String (Nullable) | Nomor WhatsApp / HP |
| `created_at` | Timestamp | Waktu Pendaftaran |

### 3.2 Tabel `bidan_profiles`
| Nama Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | BigInteger (PK) | Auto Increment |
| `user_id` | BigInteger (FK) | Relasi ke `users.id` |
| `no_str` | String | Nomor Surat Tanda Registrasi Bidan |
| `puskesmas_wilayah` | String | Wilayah Faskes Penugasan |

### 3.3 Tabel `screenings` (Data Skrining DSS & ES - 15 Variabel Medis)
Tabel ini menyimpan 15 variabel lengkap sesuai spesifikasi model Machine Learning:

| No | Kolom Database | Tipe Data | Skala ML | Pengisi | Keterangan / Pilihan Nilai |
|---|---|---|---|---|---|
| 1 | `id` | BigInteger (PK) | - | System | Unique ID Skrining |
| 2 | `ibu_hamil_id` | BigInteger (FK) | - | System | Relasi ke `users.id` (Pasien) |
| 3 | `bidan_id` | BigInteger (FK) | - | Bidan | Relasi ke `users.id` (Bidan penguji, Null jika DSS) |
| 4 | `tipe_screening` | Enum | - | System | `'dss'` (Ibu Hamil) atau `'es'` (Bidan) |
| 5 | **`umur`** | Integer | Ordinal | Ibu Hamil / Bidan | Umur pasien (Tahun) |
| 6 | **`pekerjaan`** | String | Nominal | Ibu Hamil / Bidan | IRT, PNS, Wiraswasta, Swasta, Petani, Pelajar |
| 7 | **`pendidikan`** | String | Ordinal | Ibu Hamil / Bidan | SD, SLTP, SLTA, Diploma, Sarjana, Magister |
| 8 | **`gravida`** | Integer | Rasio | Ibu Hamil / Bidan | Jumlah kehamilan |
| 9 | **`paritas`** | Integer | Rasio | Ibu Hamil / Bidan | Jumlah kelahiran |
| 10 | **`abortus`** | Integer | Rasio | Ibu Hamil / Bidan | Jumlah keguguran |
| 11 | **`imt`** | Decimal(4,2) | Ordinal | Bidan (ES) | Indeks Massa Tubuh (kg/m²) |
| 12 | **`td_sistolik`** | Integer | Kontinu | Bidan (ES) | Tekanan Darah Sistolik (mmHg) |
| 13 | **`td_diastolik`** | Integer | Kontinu | Bidan (ES) | Tekanan Darah Diastolik (mmHg) |
| 14 | **`letak_janin`** | String | Nominal | Bidan (ES) | Kepala Bawah, Sungsang, Lintang |
| 15 | **`umur_kehamilan`** | Integer | Ordinal | Ibu Hamil / Bidan | Usia kehamilan (Minggu) |
| 16 | **`jenis_persalinan`** | String | Nominal | Bidan (ES) | Normal, SC, Vacum, Induksi |
| 17 | **`hb`** | Decimal(4,2) | Rasio | Bidan (ES) | Kadar Hemoglobin (g/dL) |
| 18 | **`leokosit`** | Integer | Rasio | Bidan (ES) | Jumlah Leukosit (/mm³) |
| 19 | **`trombosit`** | Integer | Rasio | Bidan (ES) | Jumlah Trombosit (/mm³) |
| 20 | **`skor_kspr`** | Integer | Rasio | System | Kalkulasi Skor Poedji Rochjati |
| 21 | **`map_value`** | Decimal(5,2) | Kontinu | System | Mean Arterial Pressure |
| 22 | **`diagnosa_komplikasi`** | String | Nominal | FastAPI ML | Hasil Prediksi Model ML (Target) |
| 23 | `rekomendasi_faskes` | Text | - | System | Rekomendasi Penolong & Tempat Bersalin |
| 24 | `created_at` | Timestamp | - | System | Waktu Skrining |

---

## 4. Kontrak Integrasi FastAPI Machine Learning Microservice

- **URL Service**: `POST http://localhost:8000/predict`
- **Header**: `Content-Type: application/json`

### Payload Request (Dikirim dari Laravel ke FastAPI):
```json
{
  "umur": 28,
  "pekerjaan": "Ibu Rumah Tangga",
  "pendidikan": "SLTA",
  "gravida": 2,
  "paritas": 1,
  "abortus": 0,
  "imt": 24.5,
  "td_sistolik": 130,
  "td_diastolik": 85,
  "letak_janin": "Kepala Bawah",
  "umur_kehamilan": 34,
  "jenis_persalinan": "Normal",
  "hb": 11.2,
  "leokosit": 8500,
  "trombosit": 250000
}
```

### Response JSON (Dikembalikan dari FastAPI ke Laravel):
```json
{
  "status": "success",
  "diagnosa_komplikasi": "Pre-Eklamsia Ringan & Anemia Gestasional",
  "tingkat_risiko": "KRT",
  "skor_risiko_ml": 0.87,
  "rekomendasi_tindakan": "Pendampingan Bidan Wilayah & Rujukan Puskesmas PONED"
}
```

---

## 5. Rute API Backend Laravel (API Endpoints)

### A. Auth Routes
- `POST /api/register` — Pendaftaran mandiri Ibu Hamil
- `POST /api/login` — Autentikasi (Superadmin, Bidan, Ibu Hamil)
- `POST /api/logout` — Revoke session / token

### B. Superadmin Routes (`middleware: auth, role:superadmin`)
- `GET /api/admin/bidan` — Daftar akun Bidan
- `POST /api/admin/bidan` — Tambah akun Bidan baru
- `DELETE /api/admin/bidan/{id}` — Nonaktifkan akun Bidan

### C. Ibu Hamil DSS Routes (`middleware: auth, role:ibu_hamil`)
- `POST /api/screening/dss` — Simpan 4 input mandiri
- `GET /api/screening/history` — Riwayat skrining pribadi

### D. Bidan ES Routes (`middleware: auth, role:bidan`)
- `GET /api/bidan/pasien` — Daftar seluruh pasien terdaftar
- `POST /api/screening/es` — Simpan 15 input klinis medis (Laravel meneruskan payload ke FastAPI ML)
- `GET /api/screening/{id}/print` — Detail surat rujukan medis resmi

---

## 6. Status Frontend yang Sudah Selesai (React Components)
1. **Navigasi & Routing SPA**:
   - `/` $\rightarrow$ `Beranda` (Halaman utama terlindungi autentikasi).
   - `/login` $\rightarrow$ Halaman login/register bersih tanpa link luar.
   - `/tentang-kami` $\rightarrow$ Landing page hero banner & accordion fitur kebidanan.
   - `/screening/kehamilan` & `/screening/persalinan` $\rightarrow$ Form 3-step interaktif & summary card rujukan.
   - `/kamus` $\rightarrow$ Katalog istilah medis A-Z & galeri video terapi komplementer HD.
   - `/profil` $\rightarrow$ Manajemen profil & riwayat.
2. **Design System & Palette**:
   - Primary: **Sage Green** (`#4F7361` / `emerald-700`).
   - Accent: **Warm Coral** (`#E28B72` / `coral-500`).
   - Bebas Unicode Emoji (100% Lucide React Icons).
