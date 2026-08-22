import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import { ScreeningInput, ScreeningResult } from "@/types/screening";
import { calculateGestationalAge, evaluateScreening } from "@/lib/scoringEngine";
import { PageProps } from "@/types";

import { ScreeningStepIndicator } from "./_ScreeningStepIndicator";
import { FormStep1Identitas } from "./_FormStep1Identitas";
import { FormStep2Kondisi } from "./_FormStep2Kondisi";
import { FormStep3Gawat } from "./_FormStep3Gawat";
import { HasilRingkas } from "./_HasilRingkas";
import { HasilDetail } from "./_HasilDetail";

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

  const validateStep2 = (): boolean => { setErrors({}); return true; };
  const validateStep3 = (): boolean => { setErrors({}); return true; };

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
    if (currentStep < TOTAL_STEPS) { handleNextStep(e); return; }
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
      onSuccess: () => { setIsLoading(false); setErrors({}); },
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

                {/* Dynamic Area: Hasil atau Form Input */}
                {hasScreened && screeningResult ? (
                  rightPanelView === "detail" ? (
                    <HasilDetail
                      screeningResult={screeningResult}
                      formData={formData}
                      gestationalInfo={gestationalInfo}
                      setRightPanelView={setRightPanelView}
                      handleRescreen={handleRescreen}
                    />
                  ) : (
                    <HasilRingkas
                      screeningResult={screeningResult}
                      formData={formData}
                      gestationalInfo={gestationalInfo}
                      setRightPanelView={setRightPanelView}
                      handleRescreen={handleRescreen}
                    />
                  )
                ) : (
                  <div className="space-y-5">
                    <ScreeningStepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

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

                      {currentStep === 1 && (
                        <FormStep1Identitas
                          formData={formData}
                          setFormData={setFormData}
                          errors={errors}
                          gestationalInfo={gestationalInfo}
                          isHamilPertama={isHamilPertama}
                          toggleCheckbox={toggleCheckbox}
                        />
                      )}

                      {currentStep === 2 && (
                        <FormStep2Kondisi
                          formData={formData}
                          setFormData={setFormData}
                          toggleCheckbox={toggleCheckbox}
                        />
                      )}

                      {currentStep === 3 && (
                        <FormStep3Gawat
                          formData={formData}
                          setFormData={setFormData}
                        />
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
