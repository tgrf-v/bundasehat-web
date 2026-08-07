import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
  User,
  LogOut,
  History,
  CheckCircle2,
  Calendar,
  Save,
  ShieldCheck,
  ChevronRight,
  Baby,
  FileText,
  Headphones,
  ArrowLeft,
  X,
} from "lucide-react";

export default function ProfilIndex() {
  const [activeView, setActiveView] = useState<"menu" | "edit_profil" | "riwayat" | "syarat" | "privasi" | "bantuan">("menu");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    nama: "Tegar Rifa'i",
    tanggalLahir: "08/07/2026",
    telepon: "",
    pekerjaan: "Mahasiswa",
    pendidikan: "S-1",
    nik: "3201928301920002",
    hpht: "2025-10-12",
    puskesmas: "Puskesmas Wilayah 1 (Kecamatan A)",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveView("menu");
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.setItem("bundasehat_auth", "false");
    router.visit("/");
  };

  return (
    <BundaSehatLayout activeNav="profil">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
        
        {/* VIEW 1: MAIN MENU LAYOUT */}
        {activeView === "menu" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Profile Header */}
            <div className="flex flex-col items-center justify-center text-center space-y-2 pt-2 pb-4">
              {/* Profile Avatar Image */}
              <div
                onClick={() => setActiveView("edit_profil")}
                className="relative group cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-soft-md bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-all">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                    alt="Foto Profil Pasien"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-rose-600 text-white shadow-soft-sm group-hover:scale-110 transition-transform">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Name & Chevron Clickable to Edit Data Diri */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveView("edit_profil")}
                  className="group inline-flex items-center gap-1.5 text-lg sm:text-xl font-bold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  <span>{profileData.nama}</span>
                  <ChevronRight className="h-5 w-5 text-slate-800 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Belum Program Hamil
                </p>
              </div>
            </div>

            {/* Menu 1: Standalone Card - Riwayat */}
            <Card
              onClick={() => setActiveView("riwayat")}
              className="rounded-3xl border-slate-100 bg-white p-4 sm:p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group space-y-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Baby className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Riwayat
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>

            {/* Menu 2: Grouped Menu Box Card */}
            <Card className="rounded-3xl border-slate-100 bg-white shadow-soft-sm divide-y divide-slate-100 overflow-hidden space-y-0">
              
              {/* Row 1: Syarat dan Ketentuan */}
              <div
                onClick={() => setActiveView("syarat")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Syarat dan Ketentuan
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Row 2: Kebijakan Privasi */}
              <div
                onClick={() => setActiveView("privasi")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Kebijakan Privasi
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Row 3: Bantuan */}
              <div
                onClick={() => setActiveView("bantuan")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Headphones className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Bantuan
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Logout Button Row */}
              <div
                onClick={handleLogout}
                className="p-4 sm:p-5 bg-rose-50/40 hover:bg-rose-100/60 transition-colors cursor-pointer flex items-center justify-between text-rose-600 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="h-5 w-5 text-rose-600" />
                  </div>
                  <span className="font-bold text-sm sm:text-base">
                    Keluar / Logout Akun
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
              </div>

            </Card>

          </div>
        )}

        {/* VIEW 2: HALAMAN DEDIKASI EDIT DATA DIRI (DESAIN SESUAI REFERENSI GAMBAR) */}
        {activeView === "edit_profil" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Bar Navigation */}
            <div className="flex items-center justify-between relative py-2">
              <button
                type="button"
                onClick={() => setActiveView("menu")}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
                Edit Data Diri
              </h2>
            </div>

            {/* Form Container Card */}
            <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-5 border-none sm:border">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {isSaved && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Data diri berhasil disimpan!</span>
                  </div>
                )}

                {/* Field 1: Nama */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-600 mb-1.5 block">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={profileData.nama}
                    onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    className="w-full rounded-full h-12 px-5 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Field 2: Tanggal Lahir */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-600 mb-1.5 block">
                    Tanggal Lahir
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.tanggalLahir}
                      onChange={(e) => setProfileData({ ...profileData, tanggalLahir: e.target.value })}
                      className="w-full rounded-full h-12 pl-5 pr-12 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-slate-800" />
                  </div>
                </div>

                {/* Field 3: Nomor Handphone */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-600 mb-1.5 block">
                    Nomor Handphone
                  </label>
                  <input
                    type="text"
                    value={profileData.telepon}
                    placeholder="Nomor Handphone"
                    onChange={(e) => setProfileData({ ...profileData, telepon: e.target.value })}
                    className="w-full rounded-full h-12 px-5 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Field 4: Pekerjaan */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-600 mb-1.5 block">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={profileData.pekerjaan}
                    onChange={(e) => setProfileData({ ...profileData, pekerjaan: e.target.value })}
                    className="w-full rounded-full h-12 px-5 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Field 5: Pendidikan Terakhir */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-slate-600 mb-1.5 block">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={profileData.pendidikan}
                    onChange={(e) => setProfileData({ ...profileData, pendidikan: e.target.value })}
                    className="w-full rounded-full h-12 px-5 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveView("menu")}
                    className="rounded-full px-7 h-12 border border-rose-400 text-rose-500 font-bold text-xs sm:text-sm hover:bg-rose-50 transition-colors uppercase shrink-0"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="rounded-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wide flex-1 text-center shadow-soft-sm transition-colors"
                  >
                    SIMPAN PERUBAHAN
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* VIEW 3: HALAMAN DEDIKASI RIWAYAT SCREENING */}
        {activeView === "riwayat" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between relative py-2">
              <button
                type="button"
                onClick={() => setActiveView("menu")}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
                Riwayat Skrining Kesehatan
              </h2>
            </div>

            <Card className="rounded-3xl border-slate-100 bg-white overflow-hidden shadow-soft-sm space-y-0">
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-rose-600" />
                  <span>Daftar Pemantauan Skoring Risiko</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Riwayat penentuan skor Poedji Rochjati pada kehamilan & persalinan Anda
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-bold">Tanggal</TableHead>
                      <TableHead className="text-xs font-bold">Jenis</TableHead>
                      <TableHead className="text-xs font-bold">Skor</TableHead>
                      <TableHead className="text-xs font-bold text-right">Status Risiko</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        05 Agu 2026
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">
                        Kehamilan
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">
                        2 Poin
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="ringan" className="text-[10px]">KRR (Ringan)</Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        28 Jul 2026
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">
                        Persalinan
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">
                        2 Poin
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="ringan" className="text-[10px]">KRR (Ringan)</Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        15 Jun 2026
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-600">
                        Kehamilan
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-900">
                        6 Poin
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="sedang" className="text-[10px]">KRT (Sedang)</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VIEW 4: HALAMAN DEDIKASI SYARAT DAN KETENTUAN */}
        {activeView === "syarat" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between relative py-2">
              <button
                type="button"
                onClick={() => setActiveView("menu")}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
                Syarat dan Ketentuan
              </h2>
            </div>

            <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="font-bold text-slate-900 text-base">1. Ketentuan Penggunaan Aplikasi BundaSehat</h3>
              <p>Aplikasi BundaSehat dikembangkan sebagai platform bantuan awal skrining mandiri kehamilan dan persalinan berbasis metode Poedji Rochjati. Seluruh kalkulasi skor bertujuan sebagai panduan deteksi dini risiko kebidanan dan bukan merupakan vonis medis final.</p>

              <h3 className="font-bold text-slate-900 text-base pt-2">2. Tanggung Jawab Pengguna</h3>
              <p>Pengguna berkewajiban memasukkan informasi riwayat kesehatan, HPHT, dan indikator klinis secara jujur dan akurat untuk menjamin ketepatan rekomendasi rujukan faskes.</p>

              <h3 className="font-bold text-slate-900 text-base pt-2">3. Kerahasiaan Rekam Medis</h3>
              <p>Seluruh rekaman data pribadi dan skrining dilindungi dengan sistem enkripsi dan hanya digunakan untuk keperluan pelayanan medis resmi.</p>
            </Card>
          </div>
        )}

        {/* VIEW 5: HALAMAN DEDIKASI KEBIJAKAN PRIVASI */}
        {activeView === "privasi" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between relative py-2">
              <button
                type="button"
                onClick={() => setActiveView("menu")}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
                Kebijakan Privasi
              </h2>
            </div>

            <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="font-bold text-slate-900 text-base">1. Pengumpulan Informasi Pribadi</h3>
              <p>BundaSehat mengumpulkan data penting seperti Nama, NIK, tanggal HPHT, dan faskes rujukan domisili semata-mata untuk mengintegrasikan layanan rujukan kesehatan ibu dan anak.</p>

              <h3 className="font-bold text-slate-900 text-base pt-2">2. Keamanan Data Pasien</h3>
              <p>Kami tidak pernah menjual atau membagikan data rekam kesehatan pasien kepada pihak ketiga di luar jaringan Puskesmas dan Rumah Sakit Rujukan resmi terdaftar.</p>
            </Card>
          </div>
        )}

        {/* VIEW 6: HALAMAN DEDIKASI BANTUAN */}
        {activeView === "bantuan" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between relative py-2">
              <button
                type="button"
                onClick={() => setActiveView("menu")}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
                Bantuan & Dukungan
              </h2>
            </div>

            <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Memiliki kendala teknis atau pertanyaan seputar pemantauan kehamilan Anda? Tim medis dan support kami siap membantu.
              </p>

              <div className="p-5 rounded-3xl bg-emerald-50 text-emerald-900 border border-emerald-100 space-y-3">
                <div className="font-bold flex items-center gap-2 text-emerald-700 text-sm">
                  <Headphones className="h-5 w-5" />
                  <span>Hotline Bidan & Consultation Center</span>
                </div>
                <div className="text-xs space-y-1 text-emerald-800">
                  <p><strong>WhatsApp Support:</strong> +62 812-3456-7890</p>
                  <p><strong>Jam Operasional:</strong> Senin - Minggu (24 Jam Emergency)</p>
                  <p><strong>Email Resmi:</strong> help@bundasehat.id</p>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </BundaSehatLayout>
  );
}
