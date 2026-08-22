export interface ProfileFormData {
  name: string;
  no_telepon: string;
  nik: string;
  tanggal_lahir: string;
  pekerjaan: string;
  pendidikan: string;
  foto_profil?: File | null;
  hapus_foto?: boolean;
}
