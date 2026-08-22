import React from "react";
import { Button } from "@/Components/ui/button";
import { Activity, Plus } from "lucide-react";
import { ScreeningResult } from "@/types/screening";

interface InitialScreeningStateProps {
  recentScreenings?: ScreeningResult[];
  latestScreening?: ScreeningResult | null;
  onStartScreening: () => void;
  onViewDetail: (screening: ScreeningResult) => void;
}

export function InitialScreeningState({
  recentScreenings,
  latestScreening,
  onStartScreening,
  onViewDetail,
}: InitialScreeningStateProps) {
  // Ambil list riwayat (utamakan recentScreenings, fallback ke latestScreening jika array)
  const screenings = recentScreenings && recentScreenings.length > 0
    ? recentScreenings
    : latestScreening
    ? [latestScreening]
    : [];

  if (screenings.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-between animate-fadeIn py-2 sm:py-4">
        <div className="space-y-4 text-center my-auto py-8">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100/80 shadow-soft-xs">
            <Activity className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
              Belum ada hasil screening
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Yuk lakukan screening untuk mengetahui kondisi kehamilan Anda.
            </p>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <Button
            type="button"
            onClick={onStartScreening}
            className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-3 shadow-soft-sm inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Mulai Screening</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between animate-fadeIn space-y-6">
      {/* List Kartu Riwayat Screening (Maksimal 2 Riwayat di Bagian Atas) */}
      <div className="space-y-3">
        {screenings.slice(0, 2).map((item, index) => {
          const score = item.total_skor || item.skor_poedji_rochjati || 2;
          const isLow = item.kategori_risiko === "KRR";
          const isMed = item.kategori_risiko === "KRT";

          const badgeText = isLow
            ? "Risiko Rendah"
            : isMed
            ? "Risiko Sedang"
            : "Risiko Tinggi";

          const badgeColorClass = isLow
            ? "bg-emerald-50 text-emerald-800 border-emerald-100/80"
            : isMed
            ? "bg-amber-50 text-amber-800 border-amber-100/80"
            : "bg-rose-50 text-rose-800 border-rose-100/80";

          const mainRiskTitle = isLow
            ? "Rendah / Ringan"
            : isMed
            ? "Tinggi / Sedang"
            : "Sangat Tinggi / Berat";

          const riskTextColor = isLow
            ? "text-emerald-700"
            : isMed
            ? "text-amber-600"
            : "text-rose-600";

          // Format short date string e.g. "22 Agu, 07:35"
          const rawDate = item.created_at || "22 Agu 2026, 07:35 WIB";
          const dateFormatted = rawDate
            .replace("August", "Agu")
            .replace("Agustus", "Agu")
            .replace(" WIB", "");
          const hplText = item.taksiran_hpl ? ` · HPL ${item.taksiran_hpl}` : "";

          const cardHeaderTitle = index === 0 ? "Hasil Screening Terakhir" : "Riwayat Screening Sebelumnya";

          return (
            <div
              key={item.id || item.kode_screening || index}
              className="w-full bg-white border border-slate-200/90 shadow-soft-xs rounded-3xl p-5 sm:p-6 space-y-3 transition-all hover:border-slate-300"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {cardHeaderTitle}
                </h3>
                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${badgeColorClass}`}>
                  {badgeText}
                </span>
              </div>

              {/* Main Risk Text */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className={`text-xl sm:text-2xl font-bold tracking-tight ${riskTextColor}`}>
                  {mainRiskTitle}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  {score} Poin KSPR
                </span>
              </div>

              {/* Divider & Bottom Row */}
              <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500 font-medium">
                  {dateFormatted}{hplText}
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    onClick={() => onViewDetail(item)}
                    className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-1.5 h-8.5 shadow-soft-xs"
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol CTA Screening Baru di Dasar / Paling Bawah */}
      <div className="pt-4 mt-auto">
        <Button
          type="button"
          onClick={onStartScreening}
          className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-3 shadow-soft-sm flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Screening Baru</span>
        </Button>
      </div>
    </div>
  );
}
