import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DatePicker } from "@/Components/ui/date-picker";
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
  Bell,
  BellRing,
  FileText,
  Headphones,
  Info,
  RefreshCw,
  ArrowLeft,
  X,
} from "lucide-react";

export default function ProfilIndex() {
  const [activeView, setActiveView] = useState<"menu" | "edit_profil" | "riwayat">("menu");
  const [activeModal, setActiveModal] = useState<"syarat" | "privasi" | "bantuan" | null>(null);
  const [notificationActive, setNotificationActive] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    nama: "Ibu Rahma Rahayu",
    nik: "3201928301920002",
    hpht: "2025-10-12",
    telepon: "081234567890",
    puskesmas: "Puskesmas Wilayah 1 (Kecamatan A)",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveView("menu");
    }, 1800);
  };

  const handleLogout = () => {
    localStorage.setItem("bundasehat_auth", "false");
    router.visit("/");
  };

  const toggleNotification = () => {
    setNotificationActive(!notificationActive);
  };

  return (
    <BundaSehatLayout activeNav="profil">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
        
        {/* VIEW 1: MAIN MENU LAYOUT (TAMPILAN UTAMA SEPERTI DI GAMBAR) */}
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
                  HPHT: 12 Okt 2025 · Usia Kehamilan 24 Minggu
                </p>
              </div>
            </div>

            {/* Menu 1: Standalone Card - Riwayat Kehamilan */}
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
                    Riwayat Kehamilan
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>

            {/* Menu 2: Grouped Menu Box Card */}
            <Card className="rounded-3xl border-slate-100 bg-white shadow-soft-sm divide-y divide-slate-100 overflow-hidden space-y-0">
              
              {/* Row 1: Notifikasi */}
              <div
                onClick={toggleNotification}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    notificationActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"
                  }`}>
                    {notificationActive ? (
                      <BellRing className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Bell className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm sm:text-base transition-colors ${
                      notificationActive ? "text-slate-800 group-hover:text-emerald-600" : "text-amber-500 group-hover:text-amber-600"
                    }`}>
                      {notificationActive ? "Notifikasi Sudah Aktif" : "Notifikasi Belum Aktif"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {notificationActive ? "Pengingat jadwal kontrol & minum vitamin aktif" : "Klik untuk mengaktifkan notifikasi"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Row 2: Syarat dan Ketentuan */}
              <div
                onClick={() => setActiveModal("syarat")}
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

              {/* Row 3: Kebijakan Privasi */}
              <div
                onClick={() => setActiveModal("privasi")}
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

              {/* Row 4: Bantuan */}
              <div
                onClick={() => setActiveModal("bantuan")}
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

              {/* Row 5: Versi Aplikasi */}
              <div className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    Versi Aplikasi 3.16.0 (beta)
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>

              {/* Row 6: Update Aplikasi */}
              <div
                onClick={() => alert("Aplikasi Anda sudah menggunakan versi terbaru (v3.16.0)!")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:rotate-180 transition-transform duration-500">
                    <RefreshCw className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Update Aplikasi
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

        {/* VIEW 2: EDIT DATA DIRI FORM */}
        {activeView === "edit_profil" && (
          <div className="space-y-6 animate-fadeIn">
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Menu Profil</span>
            </button>

            <Card className="rounded-3xl border-slate-200/80 shadow-soft-sm bg-white overflow-hidden space-y-0">
              <form onSubmit={handleSaveProfile}>
                <CardHeader className="border-b border-slate-100 p-6">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-rose-600" />
                    <span>Perbarui Data Diri Pasien</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Kelola data identitas, tanggal HPHT, dan Puskesmas rujukan domisili Anda
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 p-6">
                  {isSaved && (
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Data profil berhasil diperbarui!</span>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="nama_profil">Nama Lengkap Pasien</Label>
                    <Input
                      id="nama_profil"
                      value={profileData.nama}
                      onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nik_profil">Nomor NIK KTP</Label>
                    <Input
                      id="nik_profil"
                      value={profileData.nik}
                      onChange={(e) => setProfileData({ ...profileData, nik: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hpht_profil">Hari Pertama Haid Terakhir (HPHT)</Label>
                    <DatePicker
                      id="hpht_profil"
                      value={profileData.hpht}
                      onChange={(val) => setProfileData({ ...profileData, hpht: val })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="puskesmas_profil">Puskesmas / Faskes Rujukan Domisili</Label>
                    <Input
                      id="puskesmas_profil"
                      value={profileData.puskesmas}
                      onChange={(e) => setProfileData({ ...profileData, puskesmas: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveView("menu")}
                    className="font-bold text-xs"
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="rose" className="gap-2 font-bold text-xs shadow-soft-sm">
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}

        {/* VIEW 3: RIWAYAT KEHAMILAN / SCREENING */}
        {activeView === "riwayat" && (
          <div className="space-y-6 animate-fadeIn">
            <button
              type="button"
              onClick={() => setActiveView("menu")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Menu Profil</span>
            </button>

            <Card className="rounded-3xl border-slate-200/80 shadow-soft-sm bg-white overflow-hidden space-y-0">
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-rose-600" />
                  <span>Riwayat Kehamilan & Hasil Screening</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Daftar tanggal pemantauan skoring risiko yang telah dilakukan
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

        {/* MODAL DIALOGS FOR SYARAT, PRIVASI & BANTUAN */}
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <Card className="max-w-lg w-full rounded-3xl bg-white overflow-hidden shadow-soft-xl border-none space-y-0 animate-scaleUp">
              <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {activeModal === "syarat" && "Syarat dan Ketentuan"}
                  {activeModal === "privasi" && "Kebijakan Privasi"}
                  {activeModal === "bantuan" && "Pusat Bantuan & Dukungan"}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeModal === "syarat" && (
                  <>
                    <p className="font-bold text-slate-800">1. Ketentuan Penggunaan Aplikasi BundaSehat</p>
                    <p>Aplikasi ini ditujukan sebagai alat skrining awal mandiri kehamilan dan persalinan berbasis kartu Poedji Rochjati. Hasil skrining bukan pengganti diagnosis medis resmi dokter spesialis kandungan.</p>
                    <p className="font-bold text-slate-800 pt-2">2. Tanggung Jawab Pengguna</p>
                    <p>Pengguna wajib memasukkan data klinis HPHT, usia kehamilan, dan faktor risiko secara akurat demi mendapatkan rekomendasi rujukan faskes yang tepat.</p>
                  </>
                )}

                {activeModal === "privasi" && (
                  <>
                    <p className="font-bold text-slate-800">1. Perlindungan Data Rekam Medis</p>
                    <p>BundaSehat menjamin kerahasiaan data NIK, domisili, dan riwayat skrining kesehatan kehamilan Anda sesuai dengan regulasi perlindungan data pribadi medis nasional.</p>
                    <p className="font-bold text-slate-800 pt-2">2. Penggunaan Data Klinis</p>
                    <p>Data skrining hanya diakses oleh tenaga kesehatan di Puskesmas rujukan terdaftar untuk penanganan dan pemantauan risiko kehamilan Anda.</p>
                  </>
                )}

                {activeModal === "bantuan" && (
                  <div className="space-y-4">
                    <p>Butuh bantuan teknis atau memiliki pertanyaan seputar hasil skrining kehamilan Anda?</p>
                    <div className="p-4 rounded-2xl bg-rose-50 text-rose-900 border border-rose-100 space-y-2">
                      <div className="font-bold flex items-center gap-2 text-rose-700">
                        <Headphones className="h-4 w-4" />
                        <span>Layanan Bidan & Support 24/7</span>
                      </div>
                      <p className="text-xs">WhatsApp Hotline: +62 812-3456-7890</p>
                      <p className="text-xs">Email: support@bundasehat.id</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="rose"
                  className="font-bold text-xs shadow-soft-sm"
                >
                  Tutup
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </BundaSehatLayout>
  );
}
