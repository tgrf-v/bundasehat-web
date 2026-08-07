import React, { useState, useEffect } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { ScreeningInput, EdemaLevel, ScreeningResult } from "@/types/screening";
import { calculateMAP, evaluateScreening } from "@/lib/scoringEngine";
import {
  Activity,
  User,
  Heart,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  RefreshCw,
  Info,
} from "lucide-react";

export default function PersalinanScreening() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [persalinanResult, setPersalinanResult] = useState<ScreeningResult | null>(null);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  const [formData, setFormData] = useState<ScreeningInput & {
    posisi_janin: string;
    ada_riwayat_sc: boolean;
    kondisi_ketuban: string;
  }>({
    nama_pasien: "Ibu Rahma Rahayu",
    nik: "3201928301920002",
    umur: 27,
    paritas: 1,
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "persalinan",
    wilayah_puskesmas: "Puskesmas Wilayah 1",
    posisi_janin: "kepala_bawah",
    ada_riwayat_sc: false,
    kondisi_ketuban: "utuh",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("latest_persalinan_result");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPersalinanResult(parsed);
        setHasScreened(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nama_pasien.trim()) newErrors.nama_pasien = "Nama pasien wajib diisi";
      if (!formData.umur || formData.umur < 12 || formData.umur > 60) {
        newErrors.umur = "Umur valid antara 12 - 60 tahun";
      }
      if (formData.paritas < 0 || formData.paritas > 15) {
        newErrors.paritas = "Jumlah paritas tidak valid";
      }
    }

    if (step === 2) {
      if (!formData.sistolik || formData.sistolik < 60 || formData.sistolik > 240) {
        newErrors.sistolik = "Tensi sistolik valid antara 60 - 240 mmHg";
      }
      if (!formData.diastolik || formData.diastolik < 40 || formData.diastolik > 160) {
        newErrors.diastolik = "Tensi diastolik valid antara 40 - 160 mmHg";
      }
      if (formData.sistolik <= formData.diastolik) {
        newErrors.sistolik = "Sistolik harus lebih besar dari Diastolik";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep(1)) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep(2)) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCheckboxChange = (keluhanId: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.keluhan_spesifik;
      if (checked) {
        return { ...prev, keluhan_spesifik: [...current, keluhanId] };
      } else {
        return { ...prev, keluhan_spesifik: current.filter((id) => id !== keluhanId) };
      }
    });
  };

  const handleSubmitScreening = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      handleNextStep(e);
      return;
    }
    if (!validateStep(3)) return;

    setIsLoading(true);

    const keluhanList = [...formData.keluhan_spesifik];
    if (formData.ada_riwayat_sc && !keluhanList.includes("riwayat_sc")) {
      keluhanList.push("riwayat_sc");
    }
    if (formData.posisi_janin !== "kepala_bawah" && !keluhanList.includes("letak_sungsang_lintang")) {
      keluhanList.push("letak_sungsang_lintang");
    }
    if (formData.kondisi_ketuban === "pecah" && !keluhanList.includes("ketuban_pecah_dini")) {
      keluhanList.push("ketuban_pecah_dini");
    }

    try {
      const resultData = evaluateScreening({
        ...formData,
        keluhan_spesifik: keluhanList,
        tipe_screening: "persalinan",
      });
      sessionStorage.setItem("latest_persalinan_result", JSON.stringify(resultData));

      setTimeout(() => {
        setIsLoading(false);
        setPersalinanResult(resultData);
        setHasScreened(true);
        setRightPanelView("summary");
      }, 500);
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: "Terjadi kesalahan saat memproses screening persalinan." });
    }
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    setRightPanelView("summary");
  };

  return (
    <BundaSehatLayout activeNav="persalinan">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-0 lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        
        {/* Modern Split Card with Image Fade Overlay (2 Kolom - 50:50) */}
        <div className="w-full mx-auto bg-white rounded-none border border-slate-200 overflow-hidden lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            {/* Kolom Kiri (Gambar Locked / Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/persalinan-screening.jpg"
                alt="Screening Persalinan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay Gradient Memudar Ke Kanan (Desktop) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              {/* Overlay Gradient Memudar Ke Bawah (Mobile) */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Form Screening Persalinan - 50% - Scrollable Shadcn ScrollArea) */}
            <ScrollArea className="lg:col-span-6 h-full">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10">
              
              {/* Header Kolom Kanan */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Screening Persalinan
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {hasScreened
                    ? "Hasil analisis & rekomendasi tempat persalinan Bunda."
                    : "Cek kesiapan bersalin & rekomendasi Faskes rujukan."}
                </p>
              </div>

              {/* Dynamic Area: Form 3-Step, Result Summary, atau Result Detail */}
              {hasScreened && persalinanResult ? (
                rightPanelView === "detail" ? (
                  /* CONDITION 1B: VIEW DETAIL PERHITUNGAN PERSALINAN (MENGGANTIKAN PANEL KANAN) */
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Header back button */}
                    <button
                      type="button"
                      onClick={() => setRightPanelView("summary")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors mb-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Kembali ke Hasil Ringkas</span>
                    </button>

                    {/* Card Top Level Risiko */}
                    <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-2xl p-5 space-y-4 text-center">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Level risiko Ibu Bersalin, <span className="font-semibold text-slate-700">{formData.umur || 28} thn</span>
                        </p>
                        <h2 className={`text-2xl font-bold tracking-tight mt-1 ${
                          persalinanResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {persalinanResult.status_label}
                        </h2>
                      </div>

                      {/* Tri-Color Segmented Gauge Bar */}
                      <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
                        <div className="h-4 w-full rounded-full flex overflow-hidden">
                          <div className="flex-1 bg-[#64B565]" />
                          <div className="flex-1 bg-[#F7D154]" />
                          <div className="flex-1 bg-[#F83838]" />
                        </div>
                        {(() => {
                          const score = persalinanResult.total_skor || 2;
                          const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                          return (
                            <div
                              className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                              style={{ left: `${percent}%` }}
                            >
                              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                              <div className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                                {score}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </Card>

                    {/* Banner Cyan Informasi & Cetak Laporan */}
                    <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-cyan-900">
                        <Info className="h-4 w-4 text-cyan-600 shrink-0" />
                        <span className="text-[11px] sm:text-xs">Gunakan laporan rincian perhitungan ini untuk referensi tempat persalinan.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="font-bold text-cyan-700 hover:text-cyan-900 hover:underline shrink-0 text-xs"
                      >
                        Cetak
                      </button>
                    </div>

                    {/* Section 1: Perhitungan Skor Risiko */}
                    <div className="space-y-2 pt-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Perhitungan skor risiko persalinan</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Gunakan perhitungan ini sebagai acuan Anda untuk menentukan tempat & penolong persalinan yang aman.
                      </p>

                      <div className="space-y-2 pt-1 text-xs">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="h-4 w-4 rounded bg-[#64B565] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Skor 2 - Risiko Rendah (KRR)</p>
                            <p className="text-[11px] text-slate-500 leading-normal">Persalinan aman dilakukan di Bidan Praktik Mandiri (BPM) / Puskesmas.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="h-4 w-4 rounded bg-[#F7D154] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Skor 6-10 - Risiko Tinggi (KRT)</p>
                            <p className="text-[11px] text-slate-500 leading-normal">Persalinan wajib di Puskesmas PONED (Pengawasan Bidan & Dokter umum).</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                          <div className="h-4 w-4 rounded bg-[#F83838] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-800">Skor &ge; 12 - Risiko Sangat Tinggi (KRST)</p>
                            <p className="text-[11px] text-slate-500 leading-normal">Wajib rujukan persalinan ke Rumah Sakit (RS) fasilitas SC & Spesialis SpOG.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Informasi Umum */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi umum</h4>
                      <div className="space-y-2 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Umur</span>
                          <span className="font-bold text-rose-600">{formData.umur} thn : 2 poin</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Jumlah Hamil / Melahirkan (Paritas)</span>
                          <span className="font-bold text-slate-800">Anak ke-{formData.paritas} : {formData.paritas >= 4 ? "4 poin" : "0 poin"}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Presentasi / Posisi Janin</span>
                          <span className={`font-bold ${formData.posisi_janin !== "kepala_bawah" ? "text-rose-600" : "text-slate-800"}`}>
                            {formData.posisi_janin === "kepala_bawah" ? "Kepala di Bawah (Normal) : 0 poin" : `${formData.posisi_janin} : 8 poin`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Informasi Kesehatan */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi kesehatan</h4>
                      <div className="space-y-2 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Tekanan Darah (Tensi)</span>
                          <span className={`font-bold ${calculateMAP(formData.sistolik, formData.diastolik) >= 90 ? "text-rose-600" : "text-slate-800"}`}>
                            {formData.sistolik}/{formData.diastolik} mmHg (MAP: {calculateMAP(formData.sistolik, formData.diastolik)} mmHg) : {calculateMAP(formData.sistolik, formData.diastolik) >= 90 ? "4 poin" : "0 poin"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Riwayat Operasi SC</span>
                          <span className={`font-bold ${formData.ada_riwayat_sc ? "text-rose-600" : "text-slate-800"}`}>
                            {formData.ada_riwayat_sc ? "Ada Riwayat SC : 8 poin" : "Tidak Ada : 0 poin"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                          <span className="font-medium text-slate-700">Kondisi Ketuban</span>
                          <span className={`font-bold ${formData.kondisi_ketuban === "pecah" ? "text-rose-600" : "text-slate-800"}`}>
                            {formData.kondisi_ketuban === "utuh" ? "Utuh : 0 poin" : "Ketuban Pecah Dini : 4 poin"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Faktor Risiko & Keluhan Terdeteksi */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Faktor risiko & keluhan terdeteksi</h4>
                      <div className="space-y-2 text-xs">
                        {persalinanResult.detail_skor.length === 0 ? (
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-500 text-center font-medium">
                            Tidak ada faktor risiko komplikasi persalinan terdeteksi
                          </div>
                        ) : (
                          persalinanResult.detail_skor.map((factor, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                              <span className="font-medium text-slate-700">{factor.deskripsi}</span>
                              <span className="font-bold text-rose-600">+ {factor.skor} poin</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  /* CONDITION 1A: VIEW RINGKASAN HASIL PERSALINAN */
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Card 1: Level Risiko & Tri-Color Risk Gauge Meter */}
                    <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-2xl p-6 sm:p-7 space-y-5 text-center">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500">
                          Level risiko Ibu Bersalin, <span className="font-semibold text-slate-700">{formData.umur || 28} thn</span>
                        </p>
                        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
                          persalinanResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : persalinanResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {persalinanResult.status_label}
                        </h2>
                      </div>

                      {/* Tri-Color Segmented Gauge Bar */}
                      <div className="relative w-full max-w-md mx-auto pt-2 pb-7">
                        <div className="h-4.5 sm:h-5 w-full rounded-full flex overflow-hidden">
                          <div className="flex-1 bg-[#64B565]" />
                          <div className="flex-1 bg-[#F7D154]" />
                          <div className="flex-1 bg-[#F83838]" />
                        </div>

                        {/* Floating Black Score Pin Pointer */}
                        {(() => {
                          const score = persalinanResult.total_skor || 2;
                          const percent = Math.min(Math.max((score / 20) * 100, 8), 92);
                          return (
                            <div
                              className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
                              style={{ left: `${percent}%` }}
                            >
                              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-black -mb-0.5" />
                              <div className="bg-black text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                                {score}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm mx-auto">
                        Skor KSPR: <strong className="text-slate-800 font-bold">{persalinanResult.total_skor} Poin</strong> • Tensi: <strong className="text-slate-800 font-bold">{formData.sistolik}/{formData.diastolik} mmHg</strong> (MAP: {calculateMAP(formData.sistolik, formData.diastolik)} mmHg)
                      </p>

                      {/* Bottom Link Actions */}
                      <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2 text-xs font-bold text-rose-600">
                        <button
                          type="button"
                          onClick={() => setRightPanelView("detail")}
                          className="hover:text-rose-700 transition-colors"
                        >
                          Lihat Perhitungan
                        </button>

                        <button
                          type="button"
                          onClick={handleRescreen}
                          className="hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Cek Ulang</span>
                        </button>
                      </div>
                    </Card>

                    {/* Card 2: Rekomendasi Tempat & Penolong Persalinan */}
                    <Card className="p-4 sm:p-5 rounded-2xl bg-pink-50/60 border border-pink-100/80 space-y-1.5 text-left shadow-soft-xs">
                      <h4 className="font-bold text-rose-900 text-sm sm:text-base">
                        Rekomendasi Tempat & Penolong Persalinan
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {persalinanResult.rekomendasi_tempat} ({persalinanResult.penolong_persalinan})
                      </p>
                    </Card>

                    {/* Card 3: Rincian Faktor Risiko Terdeteksi */}
                    <div id="rincian-faktor" className="space-y-2 pt-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Rincian Faktor Risiko Terdeteksi:</h4>
                      <div className="space-y-1.5">
                        {persalinanResult.detail_skor.length === 0 ? (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 text-center font-medium">
                            Kondisi janin & fisik normal tanpa komplikasi
                          </div>
                        ) : (
                          persalinanResult.detail_skor.map((factor, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800">{factor.deskripsi}</span>
                              <span className="font-bold text-rose-600 text-xs shrink-0">+ {factor.skor} Poin</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Card 4: Saran Terapi Komplementer Non-Obat Khusus Persalinan */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <Heart className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                        <span>Saran Kesiapan & Terapi Persalinan Bunda</span>
                      </h4>

                      <div className="space-y-2 pl-6 sm:pl-6.5">
                        {persalinanResult.saran_terapi.map((terapi, idx) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && <Separator className="my-2 bg-slate-200/70" />}
                            <div className="text-xs py-0.5 space-y-0.5">
                              <p className="font-bold text-slate-900 text-xs">
                                {terapi}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Metode aman persalinan lancar untuk mengoptimalkan posisi janin dan meredakan rasa cemas persalinan.
                              </p>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                  </div>
                )
              ) : (
                /* CONDITION 2: BELUM SCREENED ATAU KLIK SCREENING ULANG -> DISPLAY FORM INPUT PERSALINAN 3-STEP */
                <div className="space-y-5">
                  
                  {/* Step Indicator Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={currentStep >= 1 ? "text-rose-600 font-bold" : ""}>
                        1. Data Diri & Paritas
                      </span>
                      <span className={currentStep >= 2 ? "text-rose-600 font-bold" : ""}>
                        2. Tensi & Posisi Janin
                      </span>
                      <span className={currentStep >= 3 ? "text-rose-600 font-bold" : ""}>
                        3. Riwayat SC & Keluhan
                      </span>
                    </div>
                    <Progress value={(currentStep / 3) * 100} className="h-2" />
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleSubmitScreening} className="space-y-5">
                    
                    {/* STEP 1: DATA DIRI PASIEN */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div>
                          <Label htmlFor="nama_pasien">Nama Lengkap Pasien</Label>
                          <Input
                            id="nama_pasien"
                            placeholder="Masukkan nama lengkap ibu"
                            value={formData.nama_pasien}
                            onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                            className="mt-1"
                          />
                          {errors.nama_pasien && <p className="text-xs text-rose-500 mt-1">{errors.nama_pasien}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="umur">Usia (Tahun)</Label>
                            <Input
                              id="umur"
                              type="number"
                              placeholder="Contoh: 27"
                              value={formData.umur || ""}
                              onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                              className="mt-1"
                            />
                            {errors.umur && <p className="text-xs text-rose-500 mt-1">{errors.umur}</p>}
                          </div>

                          <div>
                            <Label htmlFor="paritas">Jumlah Hamil/Melahirkan (Paritas)</Label>
                            <Input
                              id="paritas"
                              type="number"
                              placeholder="Anak ke-berapa"
                              value={formData.paritas}
                              onChange={(e) => setFormData({ ...formData, paritas: Number(e.target.value) })}
                              className="mt-1"
                            />
                            {errors.paritas && <p className="text-xs text-rose-500 mt-1">{errors.paritas}</p>}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="wilayah_puskesmas">Wilayah Faskes / Puskesmas Domisili</Label>
                          <Select
                            value={formData.wilayah_puskesmas}
                            onValueChange={(value) => setFormData({ ...formData, wilayah_puskesmas: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Pilih wilayah puskesmas..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Puskesmas Wilayah 1">Puskesmas Wilayah 1 (PONED)</SelectItem>
                              <SelectItem value="Puskesmas Wilayah 2">Puskesmas Wilayah 2 (PONED)</SelectItem>
                              <SelectItem value="Puskesmas Wilayah 3">Puskesmas Wilayah 3 (Non-PONED)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: TENSI DARAH & POSISI JANIN */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <Label className="text-xs font-bold text-slate-900">Tekanan Darah (Tensi)</Label>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sistolik" className="text-[11px] text-slate-500">Sistolik (mmHg)</Label>
                              <Input
                                id="sistolik"
                                type="number"
                                placeholder="120"
                                value={formData.sistolik || ""}
                                onChange={(e) => setFormData({ ...formData, sistolik: Number(e.target.value) })}
                                className="mt-1 bg-white"
                              />
                              {errors.sistolik && <p className="text-xs text-rose-500 mt-1">{errors.sistolik}</p>}
                            </div>

                            <div>
                              <Label htmlFor="diastolik" className="text-[11px] text-slate-500">Diastolik (mmHg)</Label>
                              <Input
                                id="diastolik"
                                type="number"
                                placeholder="80"
                                value={formData.diastolik || ""}
                                onChange={(e) => setFormData({ ...formData, diastolik: Number(e.target.value) })}
                                className="mt-1 bg-white"
                              />
                              {errors.diastolik && <p className="text-xs text-rose-500 mt-1">{errors.diastolik}</p>}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="posisi_janin">Presentasi / Posisi Janin</Label>
                          <Select
                            value={formData.posisi_janin}
                            onValueChange={(val) => setFormData({ ...formData, posisi_janin: val })}
                          >
                            <SelectTrigger id="posisi_janin" className="mt-1">
                              <SelectValue placeholder="Pilih posisi janin..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kepala_bawah">Kepala di Bawah (Normal / Preskep)</SelectItem>
                              <SelectItem value="sungsang">Sungsang / Bokong di Bawah (Resti)</SelectItem>
                              <SelectItem value="lintang">Posisi Lintang / Melintang (Wajib SC RS)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="kondisi_ketuban">Kondisi Air Ketuban</Label>
                          <Select
                            value={formData.kondisi_ketuban}
                            onValueChange={(val) => setFormData({ ...formData, kondisi_ketuban: val })}
                          >
                            <SelectTrigger id="kondisi_ketuban" className="mt-1">
                              <SelectValue placeholder="Pilih kondisi ketuban..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utuh">Ketuban Utuh (Normal)</SelectItem>
                              <SelectItem value="pecah">Ketuban Pecah Dini (KPD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: RIWAYAT SC & KELUHAN PERSALINAN */}
                    {currentStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-center justify-between">
                          <div className="text-xs text-rose-900 font-semibold pr-4">
                            <span>Apakah Ada Riwayat Operasi SC (Sectio Caesarea) Sebelumnya?</span>
                          </div>
                          <Checkbox
                            id="riwayat_sc_check"
                            checked={formData.ada_riwayat_sc}
                            onCheckedChange={(checked) => setFormData({ ...formData, ada_riwayat_sc: checked === true })}
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-bold text-slate-900 block mb-2">
                            Pilih Gejala / Keluhan Menjelang Persalinan (Jika Ada):
                          </Label>

                          <div className="space-y-2.5">
                            {[
                              { id: "perdarahan_antepartum", label: "Terjadi Perdarahan Hamil Tua / Jalan Lahir" },
                              { id: "preeklamsia_berat", label: "Pusing Berat / Pandangan Kabur / Kejang" },
                              { id: "bekas_operasisc", label: "Nyeri Hebat Bekas Operasi Caesar (SC)" },
                              { id: "partus_kasep", label: "Mulai Mulas Tapi Persalinan Macet / Lama" },
                              { id: "janin_kembar", label: "Kehamilan Kembar 2 / Lebih" },
                            ].map((keluhan) => (
                              <div key={keluhan.id} className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                <Checkbox
                                  id={keluhan.id}
                                  checked={formData.keluhan_spesifik.includes(keluhan.id)}
                                  onCheckedChange={(checked) => handleCheckboxChange(keluhan.id, checked === true)}
                                />
                                <Label htmlFor={keluhan.id} className="text-xs font-medium text-slate-700 cursor-pointer">
                                  {keluhan.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {errors.general && (
                          <p className="text-xs text-rose-500 font-semibold">{errors.general}</p>
                        )}
                      </div>
                    )}

                    {/* Step Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="gap-1.5 text-xs font-bold"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Kembali</span>
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          variant="rose"
                          onClick={handleNextStep}
                          className="gap-1.5 text-xs font-bold shadow-soft-sm"
                        >
                          <span>Lanjut Langkah {currentStep + 1}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="rose"
                          isLoading={isLoading}
                          className="gap-2 text-xs font-bold shadow-soft-sm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Kalkulasi Rekomendasi Persalinan</span>
                        </Button>
                      )}
                    </div>

                  </form>
                </div>
              )}

              </div>
            </ScrollArea>

          </div>
        </div>

      </div>
    </BundaSehatLayout>
  );
}
