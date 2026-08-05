import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
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
import { ScreeningInput, EdemaLevel } from "@/types/screening";
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
} from "lucide-react";

export default function KehamilanScreening() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ScreeningInput>({
    nama_pasien: "",
    nik: "",
    umur: 25,
    paritas: 0,
    hpht: "",
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

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const resultData = evaluateScreening(formData);
      sessionStorage.setItem("latest_screening_result", JSON.stringify(resultData));

      setTimeout(() => {
        setIsLoading(false);
        router.visit("/screening/hasil");
      }, 600);
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: "Terjadi kesalahan saat memproses screening. Silakan coba lagi." });
    }
  };

  return (
    <BundaSehatLayout activeNav="screening">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header & Step Wizard Bar */}
        <div className="text-center mb-8">
          <Badge variant="rose" className="mb-2 gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Form Screening Kehamilan</span>
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Deteksi Dini Komplikasi Kehamilan
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Isi data fisik, tensi darah, dan keluhan untuk mengkalkulasi tingkat risiko & rujukan Faskes
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span className={currentStep >= 1 ? "text-rose-600 font-extrabold" : ""}>
              1. Data Diri & HPHT
            </span>
            <span className={currentStep >= 2 ? "text-rose-600 font-extrabold" : ""}>
              2. Tensi & Gejala
            </span>
            <span className={currentStep >= 3 ? "text-rose-600 font-extrabold" : ""}>
              3. Bias Treatment
            </span>
          </div>
          <Progress value={(currentStep / 3) * 100} variant="rose" className="h-2.5" />
        </div>

        {/* Form Card Container */}
        <Card className="border-slate-200/80 shadow-soft-lg bg-white">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: DATA DIRI & KEHAMILAN */}
            {currentStep === 1 && (
              <div className="space-y-5 p-6 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-rose-600" />
                    <span>Langkah 1: Identitas & Riwayat Kehamilan</span>
                  </h3>
                  <p className="text-xs text-slate-500">Masukkan umur, paritas, dan tanggal HPHT pasien</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nama_pasien">Nama Lengkap Pasien <span className="text-rose-600">*</span></Label>
                    <Input
                      id="nama_pasien"
                      placeholder="Contoh: Ibu Rahma Rahayu"
                      value={formData.nama_pasien}
                      onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                      error={errors.nama_pasien}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="umur">Umur Ibu (Tahun) <span className="text-rose-600">*</span></Label>
                      <Input
                        id="umur"
                        type="number"
                        min={10}
                        max={60}
                        value={formData.umur}
                        onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                        error={errors.umur}
                        className="mt-1.5"
                      />
                      {formData.umur < 20 && (
                        <p className="text-[11px] text-amber-600 mt-1 font-medium">Usia &lt; 20 tahun menambah faktor risiko Resti</p>
                      )}
                      {formData.umur >= 35 && (
                        <p className="text-[11px] text-amber-600 mt-1 font-medium">Usia &ge; 35 tahun menambah faktor risiko Resti</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="paritas">Paritas (Jumlah Persalinan Sebelumnya)</Label>
                      <Input
                        id="paritas"
                        type="number"
                        min={0}
                        max={15}
                        value={formData.paritas}
                        onChange={(e) => setFormData({ ...formData, paritas: Number(e.target.value) })}
                        error={errors.paritas}
                        className="mt-1.5"
                      />
                      {formData.paritas >= 4 && (
                        <p className="text-[11px] text-amber-600 mt-1 font-medium">Paritas &ge; 4 (Grande Multipara)</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hpht">Hari Pertama Haid Terakhir (HPHT)</Label>
                    <DatePicker
                      id="hpht"
                      value={formData.hpht}
                      onChange={(val) => setFormData({ ...formData, hpht: val })}
                      className="mt-1.5"
                    />
                    {gestationalInfo.weeks > 0 && (
                      <div className="mt-2.5 p-3 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-between text-xs text-rose-900">
                        <span>Usia Kehamilan Otomatis: <strong className="font-bold">{gestationalInfo.weeks} Minggu</strong></span>
                        {gestationalInfo.dueDate && <span>HPL: <strong className="font-bold">{gestationalInfo.dueDate}</strong></span>}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="wilayah">Wilayah Puskesmas / Faskes Domisili</Label>
                    <Select
                      value={formData.wilayah_puskesmas}
                      onValueChange={(val) => setFormData({ ...formData, wilayah_puskesmas: val })}
                    >
                      <SelectTrigger id="wilayah" className="mt-1.5">
                        <SelectValue placeholder="Pilih wilayah puskesmas..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Puskesmas Wilayah 1">Puskesmas Wilayah 1 (Kecamatan A)</SelectItem>
                        <SelectItem value="Puskesmas Wilayah 2">Puskesmas Wilayah 2 (Kecamatan B)</SelectItem>
                        <SelectItem value="Puskesmas Wilayah 3">Puskesmas Wilayah 3 (Kecamatan C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TENSI & GEJALA FISIK */}
            {currentStep === 2 && (
              <div className="space-y-5 p-6 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-600" />
                    <span>Langkah 2: Tekanan Darah, Edema, & Keluhan Fisik</span>
                  </h3>
                  <p className="text-xs text-slate-500">Hasil pemeriksaan tensi dan keluhan fisik spesifik</p>
                </div>

                <div className="space-y-5">
                  
                  {/* Tensi & MAP Calculator Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-900">Tekanan Darah (Tensi)</Label>
                      <Badge variant={calculatedMap >= 90 ? "sedang" : "ringan"}>
                        MAP: {calculatedMap} mmHg
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Tensi Tinggi (&ge;140/90 mmHg) - Tanda Risiko Preeklamsia</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Edema Level Dropdown */}
                  <div>
                    <Label htmlFor="edema">Tanda Pembengkakan (Edema)</Label>
                    <Select
                      value={formData.edema_level}
                      onValueChange={(val) => setFormData({ ...formData, edema_level: val as EdemaLevel })}
                    >
                      <SelectTrigger id="edema" className="mt-1.5">
                        <SelectValue placeholder="Pilih tingkat edema..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak Ada Pembengkakan (Normal)</SelectItem>
                        <SelectItem value="ringan_kaki">Ringan - Bengkak di Pergelangan Kaki</SelectItem>
                        <SelectItem value="sedang_tungkai">Sedang - Bengkak di Tungkai / Betis</SelectItem>
                        <SelectItem value="berat_wajah_tangan">Berat - Bengkak di Wajah & Kelopak Tangan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Checkbox Keluhan Spesifik (Shadcn UI Checkbox Component) */}
                  <div>
                    <Label className="text-xs font-bold text-slate-900 block mb-2">
                      Keluhan Fisik Spesifik Lainnya (Bisa pilih lebih dari satu):
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: "pusing_berat_kabur", label: "Pusing Berat / Pandangan Kabur" },
                        { id: "nyeri_ulu_hati", label: "Nyeri Ulu Hati (Epigastrium)" },
                        { id: "anemia_pucat", label: "Anemia / Pucat & Cepat Lelah" },
                        { id: "perdarahan", label: "Perdarahan / Flek" },
                        { id: "gerakan_janin_berkurang", label: "Gerakan Janin Berkurang" },
                        { id: "riwayat_sc", label: "Riwayat Operasi SC (Seksio Sesarea)" },
                      ].map((item) => {
                        const checked = formData.keluhan_spesifik.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all select-none text-xs font-semibold ${
                              checked
                                ? "bg-pink-50 border-pink-200 text-rose-900 shadow-soft-sm"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Checkbox
                              id={item.id}
                              checked={checked}
                              onCheckedChange={() => handleCheckboxToggle(item.id)}
                            />
                            <label htmlFor={item.id} className="cursor-pointer flex-1">
                              {item.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: PREVENTING BIAS QUESTION */}
            {currentStep === 3 && (
              <div className="space-y-5 p-6 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-amber-500" />
                    <span>Langkah 3: Konfirmasi Penanganan Sebelumnya (Pencegahan Bias)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Memastikan hasil penilaian skoring akurat dan tidak bias oleh pengobatan awal
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-3">
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
                        className="mt-1.5"
                      />
                    </div>
                  )}

                  {errors.general && (
                    <p className="text-xs text-rose-600 font-semibold p-3 bg-rose-50 rounded-xl border border-rose-200">
                      {errors.general}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation & Submit Buttons */}
            <CardFooter className="flex items-center justify-between border-t border-slate-100 p-4 bg-slate-50/50">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" size="sm" onClick={handlePrevStep} className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button type="button" variant="default" size="sm" onClick={handleNextStep} className="gap-1">
                  <span>Lanjut Langkah {currentStep + 1}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" variant="rose" size="sm" isLoading={isLoading} className="gap-2 shadow-soft-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Proses & Lihat Hasil Screening</span>
                </Button>
              )}
            </CardFooter>

          </form>
        </Card>

      </div>
    </BundaSehatLayout>
  );
}
