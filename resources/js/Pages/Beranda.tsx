import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
  Activity,
  BookOpen,
  User,
  Stethoscope,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { ScreeningResult } from "@/types/screening";

export default function Beranda() {
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("latest_screening_result");
    if (savedResult) {
      try {
        setScreeningResult(JSON.parse(savedResult));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <BundaSehatLayout activeNav="beranda">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
        
        {/* Profile Greeting Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 md:p-8 shadow-soft-md relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left Info */}
            <div className="space-y-2 max-w-xl">
              <Badge variant="rose" className="bg-white/20 text-white border-white/30 backdrop-blur-sm gap-1.5 py-0.5 px-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Status Akun Pasien Aktif</span>
              </Badge>
              <h1 className="text-2xl md:text-3xl font-black">
                Selamat Datang, Ibu Rahma Rahayu 👋
              </h1>
              <p className="text-xs md:text-sm text-pink-100 font-medium">
                Puskesmas Wilayah 1 &bull; HPHT: 12 Oktober 2025
              </p>

              <div className="pt-2">
                <Link
                  href="/screening/kehamilan"
                  className="px-5 py-2.5 rounded-full bg-white text-rose-600 font-extrabold text-xs shadow-soft-sm hover:bg-pink-50 transition-all shrink-0 inline-flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Screening Kehamilan</span>
                </Link>
              </div>
            </div>

            {/* Right Woman Illustration */}
            <div className="hidden sm:block shrink-0">
              <img
                src="/pregnant-woman.svg"
                alt="Ilustrasi Ibu Hamil"
                className="h-36 md:h-44 w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform"
              />
            </div>

          </div>
        </div>

        {/* SECTION 1: LAYANAN (SHORTCUT FITUR KHAS HALODOC) */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-500" />
            <span>Layanan Utama BundaSehat</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            
            {/* Shortcut 1: Screening Kehamilan */}
            <Link
              href="/screening/kehamilan"
              className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-slate-900 text-xs md:text-sm">Screening Kehamilan</span>
              <span className="text-[10px] text-slate-500">Cek Risiko Trimester</span>
            </Link>

            {/* Shortcut 2: Screening Persalinan */}
            <Link
              href="/screening/persalinan"
              className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-slate-900 text-xs md:text-sm">Screening Persalinan</span>
              <span className="text-[10px] text-slate-500">Kesiapan Bersalin</span>
            </Link>

            {/* Shortcut 3: Kamus Kesehatan */}
            <Link
              href="/kamus"
              className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-slate-900 text-xs md:text-sm">Kamus Kesehatan</span>
              <span className="text-[10px] text-slate-500">Edukasi & Terapi Video</span>
            </Link>

            {/* Shortcut 4: Profil Saya */}
            <Link
              href="/profil"
              className="p-4 md:p-5 rounded-2xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-slate-900 text-xs md:text-sm">Profil Saya</span>
              <span className="text-[10px] text-slate-500">Riwayat Screening</span>
            </Link>

          </div>
        </section>

        {/* SECTION 2: DATA PROGRESS ATAU HASIL SCREENING TERAKHIR */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              <span>Data Screening Kehamilan Anda</span>
            </h2>

            {screeningResult && (
              <Link
                href="/screening/kehamilan"
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Screening Ulang</span>
              </Link>
            )}
          </div>

          {!screeningResult ? (
            /* EMPTY STATE: BELUM ADA DATA SCREENING */
            <Card className="p-8 border-dashed border-slate-200 bg-white text-center rounded-3xl space-y-4">
              <div className="h-16 w-16 rounded-full bg-pink-50 text-rose-500 flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8" />
              </div>
              
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-slate-900 text-base">Belum Ada Data Screening Kehamilan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan screening fisik dan tensi darah pertama Anda untuk mengetahui tingkat risiko komplikasi dan panduan kesehatan.
                </p>
              </div>

              <Link
                href="/screening/kehamilan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-soft-sm hover:bg-rose-600 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Mulai Screening Sekarang</span>
              </Link>
            </Card>
          ) : (
            /* FILLED STATE: HASIL SCREENING TERAKHIR ADA */
            <Card className="border-slate-200/80 shadow-soft-sm bg-white rounded-3xl p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hasil Terakhir:</span>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge
                      variant={
                        screeningResult.kategori_risiko === "KRR"
                          ? "ringan"
                          : screeningResult.kategori_risiko === "KRT"
                          ? "sedang"
                          : "berat"
                      }
                      className="text-xs font-extrabold py-1 px-3"
                    >
                      {screeningResult.status_label}
                    </Badge>

                    <span className="text-xs text-slate-500">
                      Skor Poedji Rochjati: <strong className="font-bold text-slate-900">{screeningResult.total_skor}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-400 block">Taksiran Persalinan (HPL):</span>
                  <span className="text-sm font-extrabold text-rose-600">{screeningResult.taksiran_hpl || "18 November 2026"}</span>
                </div>
              </div>

              {/* Progress Gauge Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Tingkat Risiko Komplikasi:</span>
                  <span className="text-rose-600">{screeningResult.total_skor} Poin</span>
                </div>
                <Progress
                  value={Math.min((screeningResult.total_skor / 20) * 100, 100)}
                  variant={screeningResult.kategori_risiko === "KRR" ? "emerald" : screeningResult.kategori_risiko === "KRT" ? "amber" : "rose"}
                  className="h-3"
                />
              </div>

              {/* Detail Ringkasan */}
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-2 text-xs text-rose-950">
                <p className="font-bold text-rose-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Rekomendasi Tempat & Penolong Persalinan:</span>
                </p>
                <p className="font-semibold text-slate-800 leading-relaxed pl-5">
                  {screeningResult.rekomendasi_tempat} ({screeningResult.penolong_persalinan})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Link
                  href="/screening/kehamilan"
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>Lihat Detail Hasil Lengkap</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/screening/kehamilan"
                  className="px-5 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-soft-sm hover:bg-rose-600 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Lakukan Screening Ulang</span>
                </Link>
              </div>

            </Card>
          )}
        </section>

      </div>
    </BundaSehatLayout>
  );
}
