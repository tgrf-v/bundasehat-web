import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, ChevronRight, Inbox } from "lucide-react";
import { ScreeningResult } from "@/types/screening";

interface ProfilRiwayatTableProps {
  screenings: ScreeningResult[];
  onBack: () => void;
}

export function ProfilRiwayatTable({
  screenings,
  onBack,
}: ProfilRiwayatTableProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Bar Navigation */}
      <div className="flex items-center justify-between relative py-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
          Riwayat Skrining Kesehatan
        </h2>
      </div>

      {/* List of Screening History Cards */}
      {screenings.length > 0 ? (
        <div className="space-y-3">
          {screenings.map((s: ScreeningResult, index) => {
            const score = s.total_skor || s.skor_poedji_rochjati || 2;
            const isLow = s.kategori_risiko === "KRR" || s.tingkat_risiko === "Ringan" || score <= 5;
            const isMed = s.kategori_risiko === "KRT" || s.tingkat_risiko === "Sedang" || (score >= 6 && score <= 10);

            const riskTitle = isLow
              ? "Risiko Rendah / Ringan"
              : isMed
              ? "Risiko Tinggi / Sedang"
              : "Risiko Sangat Tinggi / Berat";

            const barColorClass = isLow
              ? "bg-emerald-600"
              : isMed
              ? "bg-amber-500"
              : "bg-rose-600";

            const dotColorClass = isLow
              ? "bg-emerald-600"
              : isMed
              ? "bg-amber-500"
              : "bg-rose-600";

            // Date string e.g. "22 Agu 2026, 07:35 WIB"
            const rawDate = s.created_at || "22 Agu 2026, 07:35 WIB";
            const dateFormatted = rawDate
              .replace("August", "Agu")
              .replace("Agustus", "Agu");
            const hplText = s.taksiran_hpl ? ` · HPL ${s.taksiran_hpl}` : "";

            return (
              <div
                key={s.id || s.kode_screening || index}
                onClick={() => {
                  if (s.id) {
                    router.visit(route("screening.show", { screening: s.id }));
                  }
                }}
                className="w-full bg-white border border-slate-200/80 hover:border-slate-300 shadow-soft-xs hover:shadow-soft-sm rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all cursor-pointer group"
              >
                {/* Left Side: Vertical Bar + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Vertical Accent Stripe */}
                  <div className={`w-1 self-stretch rounded-full my-0.5 shrink-0 ${barColorClass}`} />

                  <div className="space-y-1 min-w-0 text-left">
                    {/* Top Row: Color Dot + Risk Title + Score */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColorClass}`} />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {riskTitle}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-500">
                        · {score} Poin
                      </span>
                    </div>

                    {/* Bottom Row: Date & HPL */}
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      {dateFormatted}{hplText}
                    </p>
                  </div>
                </div>

                {/* Right Side: Chevron Icon */}
                <div className="shrink-0 pl-1">
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-slate-100 bg-white p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Inbox className="h-8 w-8 text-slate-400" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">Belum Ada Riwayat</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Anda belum pernah melakukan screening. Mulai screening pertama Anda sekarang untuk memantau kesehatan kehamilan.
            </p>
          </div>
          <Link href="/screening/kehamilan">
            <Button
              variant="default"
              size="default"
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 h-10 shadow-soft-sm gap-2 mt-2"
            >
              <span>Mulai Screening</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
