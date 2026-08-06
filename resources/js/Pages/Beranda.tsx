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
        
        {/* Pure Text Profile Greeting Header (No Icon/Avatar) */}
        <div>
          <Link
            href="/profil"
            className="inline-block group cursor-pointer"
          >
            <p className="text-[11px] text-slate-500 font-medium leading-none mb-0.5">
              Selamat Datang,
            </p>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-rose-600 transition-colors">
              Ibu Rahma Rahayu
            </h1>
          </Link>
        </div>

        {/* SECTION 1: LAYANAN KAMI (HALODOC SIDE-BY-SIDE STYLE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Side: Title & Description (Rata Atas) */}
          <div className="lg:col-span-5 space-y-2.5 pt-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Layanan Utama <span className="text-rose-600">BundaSehat</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Akses cepat layanan screening kehamilan, kesiapan persalinan, serta edukasi kesehatan kebidanan secara terintegrasi.
            </p>
          </div>

          {/* Right Side: Feature Cards Grid (Compact Width) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
            
            {/* Shortcut 1: Screening Kehamilan */}
            <Link
              href="/screening/kehamilan"
              className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center border border-pink-100/80 group-hover:scale-105 transition-transform shrink-0 shadow-soft-xs">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                    Screening Kehamilan
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Cek Risiko Trimester
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>

            {/* Shortcut 2: Screening Persalinan */}
            <Link
              href="/screening/persalinan"
              className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center border border-pink-100/80 group-hover:scale-105 transition-transform shrink-0 shadow-soft-xs">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                    Screening Persalinan
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Kesiapan Bersalin
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>

            {/* Shortcut 3: Kamus Kesehatan */}
            <Link
              href="/kamus"
              className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center border border-pink-100/80 group-hover:scale-105 transition-transform shrink-0 shadow-soft-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                    Kamus Kesehatan
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Edukasi & Terapi Video
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>

            {/* Shortcut 4: Profil Saya */}
            <Link
              href="/profil"
              className="p-3.5 pl-4 pr-5 md:p-4 md:pl-5 md:pr-6 rounded-full bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md hover:border-pink-200 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center border border-pink-100/80 group-hover:scale-105 transition-transform shrink-0 shadow-soft-xs">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors truncate">
                    Profil Saya
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    Riwayat Screening
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </Link>

          </div>
        </section>

        {/* SECTION 2: DATA PROGRESS ATAU HASIL SCREENING TERAKHIR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Data Screening Kehamilan Anda
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
                      Skor: <strong className="font-bold text-slate-900">{screeningResult.total_skor}</strong>
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
