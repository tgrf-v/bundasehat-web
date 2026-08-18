import React, { useState } from "react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Dialog } from "@/Components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ScreeningResult } from "@/types/screening";
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
  HelpCircle,
  Headphones,
  ArrowLeft,
  X,
  Inbox,
  AlertTriangle,
  MapPin,
  Building,
  Briefcase,
  GraduationCap,
  Phone,
  CreditCard,
} from "lucide-react";

import { PageProps } from "@/types";

interface ProfileFormData {
  name: string;
  no_telepon: string;
  nik: string;
  tanggal_lahir: string;
  pekerjaan: string;
  pendidikan: string;
  hpht: string;
  puskesmas: string;
}

type ProfilPageProps = PageProps<{
  screenings: ScreeningResult[];
}>;

export default function ProfilIndex() {
  const { auth, screenings } = usePage<ProfilPageProps>().props;
  const user = auth.user;

  const [activeView, setActiveView] = useState<"menu" | "edit_profil" | "riwayat" | "syarat" | "privasi" | "bantuan">("menu");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const form = useForm<ProfileFormData>({
    name: user.name || "",
    no_telepon: user.no_telepon || "",
    nik: user.nik || "",
    tanggal_lahir: user.tanggal_lahir || "",
    pekerjaan: user.pekerjaan || "",
    pendidikan: user.pendidikan || "",
    hpht: user.hpht || "",
    puskesmas: user.puskesmas || "",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    form.patch(route("profile.update"), {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          setActiveView("menu");
        }, 1200);
      },
    });
  };

  const handleLogoutConfirm = () => {
    router.post(route("logout"));
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-soft-md bg-emerald-700 text-white flex items-center justify-center group-hover:scale-105 transition-all text-3xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-10 w-10 text-white" />}
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
                  <span>{user.name}</span>
                  <ChevronRight className="h-5 w-5 text-slate-800 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                </button>

                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {user.role === "superadmin"
                    ? "Superadmin Kebidanan"
                    : user.role === "bidan"
                    ? "Bidan Faskes Wilayah"
                    : "Ibu Hamil / Pasien Terdaftar"}
                </p>
              </div>
            </div>

            {/* Menu 1: Single Riwayat Card */}
            <Card
              onClick={() => setActiveView("riwayat")}
              className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Baby className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    Riwayat Skrining
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Card>

            {/* Menu 2: Grouped Menu Box Card */}
            <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] divide-y divide-slate-100 overflow-hidden space-y-0">
              
              {/* Row 1: Syarat dan Ketentuan */}
              <div
                onClick={() => setActiveView("syarat")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    Syarat dan Ketentuan
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
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
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    Kebijakan Privasi
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Row 3: Bantuan */}
              <div
                onClick={() => setActiveView("bantuan")}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    Bantuan
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Logout Button Row */}
              <div
                onClick={() => setIsLogoutModalOpen(true)}
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

        {/* VIEW 2: HALAMAN DEDIKASI EDIT DATA DIRI */}
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
            <Card className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-5">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {isSaved && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Data diri berhasil disimpan ke database!</span>
                  </div>
                )}

                {Object.keys(form.errors).length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium space-y-1 animate-fadeIn">
                    {Object.values(form.errors).map((err, idx) => (
                      <p key={idx} className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        <span>{err}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Field 1: Nama */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    placeholder="Nama Lengkap"
                    required
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.name && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.name}</p>}
                </div>

                {/* Field 2: NIK */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={form.data.nik}
                    onChange={(e) => form.setData("nik", e.target.value)}
                    placeholder="16 Digit NIK KTP"
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.nik && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.nik}</p>}
                </div>

                {/* Field 3: Nomor Handphone / WA */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Nomor WhatsApp / Handphone
                  </label>
                  <input
                    type="tel"
                    value={form.data.no_telepon}
                    placeholder="Contoh: 081234567890"
                    onChange={(e) => form.setData("no_telepon", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.no_telepon && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.no_telepon}</p>}
                </div>

                {/* Field 4: Tanggal Lahir */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={form.data.tanggal_lahir}
                    onChange={(e) => form.setData("tanggal_lahir", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.tanggal_lahir && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.tanggal_lahir}</p>}
                </div>

                {/* Field 5: Pekerjaan */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={form.data.pekerjaan}
                    placeholder="Contoh: Ibu Rumah Tangga / Karyawan"
                    onChange={(e) => form.setData("pekerjaan", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.pekerjaan && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.pekerjaan}</p>}
                </div>

                {/* Field 6: Pendidikan Terakhir */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={form.data.pendidikan}
                    placeholder="Contoh: SMA / S-1"
                    onChange={(e) => form.setData("pendidikan", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.pendidikan && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.pendidikan}</p>}
                </div>

                {/* Field 7: HPHT (Khusus Ibu Hamil) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Hari Pertama Haid Terakhir (HPHT)
                  </label>
                  <input
                    type="date"
                    value={form.data.hpht}
                    onChange={(e) => form.setData("hpht", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.hpht && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.hpht}</p>}
                </div>

                {/* Field 8: Wilayah Puskesmas Domisili */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Puskesmas Domisili / Rujukan
                  </label>
                  <input
                    type="text"
                    value={form.data.puskesmas}
                    placeholder="Contoh: Puskesmas Kecamatan Cilandak"
                    onChange={(e) => form.setData("puskesmas", e.target.value)}
                    className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                  {form.errors.puskesmas && <p className="text-[11px] text-rose-500 mt-1 pl-3">{form.errors.puskesmas}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveView("menu")}
                    className="rounded-full px-6 h-11 border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors uppercase shrink-0"
                  >
                    Batal
                  </button>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={form.processing}
                    className="rounded-full px-7 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide text-center shadow-soft-sm transition-colors shrink-0"
                  >
                    {form.processing ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
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

            <Card className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-0">
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
                {screenings.length > 0 ? (
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
                      {screenings.map((s: ScreeningResult) => (
                        <TableRow
                          key={s.kode_screening}
                          className="cursor-pointer hover:bg-slate-50/70 transition-colors"
                          onClick={() => {
                            if (s.id) {
                              router.visit(route("screening.show", { screening: s.id }));
                            }
                          }}
                        >
                          <TableCell className="text-xs font-semibold text-slate-800">
                            {s.created_at}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-600">
                            {s.input_summary.tipe_screening === "kehamilan" ? "Kehamilan" : "Persalinan"}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-900">
                            {s.skor_poedji_rochjati} Poin
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={s.tingkat_risiko === "Berat" ? "berat" : s.tingkat_risiko === "Sedang" ? "sedang" : "ringan"}
                              className="text-[10px]"
                            >
                              {s.tingkat_risiko}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                      <Inbox className="h-7 w-7 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Belum Ada Riwayat</p>
                      <p className="text-xs text-slate-500 mt-0.5">Anda belum pernah melakukan screening. Mulai screening pertama Anda sekarang.</p>
                    </div>
                    <Link href="/screening/kehamilan">
                      <Button variant="default" size="sm" className="gap-1.5 text-xs font-bold mt-1">
                        Mulai Screening
                      </Button>
                    </Link>
                  </div>
                )}
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
              <h3 className="font-bold text-slate-900 text-base">1. Ketentuan Penggunaan Aplikasi</h3>
              <p>Aplikasi ini dikembangkan sebagai platform bantuan awal skrining mandiri kehamilan dan persalinan berbasis metode Poedji Rochjati. Seluruh kalkulasi skor bertujuan sebagai panduan deteksi dini risiko kebidanan dan bukan merupakan vonis medis final.</p>

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
              <p>Aplikasi ini mengumpulkan data penting seperti Nama, NIK, tanggal HPHT, dan faskes rujukan domisili semata-mata untuk mengintegrasikan layanan rujukan kesehatan ibu dan anak.</p>

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
                  <p><strong>Email Resmi:</strong> help@aplikasi.id</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL KONFIRMASI LOGOUT */}
        <Dialog
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Konfirmasi Keluar"
          description="Apakah Anda yakin ingin keluar dari akun BundaSehat?"
          className="max-w-md"
        >
          <div className="pt-2 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Anda harus masuk kembali menggunakan email dan kata sandi Anda untuk mengakses rekam medis dan data skrining.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-full text-xs font-bold px-5"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="default"
                onClick={handleLogoutConfirm}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6"
              >
                Ya, Keluar
              </Button>
            </div>
          </div>
        </Dialog>

      </div>
    </BundaSehatLayout>
  );
}
