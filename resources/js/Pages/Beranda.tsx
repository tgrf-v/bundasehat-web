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
        


        {/* SECTION 1: LAYANAN KAMI (HALODOC SIDE-BY-SIDE STYLE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Side: Title & Description (Rata Atas) */}
          <div className="lg:col-span-5 space-y-2.5 pt-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
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
                <h3 className="font-bold text-slate-900 text-base">Belum Ada Data Screening Kehamilan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan screening fisik dan tensi darah pertama Anda untuk mengetahui tingkat risiko komplikasi dan panduan kesehatan.
                </p>
              </div>

              <Link
                href="/screening/kehamilan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-xs shadow-soft-sm hover:bg-rose-600 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Mulai Screening Sekarang</span>
              </Link>
            </Card>
          ) : (
            /* FILLED STATE: HASIL SCREENING TERAKHIR (CENTERED OVERLAY CARD WITH NEWBORN BANNER IMAGE) */
            <div className="relative rounded-3xl overflow-hidden p-3 sm:p-6 pb-4">
              
              {/* Soft Background Banner Image Accent Header */}
              <div
                className="absolute inset-x-0 top-0 h-52 sm:h-64 bg-cover bg-center rounded-3xl -z-0 opacity-90"
                style={{ backgroundImage: "url('/images/screening-banner.jpg?v=2')" }}
              >
                {/* Soft Gradient Overlay over Image to ensure contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-rose-900/20 via-pink-900/30 to-slate-900/60 backdrop-blur-[1px] rounded-3xl" />
              </div>

              {/* Floating White Card (Overlay, rounded-2xl, shadow-lg) */}
              <Card className="relative z-10 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 text-center max-w-2xl mx-auto mt-20 sm:mt-28">
                
                {/* Centered Vertical Flow */}
                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                  
                  {/* Header Subtitle Context Line */}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">
                      Tingkat Risiko Ibu Hamil • HPL: <span className="font-bold text-slate-700">{screeningResult.taksiran_hpl || "19 Juli 2026"}</span>
                    </p>
                    {/* Judul Risiko */}
                    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
                      screeningResult.kategori_risiko === "KRR"
                        ? "text-emerald-700"
                        : screeningResult.kategori_risiko === "KRT"
                        ? "text-amber-700"
                        : "text-rose-600"
                    }`}>
                      {screeningResult.status_label}
                    </h2>
                  </div>

                  {/* Tri-Color Segmented Risk Gauge Meter with Floating Black Pin */}
                  <div className="relative w-full max-w-md mx-auto pt-2 pb-7">
                    {/* Tri-Color Bar (Green - Yellow - Red - Clean Flush Rounded Ends) */}
                    <div className="h-4.5 sm:h-5 w-full rounded-full flex overflow-hidden">
                      <div className="flex-1 bg-[#64B565]" />
                      <div className="flex-1 bg-[#F7D154]" />
                      <div className="flex-1 bg-[#F83838]" />
                    </div>

                    {/* Floating Black Score Pin Pointer (Black Pill + Arrow) */}
                    {(() => {
                      const score = screeningResult.total_skor || 2;
                      const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                      return (
                        <div
                          className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                          style={{ left: `${percent}%` }}
                        >
                          {/* Triangle Pointer Up */}
                          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                          {/* Black Pill Badge */}
                          <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                            {score}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Deskripsi Rekomendasi */}
                  <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                    Rekomendasi Penolong: <strong className="font-bold text-slate-800">{screeningResult.rekomendasi_tempat} ({screeningResult.penolong_persalinan})</strong>
                  </p>

                </div>

                {/* Bottom Action Footer (Left: Lihat Detail, Right: Screening Ulang) */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-5 px-1 sm:px-4">
                  <Link
                    href="/screening/kehamilan"
                    className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Lihat Detail Hasil
                  </Link>

                  <Link
                    href="/screening/kehamilan"
                    className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Screening Ulang</span>
                  </Link>
                </div>

              </Card>
            </div>
          )}
        </section>

      </div>
    </BundaSehatLayout>
  );
}
