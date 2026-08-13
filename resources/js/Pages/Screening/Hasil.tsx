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
} from "lucide-react";

interface HasilPageProps {
  screening: ScreeningResult;
}

export default function HasilScreening() {
  const { screening: result } = usePage<HasilPageProps & { auth: { user: { id: number; name: string; email: string } } }>().props;

  const handlePrint = () => {
    window.print();
  };

  if (!result) return null;

  const isBerat = result.tingkat_risiko === "Berat";
  const isSedang = result.tingkat_risiko === "Sedang";

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
            <p className="text-xs text-slate-500">Pasien: <strong className="text-slate-800">{result.input_summary.nama_pasien}</strong> ({result.input_summary.umur} Tahun)</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-semibold">
              <Printer className="h-4 w-4" />
              <span>Cetak Hasil</span>
            </Button>
            <Link href="/screening/kehamilan">
              <Button variant="default" size="sm" className="gap-1.5 text-xs font-semibold">
                <Activity className="h-4 w-4" />
                <span>Screening Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* RISK STATUS HERO CARD (Halodoc Risk Gauge Style) */}
        <Card className={`border-2 overflow-hidden shadow-soft-lg ${
          isBerat
            ? "border-coral-300 bg-gradient-to-b from-coral-50/80 to-white"
            : isSedang
            ? "border-amber-300 bg-gradient-to-b from-amber-50/80 to-white"
            : "border-emerald-300 bg-gradient-to-b from-emerald-50/80 to-white"
        }`}>
          <CardContent className="p-6 text-center space-y-4">
            
            <div className="flex justify-center">
              {isBerat ? (
                <div className="p-3 bg-coral-500 text-white rounded-full animate-bounce shadow-soft-md">
                  <ShieldAlert className="h-10 w-10" />
                </div>
              ) : isSedang ? (
                <div className="p-3 bg-amber-500 text-white rounded-full shadow-soft-md">
                  <AlertTriangle className="h-10 w-10" />
                </div>
              ) : (
                <div className="p-3 bg-emerald-700 text-white rounded-full shadow-soft-md">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                TINGKAT RISIKO KOMPLIKASI
              </p>
              <h2 className={`text-3xl sm:text-4xl font-bold mt-1 ${
                isBerat ? "text-coral-600" : isSedang ? "text-amber-600" : "text-emerald-700"
              }`}>
                RISIKO {result.tingkat_risiko.toUpperCase()}
              </h2>
            </div>

            {/* Visual Risk Gauge Meter */}
            <div className="max-w-md mx-auto space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span className="text-emerald-700">Ringan (&le;5)</span>
                <span className="text-amber-700">Sedang (6-11)</span>
                <span className="text-coral-600">Tinggi (&ge;12)</span>
              </div>
              <Progress
                value={(result.skor_poedji_rochjati / 20) * 100}
                variant="riskGauge"
                className="h-3.5"
              />
              <p className="text-xs font-semibold text-slate-700 pt-1">
                Total Skor: <strong className="text-slate-900 font-bold">{result.skor_poedji_rochjati}</strong> | MAP: <strong className="text-slate-900 font-bold">{result.map_value} mmHg</strong>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* GRID RESULTS & RECOMMENDATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Diagnosa Potensi Komplikasi */}
          <Card className="border-slate-200/80 shadow-soft-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-600" />
                <span>Potensi Komplikasi Terdeteksi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3 space-y-2">
              {result.potensi_komplikasi.length > 0 ? (
                result.potensi_komplikasi.map((komplikasi, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{komplikasi}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 bg-emerald-50/50 rounded-xl">
                  Tidak terdeteksi gejala komplikasi berat.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Rekomendasi Faskes & Penolong */}
          <Card className="border-slate-200/80 shadow-soft-sm">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Hospital className="h-5 w-5 text-emerald-600" />
                <span>Rekomendasi Tempat Persalinan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3 space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-medium leading-relaxed">
                {result.rekomendasi_faskes}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Ringkasan Data Fisik Pasien:</p>
                <p>&bull; Tensi: <strong>{result.input_summary.sistolik}/{result.input_summary.diastolik} mmHg</strong></p>
                <p>&bull; Edema: <strong>{result.input_summary.edema_level}</strong></p>
                <p>&bull; Bias Treatment: <strong>{result.input_summary.sudah_dapat_treatment ? "Sudah Menerima Terapi Awal" : "Belum Ada Terapi Awal"}</strong></p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* COMPLEMENTARY THERAPY SUGGESTIONS SECTION */}
        <Card className="border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 to-slate-50 shadow-soft-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Saran Terapi Komplementer (Non-Obat)</CardTitle>
                <CardDescription className="text-xs">Terapi pereda gejala non-farmakologi yang disesuaikan dengan hasil skoring pasien</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2 space-y-4">
            
            {/* Therapy item 1 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-soft-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">1. Terapi Perendaman Kaki Air Hangat & Garam Epsom</h4>
                <Badge variant="ringan">Cocok Pereda Edema</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rendam kedua kaki hingga pergelangan kaki dalam air hangat (37-40&deg;C) yang dicampur 2 sendok makan garam epsom selama 15-20 menit untuk mengurangi retensi cairan ekstremitas.
              </p>
              <Link href="/kamus" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:underline pt-1">
                <span>Lihat Panduan Langkah Lengkap</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Therapy item 2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-soft-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">2. Relaksasi Napas Dalam & Aromaterapi Lavender</h4>
                <Badge variant="outline">Penstabil Tensi & Kecemasan</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lakukan teknik napas dalam (tarik napas 4 hitungan, tahan 2, hembuskan 6 hitungan) dengan inhalasi aromaterapi lavender selama 10-15 menit untuk menenangkan vaskular.
              </p>
              <Link href="/kamus" className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:underline pt-1">
                <span>Lihat Panduan Langkah Lengkap</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </BundaSehatLayout>
  );
}
