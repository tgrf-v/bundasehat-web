import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function KehamilanScreening() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  const [formData, setFormData] = useState<ScreeningInput>({
    nama_pasien: "Ibu Rahma Rahayu",
    nik: "3201928301920002",
    umur: 27,
    paritas: 1,
    hpht: "2025-10-12",
    sistolik: 120,
    diastolik: 80,
    edema_level: "none",
    keluhan_spesifik: [],
    sudah_dapat_treatment: false,
    detail_treatment: "",
    tipe_screening: "kehamilan",
    wilayah_puskesmas: "Puskesmas Wilayah 1",
  });

  const [gestationalInfo, setGestationalInfo] = useState<{ weeks: number; dueDate?: string }>({ weeks: 0 });
  const [calculatedMap, setCalculatedMap] = useState<number>(86.67);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("latest_screening_result");
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setScreeningResult(parsed);
        setHasScreened(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.hpht) {
      setGestationalInfo(calculateGestationalAge(formData.hpht));
    }
  }, [formData.hpht]);

  useEffect(() => {
    setCalculatedMap(calculateMAP(formData.sistolik, formData.diastolik));
  }, [formData.sistolik, formData.diastolik]);

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
    if (formData.paritas < 0) errs.paritas = "Paritas tidak boleh negatif";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.sistolik || formData.sistolik < 60 || formData.sistolik > 240) {
      errs.sistolik = "Tekanan sistolik valid (60-240 mmHg)";
    }
    if (!formData.diastolik || formData.diastolik < 40 || formData.diastolik > 160) {
      errs.diastolik = "Tekanan diastolik valid (40-160 mmHg)";
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
    setIsLoading(true);

    try {
      const resultData = evaluateScreening(formData);
      sessionStorage.setItem("latest_screening_result", JSON.stringify(resultData));

      setTimeout(() => {
        setIsLoading(false);
        setScreeningResult(resultData);
        setHasScreened(true);
      }, 500);
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: "Terjadi kesalahan saat memproses screening. Silakan coba lagi." });
    }
  };

  const handleRescreen = () => {
    setHasScreened(false);
    setCurrentStep(1);
  };

  return (
    <BundaSehatLayout activeNav="kehamilan">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-0 lg:h-[calc(100vh-65px)] flex flex-col justify-center">
        
        {/* Modern Split Card with Image Fade Overlay (2 Kolom - Aligned with Navbar Logo) */}
        <div className="w-full mx-auto bg-white rounded-none border border-slate-200 overflow-hidden lg:h-full">
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
              <div className="mb-6">
                <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3 inline-block">
                  Deteksi Dini Risk
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Deteksi Dini Komplikasi Kehamilan
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {hasScreened
                    ? "Berikut adalah hasil analisis tingkat risiko kehamilan dan saran terapi komplementer Anda"
                    : "Isi data fisik, tensi darah, dan keluhan untuk mengkalkulasi tingkat risiko & rujukan Faskes"}
                </p>
              </div>

              {/* Dynamic Area: Form 3-Step atau Result View */}
              {hasScreened && screeningResult ? (
                /* CONDITION 1: SUDAH SCREENED -> DISPLAY RESULT VIEW */
                <div className="space-y-5 animate-fadeIn">
                  
                  <div className="border border-slate-200 bg-white rounded-none overflow-hidden">
                    <div
                      className={`p-5 text-white ${
                        screeningResult.kategori_risiko === "KRR"
                          ? "bg-emerald-600"
                          : screeningResult.kategori_risiko === "KRT"
                          ? "bg-amber-500"
                          : "bg-rose-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider opacity-90 block">Kategori Risiko Kehamilan:</span>
                          <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                            {screeningResult.status_label}
                          </h2>
                        </div>

                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                          {screeningResult.total_skor}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap justify-between gap-2 text-xs">
                        <span>Nama Pasien: <strong>{screeningResult.nama_pasien}</strong></span>
                        <span>Skor KSPR: <strong>{screeningResult.total_skor} Poin</strong></span>
                        <span>Tensi: <strong>{formData.sistolik}/{formData.diastolik} mmHg</strong></span>
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      
                      {/* Rekomendasi Faskes & Rujukan */}
                      <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-100 space-y-1">
                        <h4 className="font-bold text-rose-900 text-xs flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-rose-600" />
                          <span>Rekomendasi Tempat & Penolong Persalinan</span>
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed pl-6 font-semibold">
                          {screeningResult.rekomendasi_tempat} ({screeningResult.penolong_persalinan})
                        </p>
                      </div>

                      {/* Rincian Faktor Risiko */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-xs">Rincian Faktor Risiko Terdeteksi:</h4>
                        <div className="space-y-1.5">
                          {screeningResult.detail_skor.map((factor, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800">{factor.deskripsi}</span>
                              <Badge variant="rose" className="font-bold text-[11px]">+{factor.skor} Poin</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Terapi Komplementer Non-Obat Khusus Hasil Screening */}
                      <div className="space-y-2 pt-1">
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-rose-600" />
                          <span>Saran Terapi Komplementer Non-Obat Khusus Bunda</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {screeningResult.saran_terapi.map((terapi, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 space-y-1 text-xs">
                              <p className="font-bold text-rose-900 flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                                <span>{terapi}</span>
                              </p>
                              <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                                Metode aman non-farmakologi untuk meredakan ketegangan dan mengoptimalkan kondisi fisik ibu hamil.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Bottom Rescreen Action */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        Usia kehamilan bertambah atau ada perubahan gejala minggu ini?
                      </p>

                      <Button
                        type="button"
                        variant="rose"
                        onClick={handleRescreen}
                        className="w-full sm:w-auto gap-2 font-bold shadow-soft-sm text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Lakukan Screening Ulang</span>
                      </Button>
                    </div>
                  </div>

                </div>
              ) : (
                /* CONDITION 2: BELUM SCREENED ATAU KLIK SCREENING ULANG -> DISPLAY FORM INPUT 3-STEP */
                <div className="space-y-5">
                  
                  {/* Step Indicator Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className={currentStep >= 1 ? "text-teal-700 font-bold" : ""}>
                        1. Data Diri & HPHT
                      </span>
                      <span className={currentStep >= 2 ? "text-teal-700 font-bold" : ""}>
                        2. Tensi & Gejala
                      </span>
                      <span className={currentStep >= 3 ? "text-teal-700 font-bold" : ""}>
                        3. Bias Treatment
                      </span>
                    </div>
                    <Progress value={(currentStep / 3) * 100} variant="rose" className="h-2" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* STEP 1 */}
                    {currentStep === 1 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-teal-600" />
                            <span>Langkah 1: Identitas & Riwayat Kehamilan</span>
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="nama_pasien">Nama Lengkap Pasien <span className="text-rose-600">*</span></Label>
                            <Input
                              id="nama_pasien"
                              placeholder="Contoh: Ibu Rahma Rahayu"
                              value={formData.nama_pasien}
                              onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                              error={errors.nama_pasien}
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="umur">Umur (Tahun) <span className="text-rose-600">*</span></Label>
                              <Input
                                id="umur"
                                type="number"
                                min={10}
                                max={60}
                                value={formData.umur}
                                onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                                error={errors.umur}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="paritas">Jumlah Hamil (Paritas)</Label>
                              <Input
                                id="paritas"
                                type="number"
                                min={0}
                                value={formData.paritas}
                                onChange={(e) => setFormData({ ...formData, paritas: Number(e.target.value) })}
                                className="mt-1"
                              />
                            </div>
                          </div>

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

                    {/* STEP 2 */}
                    {currentStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-teal-600" />
                            <span>Langkah 2: Tekanan Darah, Edema, & Keluhan Fisik</span>
                          </h3>
                        </div>

                        <div className="space-y-4">
                          
                          {/* Tensi Box */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="sistolik" className="text-xs text-slate-600">Sistolik (mmHg)</Label>
                                <Input
                                  id="sistolik"
                                  type="number"
                                  min={60}
                                  max={240}
                                  value={formData.sistolik}
                                  onChange={(e) => setFormData({ ...formData, sistolik: Number(e.target.value) })}
                                  error={errors.sistolik}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="diastolik" className="text-xs text-slate-600">Diastolik (mmHg)</Label>
                                <Input
                                  id="diastolik"
                                  type="number"
                                  min={40}
                                  max={160}
                                  value={formData.diastolik}
                                  onChange={(e) => setFormData({ ...formData, diastolik: Number(e.target.value) })}
                                  error={errors.diastolik}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            {formData.sistolik >= 140 || formData.diastolik >= 90 ? (
                              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                <span>Tensi Tinggi (&ge;140/90 mmHg) - Tanda Risiko Preeklamsia</span>
                              </p>
                            ) : null}
                          </div>

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
                                <SelectItem value="bengkak_muka_tangan">Bengkak di Muka / Tungkai / Tangan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Keluhan Spesifik Checklist */}
                          <div>
                            <Label className="block mb-2 text-xs font-bold text-slate-900">
                              Keluhan Fisik Lainnya (Centang Jika Ada):
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
                                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors">
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

                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {currentStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-2">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-amber-500" />
                            <span>Langkah 3: Konfirmasi Penanganan Sebelumnya</span>
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-3">
                            <Label className="text-xs font-bold text-amber-900 block">
                              Apakah pasien sudah mendapatkan treatment / penanganan medis sebelumnya?
                            </Label>

                            <RadioGroup
                              value={formData.sudah_dapat_treatment ? "ya" : "belum"}
                              onValueChange={(val) => setFormData({ ...formData, sudah_dapat_treatment: val === "ya" })}
                              className="flex items-center gap-6"
                            >
                              <RadioGroupItem value="ya" id="treatment_ya" label="Ya, Sudah Menerima Treatment" />
                              <RadioGroupItem value="belum" id="treatment_belum" label="Belum Ada Treatment" />
                            </RadioGroup>
                          </div>

                          {formData.sudah_dapat_treatment && (
                            <div className="animate-fadeIn">
                              <Label htmlFor="detail_treatment">Detail Penanganan / Obat yang Sudah Diberikan</Label>
                              <Input
                                id="detail_treatment"
                                placeholder="Contoh: Mengonsumsi Nifedipin 10mg / Suplemen Tablet Tambah Darah"
                                value={formData.detail_treatment || ""}
                                onChange={(e) => setFormData({ ...formData, detail_treatment: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                      {currentStep > 1 ? (
                        <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} className="gap-1 text-xs">
                          <ChevronLeft className="h-4 w-4" />
                          <span>Sebelumnya</span>
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 3 ? (
                        <Button type="button" variant="default" size="sm" onClick={handleNextStep} className="gap-1 text-xs">
                          <span>Lanjut Langkah {currentStep + 1}</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" variant="rose" size="sm" isLoading={isLoading} className="gap-2 shadow-soft-sm font-bold text-xs">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Proses & Lihat Hasil Screening</span>
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
