import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { ScreeningResult } from "@/types/screening";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Printer,
  Sparkles,
  ArrowLeft,
  Hospital,
  Stethoscope,
  Heart,
  Calendar,
  User,
  FileText,
  ChevronRight,
  BrainCircuit,
  Scale,
  FlaskConical,
} from "lucide-react";

import { PageProps } from "@/types";

type HasilPageProps = PageProps<{
  screening: ScreeningResult;
}>;

export default function HasilScreening() {
  const { screening: result } = usePage<HasilPageProps>().props;

  const handlePrint = () => {
    window.print();
  };

  if (!result) return null;

  const isBerat = result.tingkat_risiko === "Berat" || result.kategori_risiko === "KRST";
  const isSedang = result.tingkat_risiko === "Sedang" || result.kategori_risiko === "KRT";

  return (
    <BundaSehatLayout activeNav="kehamilan">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header Output Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isBerat ? "berat" : isSedang ? "sedang" : "ringan"} className="py-1 px-3">
                {result.kode_screening}
              </Badge>
              <span className="text-xs text-slate-500 font-medium">{result.created_at}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Hasil Screening & Rekomendasi Medis
            </h1>
            <p className="text-xs text-slate-500">
              Pasien: <strong className="text-slate-800">{result.input_summary?.nama_pasien || result.nama_pasien}</strong> ({result.input_summary?.umur} Tahun)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-semibold rounded-full">
              <Printer className="h-4 w-4" />
              <span>Cetak Hasil</span>
            </Button>
            <Link href="/screening/kehamilan">
              <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold rounded-full bg-rose-600 hover:bg-rose-700 text-white">
                <Activity className="h-4 w-4" />
                <span>Screening Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* RISK STATUS HERO CARD */}
        <Card className={`border-2 overflow-hidden shadow-soft-lg rounded-3xl ${
          isBerat
            ? "border-rose-300 bg-gradient-to-b from-rose-50/80 to-white"
            : isSedang
            ? "border-amber-300 bg-gradient-to-b from-amber-50/80 to-white"
            : "border-emerald-300 bg-gradient-to-b from-emerald-50/80 to-white"
        }`}>
          <CardContent className="p-6 text-center space-y-4">
            
            <div className="flex justify-center">
              {isBerat ? (
                <div className="p-3.5 bg-rose-600 text-white rounded-full shadow-soft-md">
                  <ShieldAlert className="h-10 w-10" />
                </div>
              ) : isSedang ? (
                <div className="p-3.5 bg-amber-500 text-white rounded-full shadow-soft-md">
                  <AlertTriangle className="h-10 w-10" />
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-600 text-white rounded-full shadow-soft-md">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                TINGKAT RISIKO KOMPLIKASI KEHAMILAN
              </p>
              <h2 className={`text-3xl sm:text-4xl font-bold mt-1 ${
                isBerat ? "text-rose-600" : isSedang ? "text-amber-600" : "text-emerald-700"
              }`}>
                {result.status_label || `RISIKO ${result.tingkat_risiko.toUpperCase()}`}
              </h2>
            </div>

            {/* Visual Risk Gauge Meter */}
            <div className="max-w-md mx-auto space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span className="text-emerald-700">KRR (Skor 2-5)</span>
                <span className="text-amber-700">KRT (Skor 6-10)</span>
                <span className="text-rose-600">KRST (&ge;12)</span>
              </div>
              <Progress
                value={Math.min(Math.max((result.skor_poedji_rochjati / 20) * 100, 10), 100)}
                variant="riskGauge"
                className="h-3.5 rounded-full"
              />
              <p className="text-xs font-semibold text-slate-700 pt-1">
                Total Skor KSPR: <strong className="text-slate-900 font-bold">{result.skor_poedji_rochjati}</strong> | MAP: <strong className="text-slate-900 font-bold">{result.map_value} mmHg</strong>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* MACHINE LEARNING DIAGNOSIS CARD */}
        {result.diagnosa_ml && (
          <Card className="border-0 bg-slate-900 text-white rounded-3xl shadow-soft-xl overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <BrainCircuit className="h-5 w-5 text-rose-500" />
                  <span>Hasil Prediksi Model XGBoost Machine Learning</span>
                </div>
                {result.skor_risiko_ml && (
                  <Badge className="bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-xs px-2.5 py-0.5">
                    Confidence: {Math.round(result.skor_risiko_ml * 100)}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-xs font-medium text-slate-400">Diagnosis Komplikasi Dominan:</span>
                <h3 className="text-2xl font-bold text-white tracking-wide mt-0.5">
                  {result.diagnosa_ml}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Berdasarkan evaluasi terhadap 15 parameter klinis rekam medis maternal (antropometri IMT, tensi sistol/diastol, paritas, letak janin, dan lab darah).
                </p>
              </div>

              {/* Probabilities Distribution */}
              {result.probabilitas_ml && Object.keys(result.probabilitas_ml).length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                    Distribusi Probabilitas Multi-Komplikasi:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.entries(result.probabilitas_ml).map(([dis, pr]) => (
                      <div key={dis} className="p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 truncate text-[11px]">{dis}</span>
                          <span className="font-bold text-rose-400 text-xs">{Math.round(pr * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pr * 100, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* GRID RESULTS & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Diagnosa Potensi Komplikasi */}
          <Card className="border-slate-200/80 shadow-soft-sm rounded-3xl">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-600" />
                <span>Gejala & Faktor Risiko Terdeteksi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3 space-y-2">
              {result.potensi_komplikasi && result.potensi_komplikasi.length > 0 ? (
                result.potensi_komplikasi.map((komplikasi, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{komplikasi}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-emerald-50/50 rounded-xl">
                  Tidak terdeteksi komplikasi berat.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Rekomendasi Faskes & Penolong */}
          <Card className="border-slate-200/80 shadow-soft-sm rounded-3xl">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Hospital className="h-5 w-5 text-emerald-600" />
                <span>Rekomendasi Rujukan & Faskes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3 space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-semibold leading-relaxed">
                {result.rekomendasi_faskes}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Ringkasan Parameter Klinis Pasien:</p>
                <p>&bull; Tekanan Darah: <strong>{result.input_summary?.sistolik}/{result.input_summary?.diastolik} mmHg</strong></p>
                <p>&bull; IMT: <strong>{result.input_summary?.imt || "Normal"} kg/m²</strong> | Hb: <strong>{result.input_summary?.hb || 12.0} g/dL</strong></p>
                <p>&bull; Paritas: <strong>G{result.input_summary?.gravida || 1} P{result.input_summary?.paritas} A{result.input_summary?.abortus || 0}</strong></p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* COMPLEMENTARY THERAPY SUGGESTIONS SECTION */}
        <Card className="border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 to-slate-50 shadow-soft-sm rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-600 text-white rounded-2xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Saran Terapi Komplementer Mandiri</CardTitle>
                <CardDescription className="text-xs">Panduan non-obat yang disesuaikan dengan kondisi risiko pasien</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-soft-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">1. Relaksasi Napas Dalam (Deep Breathing) & Aromaterapi</h4>
                <Badge variant="ringan">Pereda Stres & Penstabil Tensi</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tarik napas melalui hidung dalam 4 hitungan, tahan 2 hitungan, dan hembuskan perlahan selama 6 hitungan untuk menstabilkan aliran vaskular.
              </p>
              <Link href="/kamus" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:underline pt-1">
                <span>Buka Kamus Terapi Lengkap</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </BundaSehatLayout>
  );
}
