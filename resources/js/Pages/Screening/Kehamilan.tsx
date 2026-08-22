import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { NumberStepper } from "@/Components/ui/number-stepper";
import { Checkbox } from "@/Components/ui/checkbox";
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

  const TOTAL_STEPS = 3;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [rightPanelView, setRightPanelView] = useState<"summary" | "detail">("summary");

  // State Form Poedji Rochjati
  const [formData, setFormData] = useState<ScreeningInput>({
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
    // Field Poedji Rochjati
    kehamilan_ke: 1,
    lama_menikah: undefined,
    jarak_kehamilan: undefined,
    jumlah_anak_hidup: 0,
    tinggi_badan: undefined,
    riwayat_keguguran: false,
    riwayat_persalinan_bermasalah: [],
    riwayat_sc_kehamilan: false,
    penyakit_saat_ini: [],
    bengkak_darah_tinggi: false,
    hamil_kembar: false,
    hydramnion: false,
    riwayat_bayi_mati: false,
    serotinus: false,
    letak_sungsang: false,
    letak_lintang: false,
    pendarahan_kehamilan: false,
    preeklampsia_berat: false,
  });

  const [gestationalInfo, setGestationalInfo] = useState<{ weeks: number; days: number; dueDate?: string; formattedAge: string }>({ weeks: 0, days: 0, formattedAge: "" });

  const isHamilPertama = (formData.kehamilan_ke ?? 1) === 1;

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

  const toggleCheckbox = (field: keyof ScreeningInput, value: string) => {
    const current = (formData[field] as string[]) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) errs.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 12 || formData.umur > 60) errs.umur = "Isi umur dengan benar (12-60 tahun)";
    if (!formData.hpht) errs.hpht = "Tanggal HPHT wajib dipilih";
    if ((formData.kehamilan_ke ?? 1) < 1) errs.kehamilan_ke = "Kehamilan ke- minimal 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    setErrors({});
    return true;
  };

  const validateStep3 = (): boolean => {
    setErrors({});
    return true;
  };

  const handleNextStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handlePrevStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) {
      handleNextStep(e);
      return;
    }
    if (!validateStep1() || !validateStep3()) return;

    setIsLoading(true);

    const payload = {
      ...formData,
      gravida: formData.kehamilan_ke ?? 1,
      jenis_persalinan: formData.riwayat_sc_kehamilan ? "Sectio Sesarea" : "Persalinan Pervaginam",
      keluhan_spesifik: [],
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
            <div className="lg:col-span-6 lg:h-[calc(100vh-65px)] h-auto overflow-y-auto overflow-x-hidden">
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

                    {/* Section 2: Informasi Umum Pasien & Rincian Poin */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Informasi umum</h4>
                      
                      <div className="space-y-2">
                        {screeningResult.detail_skor && screeningResult.detail_skor.length > 0 ? (
                          screeningResult.detail_skor.map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-medium text-slate-700">{item.deskripsi}</span>
                              <span className="font-bold text-rose-600">+{item.skor} Poin</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Skor Awal Ibu Hamil (KSPR)</span>
                            <span className="font-bold text-rose-600">+2 Poin</span>
                          </div>
                        )}

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-slate-700">Taksiran HPL</span>
                          <span className="font-bold text-slate-900">
                            {screeningResult.taksiran_hpl || gestationalInfo.dueDate || "Sesuai HPHT"}
                          </span>
                        </div>
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
                        className="flex-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5"
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
                        {(gestationalInfo.weeks > 0 || gestationalInfo.days > 0) && ` · Usia Hamil: ${gestationalInfo.formattedAge}`}
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
                        {screeningResult.detail_skor && screeningResult.detail_skor.length > 0 ? (
                          screeningResult.detail_skor.map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-medium text-slate-700">{item.deskripsi}</span>
                              <span className="font-bold text-rose-600">+{item.skor} Poin</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700">Skor Awal Ibu Hamil (KSPR)</span>
                            <span className="font-bold text-rose-600">+2 Poin</span>
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
                        1. Identitas &amp; Riwayat
                      </span>
                      <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                        2. Kondisi Saat Ini
                      </span>
                      <span className={currentStep >= 3 ? "text-emerald-700 font-bold" : ""}>
                        3. Kondisi Gawat
                      </span>
                    </div>
                    <Progress value={(currentStep / TOTAL_STEPS) * 100} variant="default" className="h-2" />
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
                    
                    {/* LANGKAH 1 - Kelompok I (APGO): Identitas & Riwayat */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-700" />
                            <span>Langkah 1: Identitas &amp; Riwayat Kehamilan</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok I — Ada Potensi Gawat Obstetrik (APGO)</p>
                        </div>
                        <div className="space-y-3.5">
                          <div>
                            <Label htmlFor="nama_pasien">Nama Lengkap Bunda <span className="text-rose-600">*</span></Label>
                            <Input id="nama_pasien" placeholder="Masukkan nama lengkap Bunda..." value={formData.nama_pasien} onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })} error={errors.nama_pasien} className="mt-1" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="kehamilan_ke">Ini Kehamilan ke- <span className="text-rose-600">*</span></Label>
                              <NumberStepper
                                id="kehamilan_ke"
                                min={1}
                                max={20}
                                value={formData.kehamilan_ke ?? 1}
                                onChange={(val) => setFormData({ ...formData, kehamilan_ke: val })}
                                error={errors.kehamilan_ke}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="umur">Usia Bunda (Tahun) <span className="text-rose-600">*</span></Label>
                              <NumberStepper
                                id="umur"
                                min={12}
                                max={60}
                                value={formData.umur || ""}
                                onChange={(val) => setFormData({ ...formData, umur: val })}
                                error={errors.umur}
                                suffix="thn"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT) <span className="text-rose-600">*</span></Label>
                            <DatePicker id="hpht" value={formData.hpht} onChange={(val) => setFormData({ ...formData, hpht: val })} placeholder="Pilih Tanggal HPHT Bunda" className="mt-1" />
                            {(gestationalInfo.weeks > 0 || gestationalInfo.days > 0) && (
                              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Estimasi Usia Kandungan: {gestationalInfo.formattedAge}{gestationalInfo.dueDate ? ` · HPL: ${gestationalInfo.dueDate}` : ""}</span>
                              </p>
                            )}
                          </div>
                          {isHamilPertama && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                              <Label className="text-xs font-bold text-slate-800 block">Sudah berapa lama Bunda menikah sebelum hamil ini?</Label>
                              <RadioGroup value={formData.lama_menikah ?? ""} onValueChange={(val) => setFormData({ ...formData, lama_menikah: val as '<4' | '>=4' })} className="flex gap-5 pt-1">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="<4" id="menikah-cepat" /><Label htmlFor="menikah-cepat" className="text-xs cursor-pointer">Kurang dari 4 tahun</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value=">=4" id="menikah-lama" /><Label htmlFor="menikah-lama" className="text-xs cursor-pointer">4 tahun atau lebih</Label></div>
                              </RadioGroup>
                            </div>
                          )}
                          {!isHamilPertama && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                              <Label className="text-xs font-bold text-slate-800 block">Jarak kehamilan ini dengan kehamilan sebelumnya?</Label>
                              <RadioGroup value={formData.jarak_kehamilan ?? ""} onValueChange={(val) => setFormData({ ...formData, jarak_kehamilan: val as '<2' | '2-10' | '>10' })} className="flex flex-col gap-1.5 pt-1">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="<2" id="jarak-cepat" /><Label htmlFor="jarak-cepat" className="text-xs cursor-pointer">Kurang dari 2 tahun</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="2-10" id="jarak-normal" /><Label htmlFor="jarak-normal" className="text-xs cursor-pointer">2 sampai 10 tahun (Normal)</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value=">10" id="jarak-lama" /><Label htmlFor="jarak-lama" className="text-xs cursor-pointer">Lebih dari 10 tahun</Label></div>
                              </RadioGroup>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="jumlah_anak_hidup">Jumlah Anak Hidup Saat Ini</Label>
                              <NumberStepper
                                id="jumlah_anak_hidup"
                                min={0}
                                max={20}
                                value={formData.jumlah_anak_hidup ?? 0}
                                onChange={(val) => setFormData({ ...formData, jumlah_anak_hidup: val })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="tinggi_badan">Tinggi Badan (cm)</Label>
                              <NumberStepper
                                id="tinggi_badan"
                                min={100}
                                max={220}
                                placeholder="155"
                                value={formData.tinggi_badan || 155}
                                onChange={(val) => setFormData({ ...formData, tinggi_badan: val })}
                                suffix="cm"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">Apakah Bunda pernah mengalami keguguran sebelumnya?</Label>
                            <RadioGroup value={formData.riwayat_keguguran ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, riwayat_keguguran: val === "true" })} className="flex gap-5 pt-1">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="keguguran-no" /><Label htmlFor="keguguran-no" className="text-xs cursor-pointer">Tidak pernah</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="keguguran-yes" /><Label htmlFor="keguguran-yes" className="text-xs cursor-pointer">Pernah keguguran</Label></div>
                            </RadioGroup>
                          </div>
                          {!isHamilPertama && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                              <Label className="text-xs font-bold text-slate-800 block">Pada persalinan sebelumnya, adakah kejadian berikut? (boleh pilih lebih dari satu)</Label>
                              <div className="space-y-2 pt-1">
                                {[
                                  { value: "tang_vakum", label: "Bayi dilahirkan dengan ditarik tang / vakum" },
                                  { value: "plasenta_manual", label: "Ari-ari / plasenta harus dikeluarkan manual (dirogoh)" },
                                  { value: "infus_transfusi", label: "Diberi infus / transfusi darah karena pendarahan" },
                                ].map(({ value, label }) => (
                                  <Checkbox
                                    key={value}
                                    id={`bermasalah-${value}`}
                                    checked={(formData.riwayat_persalinan_bermasalah ?? []).includes(value)}
                                    onCheckedChange={() => toggleCheckbox("riwayat_persalinan_bermasalah", value)}
                                    label={label}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">Apakah Bunda pernah melahirkan melalui Operasi Sesar (SC) sebelumnya?</Label>
                            <RadioGroup value={formData.riwayat_sc_kehamilan ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, riwayat_sc_kehamilan: val === "true" })} className="flex gap-5 pt-1">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="sc-no" /><Label htmlFor="sc-no" className="text-xs cursor-pointer">Tidak / Belum pernah</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="sc-yes" /><Label htmlFor="sc-yes" className="text-xs cursor-pointer">Pernah operasi SC</Label></div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LANGKAH 2 - Kelompok II (AGO): Kondisi Saat Ini */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Baby className="h-4 w-4 text-rose-600" />
                            <span>Langkah 2: Kondisi Kehamilan Saat Ini</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok II — Ada Gawat Obstetrik (AGO)</p>
                        </div>
                        <div className="space-y-3.5">
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">Apakah Bunda saat ini menderita salah satu penyakit berikut? (boleh pilih lebih dari satu)</Label>
                            <p className="text-[11px] text-slate-500">Pilih semua yang berlaku. Jika tidak ada, lewati bagian ini.</p>
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {[
                                { value: "anemia", label: "Kurang darah / Anemia (sering lemas, pucat, pusing)" },
                                { value: "malaria", label: "Malaria" },
                                { value: "tbc", label: "TBC Paru (batuk lama, keringat malam)" },
                                { value: "jantung", label: "Payah jantung (sesak napas, berdebar)" },
                                { value: "diabetes", label: "Kencing manis / Diabetes" },
                                { value: "pms", label: "Penyakit menular seksual (misal: sifilis, gonore)" },
                              ].map(({ value, label }) => (
                                <Checkbox
                                  key={value}
                                  id={`penyakit-${value}`}
                                  checked={(formData.penyakit_saat_ini ?? []).includes(value)}
                                  onCheckedChange={() => toggleCheckbox("penyakit_saat_ini", value)}
                                  label={label}
                                />
                              ))}
                            </div>
                          </div>
                          {([
                            { field: "bengkak_darah_tinggi", label: "Apakah Bunda mengalami bengkak pada wajah atau tungkai disertai tekanan darah tinggi?" },
                            { field: "hamil_kembar", label: "Apakah Bunda sedang hamil kembar (lebih dari 1 bayi)?" },
                            { field: "hydramnion", label: "Apakah dokter / bidan menyebutkan cairan ketuban Bunda terlalu banyak (Hydramnion)?" },
                            { field: "riwayat_bayi_mati", label: "Apakah pada kehamilan sebelumnya ada bayi yang meninggal dalam kandungan?" },
                            { field: "serotinus", label: "Apakah usia kehamilan Bunda sudah lebih dari 42 minggu (lewat bulan / serotinus)?" },
                          ] as { field: keyof ScreeningInput; label: string }[]).map(({ field, label }) => (
                            <div key={String(field)} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                              <Label className="text-xs font-bold text-slate-800 block">{label}</Label>
                              <RadioGroup value={formData[field] ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, [field]: val === "true" })} className="flex gap-5 pt-1">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="false" id={`${String(field)}-no`} /><Label htmlFor={`${String(field)}-no`} className="text-xs cursor-pointer">Tidak</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="true" id={`${String(field)}-yes`} /><Label htmlFor={`${String(field)}-yes`} className="text-xs cursor-pointer">Ya</Label></div>
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LANGKAH 3 - Kelompok III (GDOB): Kondisi Gawat Darurat */}
                    {currentStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Info className="h-4 w-4 text-amber-600" />
                            <span>Langkah 3: Kondisi Gawat / Darurat</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 ml-6">Kelompok III — Gawat Darurat Obstetrik (GDOB)</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-2.5 text-xs text-amber-800">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">Kondisi berikut membutuhkan penanganan segera. Jawab sejujurnya agar hasil screening akurat.</p>
                        </div>
                        <div className="space-y-3.5">
                          {([
                            { field: "letak_sungsang", label: "Apakah bidan / dokter menyebutkan posisi bayi sungsang (kepala di atas, pantat di bawah)?" },
                            { field: "letak_lintang", label: "Apakah posisi bayi melintang (tidak kepala di bawah, tidak sungsang)?" },
                            { field: "pendarahan_kehamilan", label: "Apakah Bunda mengalami pendarahan dari jalan lahir selama kehamilan ini?" },
                            { field: "preeklampsia_berat", label: "Apakah Bunda pernah didiagnosis preeklampsia berat atau mengalami kejang-kejang (eklampsia) saat hamil?" },
                          ] as { field: keyof ScreeningInput; label: string }[]).map(({ field, label }) => (
                            <div key={String(field)} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                              <Label className="text-xs font-bold text-slate-800 block">{label}</Label>
                              <RadioGroup value={formData[field] ? "true" : "false"} onValueChange={(val) => setFormData({ ...formData, [field]: val === "true" })} className="flex gap-5 pt-1">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="false" id={`${String(field)}-no`} /><Label htmlFor={`${String(field)}-no`} className="text-xs cursor-pointer">Tidak</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="true" id={`${String(field)}-yes`} /><Label htmlFor={`${String(field)}-yes`} className="text-xs cursor-pointer">Ya</Label></div>
                              </RadioGroup>
                            </div>
                          ))}
                          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
                            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">Pemeriksaan tensi darah, detak jantung janin, dan tes laboratorium lengkap akan diverifikasi oleh Bidan saat Bunda berkunjung ke klinik / Puskesmas.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step Navigation */}
                    <div className="pt-4 flex items-center justify-between gap-3">
                      {currentStep > 1 ? (
                        <Button type="button" variant="outline" onClick={handlePrevStep} className="rounded-full text-xs font-bold px-5">
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span>Sebelumnya</span>
                        </Button>
                      ) : <div />}
                      {currentStep < TOTAL_STEPS ? (
                        <Button type="button" onClick={handleNextStep} className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 ml-auto">
                          <span>Lanjut</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={isLoading} className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-8 ml-auto shadow-soft-sm">
                          {isLoading ? "Menghitung Risiko..." : "Lihat Hasil Analisis"}
                        </Button>
                      )}
                    </div>

                  </form>
                </div>
              )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </BundaSehatLayout>
  );
}
