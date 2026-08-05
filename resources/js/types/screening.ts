export type UserRole = 'pasien' | 'admin' | 'super_admin';

export interface PasienData {
  nama: string;
  nik?: string;
  umur: number;
  paritas: number;
  hpht?: string;
  usiaKehamilanMinggu: number;
  hpl?: string;
  wilayahPuskesmas?: string;
}

export type EdemaLevel = 'none' | 'ringan_kaki' | 'sedang_tungkai' | 'berat_wajah_tangan';

export interface ScreeningInput {
  nama_pasien: string;
  nik?: string;
  umur: number;
  paritas: number;
  hpht?: string;
  sistolik: number;
  diastolik: number;
  edema_level: EdemaLevel;
  keluhan_spesifik: string[];
  sudah_dapat_treatment: boolean;
  detail_treatment?: string;
  tipe_screening: 'kehamilan' | 'persalinan';
  wilayah_puskesmas?: string;
}

export type RiskLevel = 'Ringan' | 'Sedang' | 'Berat';

export interface ScreeningResult {
  kode_screening: string;
  skor_poedji_rochjati: number;
  tingkat_risiko: RiskLevel;
  map_value: number;
  potensi_komplikasi: string[];
  rekomendasi_faskes: string;
  saran_terapi_ids: number[];
  input_summary: ScreeningInput;
  created_at: string;
}

export interface KamusItem {
  id: number;
  judul: string;
  slug: string;
  kategori: 'edukasi' | 'terapi_komplementer' | 'pertolongan_pertama';
  ringkasan: string;
  konten: string;
  tingkat_risiko_target: 'Semua' | 'Ringan' | 'Sedang' | 'Berat';
  panduan_langkah?: string[];
  sumber_referensi?: string;
  is_active: boolean;
}

export interface DatasetMlMetric {
  id: number;
  nama_dataset: string;
  jumlah_sampel: number;
  akurasi: number;
  precision_score: number;
  recall_score: number;
  is_active: boolean;
  created_at: string;
}
