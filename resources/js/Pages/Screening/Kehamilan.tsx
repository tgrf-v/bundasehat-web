import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DatePicker } from "@/Components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { ScreeningInput, ScreeningResult } from "@/types/screening";
import { calculateGestationalAge, evaluateScreening } from "@/lib/scoringEngine";
import {
  Activity,
  User,
  Calendar,
  Heart,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
  Baby,
} from "lucide-react";

import { PageProps } from "@/types";

export default function KehamilanScreening() {
  const { auth, flash, screeningResult: propResult } = usePage<PageProps<{
    screeningResult?: ScreeningResult;
  }>>().props;

  const serverResult = flash?.screeningResult || propResult;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  // 6 Input Mandiri Ibu Hamil
  const [formData, setFormData] = useState<ScreeningInput & {
    ada_riwayat_sc?: boolean;
  }>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    umur: 27,
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    gravida: 1,
    paritas: 0,
    abortus: 0,
    hpht: auth?.user?.hpht || "",
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "kehamilan",
    wilayah_puskesmas: auth?.user?.puskesmas || "",
    ada_riwayat_sc: false,
  });

  const [gestationalInfo, setGestationalInfo] = useState<{ weeks: number; dueDate?: string }>({ weeks: 0 });

  useEffect(() => {
    if (serverResult) {
      setScreeningResult(serverResult);
      setHasScreened(true);
      setRightPanelView("summary");
    }
  }, [serverResult]);

  useEffect(() => {
    if (formData.hpht) {
      setGestationalInfo(calculateGestationalAge(formData.hpht));
    }
  }, [formData.hpht]);

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) errs.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) errs.umur = "Isi umur dengan benar (12-60 tahun)";
    if ((formData.gravida ?? 1) < 1) errs.gravida = "Jumlah kehamilan (Gravida) minimal 1";
    if (formData.paritas < 0) errs.paritas = "Paritas tidak boleh negatif";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.hpht) errs.hpht = "Tanggal HPHT wajib dipilih untuk menghitung usia kandungan & HPL";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      handleNextStep(e);
      return;
    }
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      jenis_persalinan: formData.ada_riwayat_sc ? "Sectio Sesarea" : "Persalinan Pervaginam",
      keluhan_spesifik: formData.ada_riwayat_sc ? ["riwayat_sc"] : [],
    };

    router.post(route("screening.store"), payload as any, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
        setErrors({});
      },
      onError: (serverErrors) => {
        setIsLoading(false);
        setErrors(serverErrors as Record<string, string>);
      },
    });
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
    setRightPanelView("summary");
  };

  return (
    <BundaSehatLayout activeNav="kehamilan">
      <div className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-0 min-h-[calc(100vh-144px)] lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        
        {/* Modern Split Card with Image Fade Overlay (2 Kolom) */}
        <div className="w-full mx-auto bg-white rounded-none border-0 sm:border border-slate-200 overflow-hidden h-full lg:h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            {/* Kolom Kiri (Gambar Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/pregnancy-screening.jpg?v=2"
                alt="Screening Kehamilan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Form Screening - 50% - Scrollable) */}
            <ScrollArea className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10">

              
              {/* Header Kolom Kanan */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Screening Kehamilan
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {hasScreened
                    ? "Hasil analisis risiko kehamilan & panduan terapi Bunda."
                    : "Skrining awal mandiri Ibu Hamil untuk mendeteksi risiko komplikasi."}
                </p>
              </div>

              {/* Dynamic Area: Gambar 3 (Summary), Gambar 4 (Detail), atau Form Input */}
              {hasScreened && screeningResult ? (
                rightPanelView === "detail" ? (
                  /* ============================================================ */
                  /* GAMBAR 4: VIEW DETAIL PERHITUNGAN SKOR RISIKO & INFORMASI UMUM */
                  /* ============================================================ */
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
                          Level risiko Ibu Hamil, <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
                        </p>
                        <h2 className={`text-2xl font-bold tracking-tight mt-1 ${
                          screeningResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : screeningResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {screeningResult.kategori_risiko === "KRR"
                            ? "Risiko Rendah / Ringan"
                            : screeningResult.kategori_risiko === "KRT"
                            ? "Risiko Tinggi / Sedang"
                            : "Risiko Sangat Tinggi / Berat"}
                        </h2>
                      </div>

                      {/* Tri-Color Segmented Gauge Bar dengan Pointer Lingkaran Hitam di Bawah */}
                      <div className="relative w-full max-w-sm mx-auto pt-2 pb-6">
                        <div className="h-4 w-full rounded-full flex overflow-hidden">
                          <div className="flex-1 bg-[#64B565]" />
                          <div className="flex-1 bg-[#F7D154]" />
                          <div className="flex-1 bg-[#F83838]" />
                        </div>
                        {(() => {
                          const score = screeningResult.total_skor || screeningResult.skor_poedji_rochjati || 2;
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
                    <div className="p-3.5 px-5 rounded-full bg-cyan-50 border border-cyan-100/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-cyan-900">
                        <Info className="h-4 w-4 text-cyan-600 shrink-0" />
                        <span className="text-[11px] sm:text-xs">Gunakan laporan rincian perhitungan ini untuk referensi Anda.</span>
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
                    <div className="space-y-2.5 pt-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Perhitungan skor risiko</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Gunakan perhitungan ini sebagai acuan Anda untuk mengantisipasi risiko komplikasi kehamilan.
                      </p>

                      <div className="space-y-2 pt-1">
                        {/* KRR Item */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#64B565] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 2 - Risiko Rendah (KRR)</p>
                            <p className="text-xs text-slate-500">Kehamilan fisiologis tanpa komplikasi terdeteksi.</p>
                          </div>
                        </div>

                        {/* KRT Item */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#F7D154] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor 6-10 - Risiko Tinggi (KRT)</p>
                            <p className="text-xs text-slate-500">Pengawasan rutin Bidan / Dokter umum Puskesmas.</p>
                          </div>
                        </div>

                        {/* KRST Item */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-start gap-3">
                          <div className="h-4 w-4 rounded bg-[#F83838] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Skor &ge; 12 - Risiko Sangat Tinggi (KRST)</p>
                            <p className="text-xs text-slate-500">Rujukan ke Rumah Sakit & Dokter Spesialis Kebidanan (SpOG).</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Informasi Umum Pasien */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi umum</h4>
                      
                      <div className="space-y-2">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Umur</span>
                          <span className="font-bold text-rose-600">
                            {formData.umur} thn : {formData.umur < 20 || formData.umur >= 35 ? "4 poin" : "2 poin"}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Jumlah Hamil / Melahirkan (Paritas)</span>
                          <span className="font-bold text-rose-600">
                            Hamil ke-{formData.gravida || 1} : {formData.paritas >= 4 ? "4 poin" : "0 poin"}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Taksiran HPL</span>
                          <span className="font-bold text-slate-900">
                            {screeningResult.taksiran_hpl || gestationalInfo.dueDate || "Sesuai HPHT"}
                          </span>
                        </div>

                        {formData.ada_riwayat_sc && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Riwayat Persalinan Lalu</span>
                            <span className="font-bold text-rose-600">Bekas Operasi Caesar : 8 poin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tombol Kembali / Rescreen */}
                    <div className="pt-3 flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRescreen}
                        className="flex-1 rounded-full text-xs font-bold py-2.5"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        <span>Screening Ulang</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => router.visit("/kamus")}
                        className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5"
                      >
                        <span>Buka Kamus Terapi</span>
                      </Button>
                    </div>

                  </div>
                ) : (
                  /* ============================================================ */
                  /* GAMBAR 3: VIEW HASIL RINGKAS SKOR KSPR, REKOMENDASI, & TERAPI */
                  /* ============================================================ */
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Top Level Risiko Card (Sesuai Gambar 3) */}
                    <Card className="border border-slate-200/80 shadow-soft-sm bg-white rounded-3xl p-5 sm:p-6 space-y-3.5 text-center">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Level risiko Ibu Hamil, <span className="font-semibold text-slate-700">{formData.umur || 27} thn</span>
                        </p>
                        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
                          screeningResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : screeningResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {screeningResult.kategori_risiko === "KRR"
                            ? "Risiko Rendah / Ringan"
                            : screeningResult.kategori_risiko === "KRT"
                            ? "Risiko Tinggi / Sedang"
                            : "Risiko Sangat Tinggi / Berat"}
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
                          const score = screeningResult.total_skor || screeningResult.skor_poedji_rochjati || 2;
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

                      <p className="text-xs font-semibold text-slate-600">
                        Skor KSPR: <strong className="text-slate-900 font-bold">{screeningResult.total_skor || screeningResult.skor_poedji_rochjati || 2} Poin</strong>
                        {gestationalInfo.weeks > 0 && ` · Usia Hamil: ${gestationalInfo.weeks} Minggu`}
                      </p>

                      {/* Action links in card footer (Lihat Perhitungan & Cek Ulang) */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => setRightPanelView("detail")}
                          className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          Lihat Perhitungan &rarr;
                        </button>
                        <button
                          type="button"
                          onClick={handleRescreen}
                          className="font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Cek Ulang</span>
                        </button>
                      </div>
                    </Card>

                    {/* Card 1: Rekomendasi Tempat & Penolong Persalinan (Soft Pink Card) */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-rose-50/60 border border-rose-100/90 space-y-1">
                      <h4 className="font-bold text-rose-700 text-xs sm:text-sm">
                        Rekomendasi Tempat & Penolong Persalinan
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                        {screeningResult.rekomendasi_faskes || "Puskesmas Rawat Inap / PONED (Bidan & Dokter Umum)"}
                      </p>
                    </div>

                    {/* Card 2: Rincian Faktor Risiko Terdeteksi */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Rincian Faktor Risiko Terdeteksi:
                      </h4>

                      <div className="space-y-2">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Skor Awal Ibu Hamil (KSPR)</span>
                          <span className="font-bold text-rose-600">+ 2 Poin</span>
                        </div>

                        {formData.umur < 20 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Usia Terlalu Muda (&lt;20 Tahun)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.umur >= 35 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Usia Terlalu Tua (&ge;35 Tahun)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.paritas >= 4 && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Grande Multipara (Pernah Melahirkan &ge;4 Kali)</span>
                            <span className="font-bold text-rose-600">+ 4 Poin</span>
                          </div>
                        )}

                        {formData.ada_riwayat_sc && (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Pernah Operasi Caesar (Seksio Sesarea)</span>
                            <span className="font-bold text-rose-600">+ 8 Poin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 3: Saran Terapi Komplementer (Accordion) */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs sm:text-sm">
                        <Heart className="h-4 w-4" />
                        <span>Saran Terapi Komplementer</span>
                      </div>

                      <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="oxytocin" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
                          <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                            Pijat Oxytocin Tulang Belakang (Bantuan Suami)
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                            Metode aman non-farmakologi untuk meredakan ketegangan dan mengoptimalkan kondisi fisik serta relaksasi ibu hamil.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="senam" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
                          <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                            Senam Pelenturan Panggul Trimester 3
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                            Gerakan peregangan sendi panggul ringan untuk mempersiapkan jalan lahir dan kenyamanan posisi tidur Bunda.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="air" className="border border-slate-200/80 rounded-2xl overflow-hidden px-4 bg-white shadow-soft-xs">
                          <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 hover:no-underline py-3">
                            Minum Air Putih Cukup (8-10 Gelas/Hari)
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-slate-600 leading-relaxed pb-3 pt-1">
                            Menjaga sirkulasi cairan tubuh, volume air ketuban optimal, dan mencegah dehidrasi serta kram otot.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                  </div>
                )
              ) : (
                /* ============================================================ */
                /* FORM INPUT IBU HAMIL (6 DATA MANDIRI RAMAH AWAM)             */
                /* ============================================================ */
                <div className="space-y-5">
                  
                  {/* Step Indicator Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
                        1. Data Diri & Riwayat Kehamilan
                      </span>
                      <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                        2. Usia Kandungan & Riwayat Lahir
                      </span>
                    </div>
                    <Progress value={(currentStep / 2) * 100} variant="default" className="h-2" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Error Banner */}
                    {Object.keys(errors).length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium space-y-1 animate-fadeIn">
                        {Object.values(errors).map((err, idx) => (
                          <p key={idx} className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                            <span>{err}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {/* LANGKAH 1: DATA DIRI & RIWAYAT HAMIL */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-700" />
                            <span>Langkah 1: Identitas & Riwayat Hamil (G-P-A)</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="nama_pasien">Nama Lengkap Bunda <span className="text-rose-600">*</span></Label>
                            <Input
                              id="nama_pasien"
                              placeholder="Masukkan nama lengkap Bunda..."
                              value={formData.nama_pasien}
                              onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                              error={errors.nama_pasien}
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="umur">Usia Bunda (Tahun) <span className="text-rose-600">*</span></Label>
                              <Input
                                id="umur"
                                type="number"
                                min={12}
                                max={60}
                                value={formData.umur || ""}
                                onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                                error={errors.umur}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="pekerjaan">Status Pekerjaan</Label>
                              <Select
                                value={formData.pekerjaan || "Ibu Rumah Tangga"}
                                onValueChange={(val) => setFormData({ ...formData, pekerjaan: val })}
                              >
                                <SelectTrigger id="pekerjaan" className="mt-1">
                                  <SelectValue placeholder="Pilih pekerjaan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ibu Rumah Tangga">Ibu Rumah Tangga (IRT)</SelectItem>
                                  <SelectItem value="Karyawan Swasta">Karyawan Swasta</SelectItem>
                                  <SelectItem value="PNS">PNS / ASN</SelectItem>
                                  <SelectItem value="Wiraswasta">Wiraswasta / Usaha</SelectItem>
                                  <SelectItem value="Petani/Buruh">Buruh / Petani</SelectItem>
                                  <SelectItem value="Pelajar/Mahasiswa">Pelajar / Mahasiswa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                            <Select
                              value={formData.pendidikan || "SLTA"}
                              onValueChange={(val) => setFormData({ ...formData, pendidikan: val })}
                            >
                              <SelectTrigger id="pendidikan" className="mt-1">
                                <SelectValue placeholder="Pilih pendidikan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SD">SD / Sederajat</SelectItem>
                                <SelectItem value="SLTP">SLTP / SMP</SelectItem>
                                <SelectItem value="SLTA">SLTA / SMA / SMK</SelectItem>
                                <SelectItem value="DIPLOMA">Diploma (D3 / D4)</SelectItem>
                                <SelectItem value="SARJANA">Sarjana (S1)</SelectItem>
                                <SelectItem value="MAGISTER">Magister (S2 / S3)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Riwayat Kehamilan & Kelahiran (G - P - A) */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">
                              Riwayat Kehamilan (Gravida - Paritas - Abortus)
                            </Label>
                            <div className="grid grid-cols-3 gap-2.5">
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Hamil ke- (G)</span>
                                <Input
                                  type="number"
                                  min={1}
                                  max={20}
                                  value={formData.gravida || 1}
                                  onChange={(e) => setFormData({ ...formData, gravida: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Pernah Lahir (P)</span>
                                <Input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={formData.paritas}
                                  onChange={(e) => setFormData({ ...formData, paritas: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Keguguran (A)</span>
                                <Input
                                  type="number"
                                  min={0}
                                  max={15}
                                  value={formData.abortus || 0}
                                  onChange={(e) => setFormData({ ...formData, abortus: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* LANGKAH 2: USIA KANDUNGAN (HPHT) & PERSALINAN LALU */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Baby className="h-4 w-4 text-rose-600" />
                            <span>Langkah 2: Usia Kandungan (HPHT) & Riwayat Lahir Lalu</span>
                          </h3>
                        </div>

                        <div className="space-y-3.5">
                          {/* HPHT DatePicker */}
                          <div>
                            <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT) <span className="text-rose-600">*</span></Label>
                            <DatePicker
                              id="hpht"
                              value={formData.hpht}
                              onChange={(val) => setFormData({ ...formData, hpht: val })}
                              placeholder="Pilih Tanggal HPHT Bunda"
                              className="mt-1"
                            />
                            {gestationalInfo.weeks > 0 && (
                              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Estimasi Usia Kandungan: {gestationalInfo.weeks} Minggu {gestationalInfo.dueDate ? `· HPL: ${gestationalInfo.dueDate}` : ""}</span>
                              </p>
                            )}
                          </div>

                          {/* Riwayat Persalinan Sebelumnya */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">
                              Apakah Bunda pernah melahirkan melalui Operasi Caesar (SC) sebelumnya?
                            </Label>
                            <RadioGroup
                              value={formData.ada_riwayat_sc ? "true" : "false"}
                              onValueChange={(val) => setFormData({
                                ...formData,
                                ada_riwayat_sc: val === "true",
                              })}
                              className="flex gap-4 pt-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="sc-no" />
                                <Label htmlFor="sc-no" className="text-xs cursor-pointer">Belum Pernah / Persalinan Normal</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="sc-yes" />
                                <Label htmlFor="sc-yes" className="text-xs cursor-pointer">Pernah Operasi Caesar</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Info Banner Bidan */}
                          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              Pemeriksaan tensi darah, detak jantung janin, dan tes laboratorium lengkap akan diverifikasi oleh Bidan saat Bunda berkunjung ke klinik/Puskesmas.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between gap-3">
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="rounded-full text-xs font-bold px-5"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span>Sebelumnya</span>
                        </Button>
                      ) : <div />}

                      {currentStep < 2 ? (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 ml-auto"
                        >
                          <span>Lanjut</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm"
                        >
                          {isLoading ? "Menghitung Risiko..." : "Lihat Hasil Analisis"}
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
