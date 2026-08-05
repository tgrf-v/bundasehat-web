import React, { useState } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select } from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import { Dialog } from "@/Components/ui/dialog";
import { Tabs } from "@/Components/ui/tabs";
import {
  Heart,
  Activity,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  User,
  Plus,
  ArrowRight,
  Stethoscope,
  Info,
  Search,
} from "lucide-react";

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  const handleSimulateError = () => {
    if (!inputValue) {
      setInputError("Sistolik wajib diisi antara 60 - 240 mmHg");
    } else {
      setInputError("");
    }
  };

  return (
    <BundaSehatLayout activeNav="beranda">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Page Header */}
        <div className="border-b border-slate-200/80 pb-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Preview Style Guide & Design System</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              BundaSehat Design System Showcase
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Dokumentasi komponen UI, skema warna, tipografi, dan indikator risiko (Halodoc x Hamilku.ID)
            </p>
          </div>

          <Button
            variant="rose"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 shadow-soft-sm text-xs font-bold"
          >
            <Sparkles className="h-4 w-4" />
            <span>Uji Coba Dialog Modal</span>
          </Button>
        </div>

        {/* SECTION 1: COLOR PALETTE SHOWCASE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">1. Skema Warna (Color Tokens)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-semibold">
            {/* Emerald Primary */}
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-soft-sm space-y-1">
              <p className="font-bold">Maternity Emerald</p>
              <p className="text-[10px] opacity-80">#059669 (Primary)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-soft-sm space-y-1">
              <p className="font-bold">Emerald Light</p>
              <p className="text-[10px] opacity-80">#10B981</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 space-y-1">
              <p className="font-bold">Emerald Soft BG</p>
              <p className="text-[10px] text-emerald-700">#ECFDF5</p>
            </div>

            {/* Rose Accent */}
            <div className="p-3.5 rounded-2xl bg-rose-600 text-white shadow-soft-sm space-y-1">
              <p className="font-bold">Medical Rose</p>
              <p className="text-[10px] opacity-80">#E11D48 (Halodoc)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500 text-white shadow-soft-sm space-y-1">
              <p className="font-bold">Rose Accent</p>
              <p className="text-[10px] opacity-80">#F43F5E</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200/80 space-y-1">
              <p className="font-bold">Rose Soft BG</p>
              <p className="text-[10px] text-rose-700">#FFF1F2</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: HEALTH RISK LEVEL INDICATORS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-rose-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">2. Indikator Tingkat Risiko Komplikasi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Risk Level: Ringan */}
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500 text-white rounded-xl">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-emerald-900">Risiko Ringan</h3>
                    <p className="text-[10px] text-emerald-700">KRR (Kelompok Risiko Ringan) &le;5</p>
                  </div>
                </div>
                <Badge variant="ringan">Normal / BPM</Badge>
              </CardContent>
            </Card>

            {/* Risk Level: Sedang */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-900">Risiko Sedang</h3>
                    <p className="text-[10px] text-amber-700">KRT (Kelompok Risiko Tinggi) 6-11</p>
                  </div>
                </div>
                <Badge variant="sedang">Puskesmas / Type C</Badge>
              </CardContent>
            </Card>

            {/* Risk Level: Berat */}
            <Card className="border-rose-200 bg-rose-50/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-rose-900">Risiko Berat</h3>
                    <p className="text-[10px] text-rose-700">KRST (Sangat Tinggi) &ge;12</p>
                  </div>
                </div>
                <Badge variant="berat">Wajib Rujukan RS</Badge>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* SECTION 3: BUTTON VARIANTS SHOWCASE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">3. Varian Komponen Tombol (Button)</h2>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              
              {/* Color Variants */}
              <div>
                <Label className="text-xs text-slate-500 block mb-2">Varian Warna Utama:</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default" className="gap-2">
                    <Activity className="h-4 w-4" />
                    <span>Primary Emerald</span>
                  </Button>

                  <Button variant="rose" className="gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Medical Rose</span>
                  </Button>

                  <Button variant="secondary" className="gap-2">
                    <span>Secondary Soft</span>
                  </Button>

                  <Button variant="outline" className="gap-2">
                    <span>Outline Button</span>
                  </Button>

                  <Button variant="ghost" className="gap-2">
                    <span>Ghost Button</span>
                  </Button>

                  <Button variant="destructive" className="gap-2">
                    <span>Destructive</span>
                  </Button>

                  <Button variant="link">
                    <span>Link Button</span>
                  </Button>
                </div>
              </div>

              {/* Sizes & States */}
              <div>
                <Label className="text-xs text-slate-500 block mb-2">Ukuran & State Loading:</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="default">Small (sm)</Button>
                  <Button size="default" variant="default">Default</Button>
                  <Button size="lg" variant="rose" className="gap-2">
                    <span>Large (lg)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="rose"
                    isLoading={loadingButton}
                    onClick={() => {
                      setLoadingButton(true);
                      setTimeout(() => setLoadingButton(false), 2000);
                    }}
                  >
                    Simulasi Loading State
                  </Button>
                </div>
              </div>

            </div>
          </Card>
        </section>

        {/* SECTION 4: FORM INPUTS & SELECTION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">4. Form Input & Controls</h2>
          </div>

          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Normal Input */}
              <div className="space-y-2">
                <Label htmlFor="nama_pasien">Nama Pasien</Label>
                <Input
                  id="nama_pasien"
                  placeholder="Masukkan nama lengkap..."
                />
              </div>

              {/* Select Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="edema_select">Tanda Pembengkakan (Edema)</Label>
                <Select
                  id="edema_select"
                  options={[
                    { value: "none", label: "Tidak Ada Pembengkakan (Normal)" },
                    { value: "ringan_kaki", label: "Ringan - Bengkak Pergelangan Kaki" },
                    { value: "sedang_tungkai", label: "Sedang - Bengkak Tungkai/Betis" },
                    { value: "berat_wajah_tangan", label: "Berat - Bengkak Wajah & Tangan" },
                  ]}
                />
              </div>

              {/* Error State Simulation Input */}
              <div className="space-y-2">
                <Label htmlFor="sistolik">Tekanan Sistolik (mmHg) - Uji State Error</Label>
                <div className="flex gap-2">
                  <Input
                    id="sistolik"
                    placeholder="Contoh: 140"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    error={inputError}
                  />
                  <Button variant="outline" size="sm" onClick={handleSimulateError} className="shrink-0">
                    Cek Error
                  </Button>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <Label htmlFor="hpht_date">Tanggal HPHT</Label>
                <Input
                  id="hpht_date"
                  type="date"
                />
              </div>

            </div>
          </Card>
        </section>

        {/* SECTION 5: TABS & PROGRESS BAR */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-bold text-slate-900">5. Tabs Navigation & Gauge Bar</h2>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <Label className="text-xs text-slate-500 block mb-2">Tabs Navigation Component:</Label>
              <Tabs
                activeTab={activeTab}
                onChange={setActiveTab}
                items={[
                  { id: "semua", label: "Semua Panduan", count: 4 },
                  { id: "terapi_komplementer", label: "Terapi Komplementer", count: 2 },
                  { id: "edukasi", label: "Edukasi Kebidanan", count: 2 },
                ]}
              />
            </div>

            <div>
              <Label className="text-xs text-slate-500 block mb-2">Progress Meter / Risk Score Bar:</Label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Skor Risiko Ringan (Score 4)</span>
                    <span className="text-emerald-600 font-bold">20%</span>
                  </div>
                  <Progress value={20} variant="emerald" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Skor Risiko Sedang (Score 10)</span>
                    <span className="text-amber-600 font-bold">50%</span>
                  </div>
                  <Progress value={50} variant="amber" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Skor Risiko Berat / HDK (Score 18)</span>
                    <span className="text-rose-600 font-bold">90%</span>
                  </div>
                  <Progress value={90} variant="rose" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* DIALOG POPUP PREVIEW */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Uji Coba Dialog Modal Shadcn UI"
          description="Komponen dialog ini dilengkapi animasi smooth, backdrop blur, dan tombol keyboard Escape."
        >
          <div className="space-y-4 py-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              Semua modal dan popup di BundaSehat menggunakan komponen Dialog ini untuk pengalaman pengguna yang sangat responsif.
            </p>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium">
              Komponen ini terisolasi dan modular di <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">resources/js/Components/ui/dialog.tsx</code>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="default" size="sm" onClick={() => setIsDialogOpen(false)}>
                Mengerti
              </Button>
            </div>
          </div>
        </Dialog>

      </div>
    </BundaSehatLayout>
  );
}
