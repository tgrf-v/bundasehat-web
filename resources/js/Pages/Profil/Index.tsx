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
  Activity,
  Stethoscope,
} from "lucide-react";

export default function ProfilIndex() {
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
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.setItem("bundasehat_auth", "false");
    router.visit("/");
  };

  return (
    <BundaSehatLayout activeNav="profil">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <Badge variant="rose" className="gap-1.5 mb-1">
              <User className="h-3.5 w-3.5" />
              <span>Profil Saya & Pengaturan</span>
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Pengaturan Akun Pasien
            </h1>
            <p className="text-xs text-slate-500">
              Kelola data diri, tanggal HPHT, dan pantau riwayat screening kehamilan Anda
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={handleLogout}
            className="gap-2 font-bold shadow-soft-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar / Logout</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Edit Data Diri */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="rounded-3xl border-slate-200/80 shadow-soft-sm bg-white overflow-hidden">
              <form onSubmit={handleSaveProfile}>
                <CardHeader className="border-b border-slate-100 p-6">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-rose-600" />
                    <span>Data Diri Ibu Hamil</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Perbarui tanggal HPHT dan Faskes rujukan domisili
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

                <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
                  <Button type="submit" variant="rose" className="gap-2 font-bold shadow-soft-sm">
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Right Column: Riwayat Hasil Screening (History Log Table) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="rounded-3xl border-slate-200/80 shadow-soft-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-rose-600" />
                  <span>Riwayat Hasil Screening Saya</span>
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
                        <Badge variant="ringan" className="text-[10px]">🟩 KRR (Ringan)</Badge>
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
                        <Badge variant="ringan" className="text-[10px]">🟩 KRR (Ringan)</Badge>
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
                        <Badge variant="sedang" className="text-[10px]">🟨 KRT (Sedang)</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </BundaSehatLayout>
  );
}
