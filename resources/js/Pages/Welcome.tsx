import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { calculateGestationalAge } from "@/lib/scoringEngine";
import { UserRole } from "@/types/screening";
import {
  Activity,
  Heart,
  Calendar,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  BarChart3,
  Award,
} from "lucide-react";

export default function Welcome() {
  const [currentRole, setCurrentRole] = useState<UserRole>("pasien");
  const [hphtInput, setHphtInput] = useState<string>("");
  const [calcResult, setCalcResult] = useState<{ weeks: number; dueDate?: string } | null>(null);

  const handleCalculateHPHT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hphtInput) return;
    const res = calculateGestationalAge(hphtInput);
    setCalcResult(res);
  };

  return (
    <BundaSehatLayout activeRole={currentRole} onRoleChange={setCurrentRole} activeNav="beranda">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text & Main CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Sistem Screening Kebidanan Bu Asih</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Screening Dini & Klasifikasi <span className="text-rose-600">Risiko Komplikasi</span> Ibu Hamil
            </h1>

            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Deteksi potensi preeklamsia, hipertensi gestasional, dan edema dengan skoring kebidanan terpercaya. Dapatkan rekomendasi faskes & terapi komplementer non-obat secara presisi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href="/screening/kehamilan">
                <Button size="lg" variant="rose" className="w-full sm:w-auto shadow-soft-md gap-2">
                  <Activity className="h-5 w-5" />
                  <span>Mulai Screening Kehamilan</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/kamus">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <span>Kamus & Terapi</span>
                </Button>
              </Link>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Skor Poedji Rochjati</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-rose-500" />
                <span>Rujukan Faskes Presisi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick HPHT Calculator Card (Inspired by Hamilku.ID) */}
          <div className="lg:col-span-5">
            <Card className="border-emerald-100 shadow-soft-lg bg-white/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-full pointer-events-none" />
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">Kalkulator HPHT Cepat</CardTitle>
                    <CardDescription className="text-xs">Hitung Usia Kehamilan & HPL Bunda secara instan</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <form onSubmit={handleCalculateHPHT} className="space-y-3">
                  <div>
                    <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT)</Label>
                    <Input
                      id="hpht"
                      type="date"
                      value={hphtInput}
                      onChange={(e) => setHphtInput(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <Button type="submit" variant="default" className="w-full text-xs font-bold gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Hitung Usia Kehamilan</span>
                  </Button>
                </form>

                {calcResult && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-800 font-medium">Usia Kehamilan:</span>
                      <Badge variant="ringan" className="text-xs font-bold">{calcResult.weeks} Minggu</Badge>
                    </div>
                    {calcResult.dueDate && (
                      <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                        <span className="text-xs text-emerald-800 font-medium">Perkiraan Lahir (HPL):</span>
                        <span className="text-xs font-bold text-emerald-900">{calcResult.dueDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Main Feature Menu Grid (Halodoc x Hamilku Style) */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-2">Layanan Utama</Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Fitur Unggulan BundaSehat
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Pilih jenis screening atau jelajahi kamus kesehatan kehamilan terpadu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Screening Kehamilan */}
          <Link href="/screening/kehamilan" className="group">
            <Card className="h-full border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-soft-md group-hover:-translate-y-1">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                    Screening Kehamilan
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Input tensi darah, edema, & keluhan fisik untuk deteksi dini risiko komplikasi.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 pt-2">
                  <span>Mulai Screening</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Screening Persalinan */}
          <Link href="/screening/persalinan" className="group">
            <Card className="h-full border-slate-100 hover:border-rose-200 transition-all duration-300 hover:shadow-soft-md group-hover:-translate-y-1">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-rose-700 transition-colors">
                    Screening Persalinan
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Evaluasi kesiapan tempat persalinan & rekomendasi tingkat nakes (BPM/RS).
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-rose-600 gap-1 pt-2">
                  <span>Isi Form Persalinan</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Kamus Kesehatan */}
          <Link href="/kamus" className="group">
            <Card className="h-full border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-soft-md group-hover:-translate-y-1">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                    Kamus Kesehatan
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Artikel pengetahuan komplikasi & pertolongan pertama kehamilan.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 pt-2">
                  <span>BACA ARTIKEL</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 4: Terapi Komplementer */}
          <Link href="/kamus" className="group">
            <Card className="h-full border-slate-100 hover:border-rose-200 transition-all duration-300 hover:shadow-soft-md group-hover:-translate-y-1">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-rose-700 transition-colors">
                    Terapi Komplementer
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Panduan relaksasi, peredam edema non-obat & latihan fisik terpandu.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-rose-600 gap-1 pt-2">
                  <span>Lihat Panduan</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* Role Showcase Preview Section (Menampilkan Keunggulan 3 Role) */}
      <section className="py-10 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Hak Akses & Alur Kerja 3 Peran (Role)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sistem disesuaikan untuk Pasien, Bidan Wilayah, dan Super Admin Dosen Kebidanan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Super Admin Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-600 text-white rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Super Admin (Bu Asih)</h4>
                  <p className="text-[10px] text-slate-500">Dosen Kebidanan & ML Manager</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Upload & re-train dataset ML (500-10.000 data)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Kelola Master Data Kamus & Terapi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Lihat statistik & analytics risiko keseluruhan</span>
                </li>
              </ul>
            </div>

            {/* Admin Bidan Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Admin (Bidan & Nakes)</h4>
                  <p className="text-[10px] text-slate-500">Petugas Puskesmas Wilayah</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Pantau riwayat hasil screening pasien wilayah</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Filter status risiko tinggi (KRT / KRST)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Input intervensi medis & rujukan lanjutan</span>
                </li>
              </ul>
            </div>

            {/* Pasien Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-800 text-white rounded-xl">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Pasien (Ibu Hamil / Umum)</h4>
                  <p className="text-[10px] text-slate-500">Pengguna Aplikasi Utama</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Isi form screening kehamilan & persalinan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dapatkan hasil skor & rekomendasi tempat bersalin</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Akses panduan terapi komplementer pereda gejala</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </BundaSehatLayout>
  );
}
