import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DatePicker } from "@/Components/ui/date-picker";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { ScreeningInput, EdemaLevel, ScreeningResult } from "@/types/screening";
import { calculateGestationalAge, calculateMAP, evaluateScreening } from "@/lib/scoringEngine";
import {
  Activity,
  User,
  Calendar,
  Heart,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  RefreshCw,
  Sparkles,
  BookOpen,
  Video,
  Info,
  Layers,
  FlaskConical,
  Scale,
  BrainCircuit,
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

  const [formData, setFormData] = useState<ScreeningInput & {
    tinggi_badan?: number;
    berat_badan?: number;
  }>({
    nama_pasien: auth?.user?.name || "",
    nik: auth?.user?.nik || "",
    pekerjaan: auth?.user?.pekerjaan || "Ibu Rumah Tangga",
    pendidikan: auth?.user?.pendidikan || "SLTA",
    umur: 28,
    gravida: 1,
    paritas: 0,
    abortus: 0,
    tinggi_badan: 158,
    berat_badan: 56,
    imt: 22.4,
    hpht: auth?.user?.hpht || "",
    sistolik: 115,
    diastolik: 75,
    letak_janin: "Memanjang",
    umur_kehamilan: "Aterm",
    jenis_persalinan: "Persalinan Pervaginam",
    hb: 12.0,
    leokosit: 9000,
    trombosit: 250000,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "kehamilan",
    wilayah_puskesmas: auth?.user?.puskesmas || "",
  });

  const [gestationalInfo, setGestationalInfo] = useState<{ weeks: number; dueDate?: string }>({ weeks: 0 });
  const [calculatedMap, setCalculatedMap] = useState<number>(88.33);

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

  useEffect(() => {
    if (formData.sistolik && formData.diastolik) {
      setCalculatedMap(calculateMAP(formData.sistolik, formData.diastolik));
    }
  }, [formData.sistolik, formData.diastolik]);

  const handleTbBbChange = (tbVal?: number, bbVal?: number) => {
    const tb = tbVal !== undefined ? tbVal : (formData.tinggi_badan || 158);
    const bb = bbVal !== undefined ? bbVal : (formData.berat_badan || 56);
    let imtCalc = formData.imt || 22.4;
    if (tb > 0 && bb > 0) {
      imtCalc = parseFloat((bb / Math.pow(tb / 100, 2)).toFixed(1));
    }
    setFormData((prev) => ({
      ...prev,
      tinggi_badan: tb,
      berat_badan: bb,
      imt: imtCalc,
    }));
  };

  const handleCheckboxToggle = (value: string) => {
    setFormData((prev) => {
      const exists = prev.keluhan_spesifik.includes(value);
      return {
        ...prev,
        keluhan_spesifik: exists
          ? prev.keluhan_spesifik.filter((item) => item !== value)
          : [...prev.keluhan_spesifik, value],
      };
    });
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nama_pasien.trim()) errs.nama_pasien = "Nama pasien wajib diisi";
    if (!formData.umur || formData.umur < 10 || formData.umur > 60) errs.umur = "Isi umur dengan benar (10-60 tahun)";
    if ((formData.gravida ?? 1) < 1) errs.gravida = "Jumlah kehamilan (Gravida) minimal 1";
    if (formData.paritas < 0) errs.paritas = "Paritas tidak boleh negatif";
    if ((formData.abortus ?? 0) < 0) errs.abortus = "Jumlah abortus tidak boleh negatif";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.sistolik || formData.sistolik < 60 || formData.sistolik > 260) {
      errs.sistolik = "Tekanan sistolik valid (60-260 mmHg)";
    }
    if (!formData.diastolik || formData.diastolik < 40 || formData.diastolik > 160) {
      errs.diastolik = "Tekanan diastolik valid (40-160 mmHg)";
    }
    if (formData.hb && (formData.hb < 3.0 || formData.hb > 25.0)) {
      errs.hb = "Kadar Hb normal (3.0 - 25.0 g/dL)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      handleNextStep(e);
      return;
    }
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    setIsLoading(true);

    router.post(route("screening.store"), formData as any, {
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
            
            {/* Kolom Kiri (Gambar Locked / Static - 50%) */}
            <div className="relative lg:col-span-6 h-[240px] lg:h-full overflow-hidden">
              <img
                src="/images/pregnancy-screening.jpg"
                alt="Screening Kehamilan"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay Gradient Memudar Ke Kanan (Desktop) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white hidden lg:block" />
              {/* Overlay Gradient Memudar Ke Bawah (Mobile) */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white lg:hidden" />
            </div>

            {/* Kolom Kanan (Konten Utama & Form Screening - 50% - Scrollable Shadcn ScrollArea) */}
            <ScrollArea className="lg:col-span-6 h-full">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-full bg-white relative z-10">
              
              {/* Header Kolom Kanan */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Screening Kehamilan
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {hasScreened
                    ? "Hasil analisis Machine Learning XGBoost & KSPR Bunda."
                    : "Pemeriksaan 15 parameter klinis & estimasi risiko komplikasi kehamilan."}
                </p>
              </div>

              {/* Dynamic Area: Form 3-Step, Result Summary, atau Result Detail */}
              {hasScreened && screeningResult ? (
                rightPanelView === "detail" ? (
                  /* VIEW DETAIL PERHITUNGAN */
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
                          Level risiko Ibu Hamil, <span className="font-semibold text-slate-700">{formData.umur || 28} thn</span>
                        </p>
                        <h2 className={`text-2xl font-bold tracking-tight mt-1 ${
                          screeningResult.kategori_risiko === "KRR"
                            ? "text-emerald-700"
                            : screeningResult.kategori_risiko === "KRT"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}>
                          {screeningResult.status_label}
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
                          const score = screeningResult.total_skor || 2;
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

                    {/* Machine Learning Output Card */}
                    {screeningResult.diagnosa_ml && (
                      <Card className="p-5 rounded-2xl bg-slate-900 text-white border-0 shadow-soft-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                            <BrainCircuit className="h-4 w-4" />
                            <span>Prediksi Model XGBoost ML</span>
                          </div>
                          {screeningResult.skor_risiko_ml && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                              Confidence {Math.round(screeningResult.skor_risiko_ml * 100)}%
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white tracking-wide">
                            {screeningResult.diagnosa_ml}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Klasifikasi berbasis dataset rekam medis maternal (15 variabel klinis).
                          </p>
                        </div>
                        {screeningResult.probabilitas_ml && Object.keys(screeningResult.probabilitas_ml).length > 0 && (
                          <div className="pt-2 border-t border-slate-800 space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                              Distribusi Probabilitas Komplikasi:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(screeningResult.probabilitas_ml).map(([disease, prob]) => (
                                <div key={disease} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex justify-between items-center">
                                  <span className="text-slate-300 truncate pr-1 text-[11px]">{disease}</span>
                                  <span className="font-bold text-rose-400 text-[11px]">{Math.round(prob * 100)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    )}

                    {/* Section 1: Perhitungan Skor Risiko */}
                    <div className="space-y-2 pt-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Perhitungan skor risiko</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Gunakan perhitungan ini sebagai acuan Anda untuk mengantisipasi risiko komplikasi kehamilan.
                      </p>

                      <div className="space-y-2 pt-1">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">Skor Awal Ibu Hamil</span>
                          <span className="font-bold text-slate-900 px-2.5 py-0.5 rounded-full bg-slate-100">+2</span>
                        </div>

                        {screeningResult.detail_skor && screeningResult.detail_skor.length > 0 ? (
                          screeningResult.detail_skor.map((factor, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-700">{factor.deskripsi}</span>
                              <span className="font-bold text-rose-600 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100">
                                +{factor.skor}
                              </span>
                            </div>
                          ))
                        ) : null}
                      </div>
                    </div>

                    {/* Section 2: Indikator Klinis MAP */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Mean Arterial Pressure (MAP)</span>
                        <span className="font-bold text-sm text-slate-900">{screeningResult.map_value} mmHg</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {screeningResult.map_value >= 90
                          ? "Nilai MAP ≥ 90 mmHg mengindikasikan potensi peningkatan tahanan vaskular."
                          : "Nilai MAP normal (< 90 mmHg). Aliran darah plasenta terpantau stabil."}
                      </p>
                    </div>

                    {/* Tombol Aksi Bawah */}
                    <div className="pt-4 flex items-center gap-3">
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
                  /* VIEW RESULT SUMMARY (CARD RINGKASAN) */
                  <div className="space-y-5 animate-fadeIn">
                    
                    {/* Top Level Risiko Badge & Header */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm text-center space-y-3">
                      <p className="text-xs font-medium text-slate-500">
                        Hasil Analisis Pasien: <strong className="text-slate-800">{screeningResult.nama_pasien || formData.nama_pasien}</strong>
                      </p>
                      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                        screeningResult.kategori_risiko === "KRR"
                          ? "text-emerald-700"
                          : screeningResult.kategori_risiko === "KRT"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}>
                        {screeningResult.status_label}
                      </h2>

                      {/* Machine Learning Summary Tag */}
                      {screeningResult.diagnosa_ml && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                          <BrainCircuit className="h-3.5 w-3.5 text-rose-600" />
                          <span>Prediksi ML: {screeningResult.diagnosa_ml}</span>
                          {screeningResult.skor_risiko_ml && (
                            <span className="text-[10px] text-rose-500 font-semibold">
                              ({Math.round(screeningResult.skor_risiko_ml * 100)}%)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Summary Cards: Rekomendasi Faskes & Tempat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <Stethoscope className="h-4 w-4 text-emerald-700" />
                          <span>Rujukan Faskes</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          {screeningResult.rekomendasi_faskes}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                          <Heart className="h-4 w-4 text-rose-600" />
                          <span>Tempat & Penolong</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          {screeningResult.penolong_persalinan}
                        </p>
                      </div>
                    </div>

                    {/* Button Details & Rescreen */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={() => setRightPanelView("detail")}
                        className="w-full sm:flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 shadow-soft-xs"
                      >
                        <span>Lihat Rincian Perhitungan</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRescreen}
                        className="w-full sm:w-auto rounded-full text-xs font-bold py-2.5 px-4"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span>Screening Ulang</span>
                      </Button>
                    </div>

                  </div>
                )
              ) : (
                /* DISPLAY FORM INPUT 3-STEP (15 PARAMETER KLINIS) */
                <div className="space-y-5">
                  
                  {/* Step Indicator Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={currentStep >= 1 ? "text-emerald-700 font-bold" : ""}>
                        1. Identitas & Obstetri
                      </span>
                      <span className={currentStep >= 2 ? "text-emerald-700 font-bold" : ""}>
                        2. Tensi & Lab Darah
                      </span>
                      <span className={currentStep >= 3 ? "text-emerald-700 font-bold" : ""}>
                        3. Tanda Bahaya
                      </span>
                    </div>
                    <Progress value={(currentStep / 3) * 100} variant="default" className="h-2" />
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
                    
                    {/* STEP 1: IDENTITAS & OBSTETRI */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-emerald-700" />
                            <span>Langkah 1: Identitas, Obstetri (G-P-A) & IMT</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="nama_pasien">Nama Lengkap Pasien <span className="text-rose-600">*</span></Label>
                            <Input
                              id="nama_pasien"
                              placeholder="Masukkan nama lengkap pasien..."
                              value={formData.nama_pasien}
                              onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                              error={errors.nama_pasien}
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="umur">Usia (Tahun) <span className="text-rose-600">*</span></Label>
                              <Input
                                id="umur"
                                type="number"
                                min={10}
                                max={60}
                                value={formData.umur || ""}
                                onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                                error={errors.umur}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="pekerjaan">Pekerjaan</Label>
                              <Select
                                value={formData.pekerjaan || "Ibu Rumah Tangga"}
                                onValueChange={(val) => setFormData({ ...formData, pekerjaan: val })}
                              >
                                <SelectTrigger id="pekerjaan" className="mt-1">
                                  <SelectValue placeholder="Pilih pekerjaan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ibu Rumah Tangga">Ibu Rumah Tangga</SelectItem>
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

                          {/* Riwayat Obstetri: G - P - A */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">
                              Riwayat Obstetri Pasien (Gravida - Para - Abortus)
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <span className="text-[11px] text-slate-500 block mb-1">G (Hamil ke-)</span>
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
                                <span className="text-[11px] text-slate-500 block mb-1">P (Kelahiran)</span>
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
                                <span className="text-[11px] text-slate-500 block mb-1">A (Keguguran)</span>
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

                          {/* Antropometri TB & BB -> IMT */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="tb">Tinggi Badan (cm)</Label>
                              <Input
                                id="tb"
                                type="number"
                                min={100}
                                max={250}
                                value={formData.tinggi_badan || 158}
                                onChange={(e) => handleTbBbChange(Number(e.target.value), formData.berat_badan)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bb">Berat Badan (kg)</Label>
                              <Input
                                id="bb"
                                type="number"
                                min={30}
                                max={250}
                                value={formData.berat_badan || 56}
                                onChange={(e) => handleTbBbChange(formData.tinggi_badan, Number(e.target.value))}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {formData.imt && (
                            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                              <span className="font-medium text-emerald-800">Indeks Massa Tubuh (IMT):</span>
                              <span className="font-bold text-emerald-900 px-2 py-0.5 rounded-full bg-white border border-emerald-200">
                                {formData.imt} kg/m² ({formData.imt < 18.5 ? "Underweight" : formData.imt < 25 ? "Normal" : formData.imt < 30 ? "Overweight" : "Obesitas"})
                              </span>
                            </div>
                          )}

                          <div>
                            <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT) <span className="text-rose-600">*</span></Label>
                            <DatePicker
                              id="hpht"
                              value={formData.hpht}
                              onChange={(val) => setFormData({ ...formData, hpht: val })}
                              placeholder="Pilih Tanggal HPHT"
                              className="mt-1"
                            />
                            {gestationalInfo.weeks > 0 && (
                              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Estimasi Usia Kehamilan: {gestationalInfo.weeks} Minggu</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: PEMERIKSAAN KLINIS & LAB */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-rose-600" />
                            <span>Langkah 2: Tensi, Letak Janin & Hasil Lab Darah</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {/* Tensi Box */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="sistolik" className="text-xs text-slate-600">Sistolik (mmHg) <span className="text-rose-600">*</span></Label>
                                <Input
                                  id="sistolik"
                                  type="number"
                                  min={60}
                                  max={260}
                                  value={formData.sistolik || ""}
                                  onChange={(e) => setFormData({ ...formData, sistolik: Number(e.target.value) })}
                                  error={errors.sistolik}
                                  className="mt-1 font-bold"
                                />
                              </div>
                              <div>
                                <Label htmlFor="diastolik" className="text-xs text-slate-600">Diastolik (mmHg) <span className="text-rose-600">*</span></Label>
                                <Input
                                  id="diastolik"
                                  type="number"
                                  min={40}
                                  max={160}
                                  value={formData.diastolik || ""}
                                  onChange={(e) => setFormData({ ...formData, diastolik: Number(e.target.value) })}
                                  error={errors.diastolik}
                                  className="mt-1 font-bold"
                                />
                              </div>
                            </div>

                            {formData.sistolik >= 140 || formData.diastolik >= 90 ? (
                              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                <span>Tensi Tinggi (&ge;140/90 mmHg) - Indikator Waspada Hipertensi / Preeklamsia</span>
                              </p>
                            ) : null}
                          </div>

                          {/* Letak Janin & Umur Kehamilan */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="letak_janin">Letak / Presentasi Janin</Label>
                              <Select
                                value={formData.letak_janin || "Memanjang"}
                                onValueChange={(val) => setFormData({ ...formData, letak_janin: val })}
                              >
                                <SelectTrigger id="letak_janin" className="mt-1">
                                  <SelectValue placeholder="Pilih letak janin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Memanjang">Memanjang (Kepala Bawah)</SelectItem>
                                  <SelectItem value="Melintang">Melintang (Lintang)</SelectItem>
                                  <SelectItem value="Obliq">Obliq (Serong)</SelectItem>
                                  <SelectItem value="Gemeli">Gemeli (Kembar)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="umur_kehamilan">Kategori Usia Hamil</Label>
                              <Select
                                value={formData.umur_kehamilan || "Aterm"}
                                onValueChange={(val) => setFormData({ ...formData, umur_kehamilan: val })}
                              >
                                <SelectTrigger id="umur_kehamilan" className="mt-1">
                                  <SelectValue placeholder="Pilih umur kehamilan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Preterm">Preterm (&lt; 37 Minggu)</SelectItem>
                                  <SelectItem value="Aterm">Aterm (37 - 41 Minggu)</SelectItem>
                                  <SelectItem value="Postterm">Postterm (&ge; 42 Minggu)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Hasil Lab Darah */}
                          <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5 text-rose-600" />
                                <span>Hasil Tes Laboratorium Darah (Jika Ada)</span>
                              </Label>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Hb (g/dL)</span>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min={3}
                                  max={25}
                                  value={formData.hb || 12.0}
                                  onChange={(e) => setFormData({ ...formData, hb: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                  placeholder="12.0"
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Leukosit (/uL)</span>
                                <Input
                                  type="number"
                                  min={500}
                                  max={80000}
                                  value={formData.leokosit || 9000}
                                  onChange={(e) => setFormData({ ...formData, leokosit: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                  placeholder="9000"
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block mb-1">Trombosit (/uL)</span>
                                <Input
                                  type="number"
                                  min={10000}
                                  max={1000000}
                                  value={formData.trombosit || 250000}
                                  onChange={(e) => setFormData({ ...formData, trombosit: Number(e.target.value) })}
                                  className="h-8 text-xs font-semibold"
                                  placeholder="250000"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* STEP 3: TANDA BAHAYA & PENGOBATAN */}
                    {currentStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span>Langkah 3: Edema, Tanda Bahaya & Riwayat Terapi</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {/* Edema Level Dropdown */}
                          <div>
                            <Label htmlFor="edema">Tanda Pembengkakan (Edema)</Label>
                            <Select
                              value={formData.edema_level}
                              onValueChange={(val: string) => setFormData({ ...formData, edema_level: val as EdemaLevel })}
                            >
                              <SelectTrigger id="edema" className="mt-1">
                                <SelectValue placeholder="Pilih tingkat pembengkakan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Tidak ada bengkak (Normal)</SelectItem>
                                <SelectItem value="ringan_kaki">Bengkak Ringan pada Kaki/Pergelangan</SelectItem>
                                <SelectItem value="bengkak_muka_tangan">Bengkak di Muka / Tungkai / Tangan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Keluhan Spesifik Checklist */}
                          <div>
                            <Label className="block mb-2 text-xs font-bold text-slate-900">
                              Keluhan Fisik / Tanda Bahaya (Centang Jika Ada):
                            </Label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                              {[
                                { id: "pusing_hebat", label: "Pusing hebat / Sakit kepala tidak hilang" },
                                { id: "pandangan_kabur", label: "Pandangan kabur / Mata berkunang-kunang" },
                                { id: "nyeri_ulu_hati", label: "Nyeri ulu hati hebat" },
                                { id: "kejang", label: "Riwayat Kejang saat hamil" },
                                { id: "perdarahan", label: "Keluar darah dari jalan lahir" },
                                { id: "ketuban_pecah", label: "Air ketuban keluar sebelum waktunya" },
                                { id: "gerak_janin_berkurang", label: "Gerakan janin berkurang / Tidak terasa" },
                              ].map((item) => (
                                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors">
                                  <Checkbox
                                    id={item.id}
                                    checked={formData.keluhan_spesifik.includes(item.id)}
                                    onCheckedChange={() => handleCheckboxToggle(item.id)}
                                  />
                                  <Label htmlFor={item.id} className="text-xs font-normal text-slate-700 cursor-pointer">
                                    {item.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Pengobatan / Treatment */}
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                            <Label className="text-xs font-bold text-slate-800 block">
                              Apakah sudah mendapat terapi obat / penanganan medis sebelumnya?
                            </Label>
                            <RadioGroup
                              value={formData.sudah_dapat_treatment ? "true" : "false"}
                              onValueChange={(val) => setFormData({ ...formData, sudah_dapat_treatment: val === "true" })}
                              className="flex gap-4 pt-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="tx-no" />
                                <Label htmlFor="tx-no" className="text-xs cursor-pointer">Belum Pernah</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="tx-yes" />
                                <Label htmlFor="tx-yes" className="text-xs cursor-pointer">Sudah / Sedang Minum Obat</Label>
                              </div>
                            </RadioGroup>

                            {formData.sudah_dapat_treatment && (
                              <Input
                                placeholder="Tuliskan nama obat / terapi (misal: Obat penurun tensi, TTD)..."
                                value={formData.detail_treatment || ""}
                                onChange={(e) => setFormData({ ...formData, detail_treatment: e.target.value })}
                                className="mt-2 text-xs"
                              />
                            )}
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

                      {currentStep < 3 ? (
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
                          {isLoading ? "Menganalisis dengan ML..." : "Lihat Hasil Analisis"}
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
