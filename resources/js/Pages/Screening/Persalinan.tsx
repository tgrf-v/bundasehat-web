import React, { useState, useEffect } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { evaluateScreening } from "@/lib/scoringEngine";
import {
  Heart,
  User,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function PersalinanScreening() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasScreened, setHasScreened] = useState<boolean>(false);
  const [persalinanResult, setPersalinanResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    nama_pasien: "Ibu Rahma Rahayu",
    umur: 27,
    paritas: 1,
    sistolik: 120,
    diastolik: 80,
    posisi_janin: "kepala_bawah",
    kondisi_ketuban: "utuh",
    ada_riwayat_sc: false,
    wilayah_puskesmas: "Puskesmas Wilayah 1",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("latest_persalinan_result");
    if (saved) {
      try {
        setPersalinanResult(JSON.parse(saved));
        setHasScreened(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const keluhanList: string[] = [];
    if (formData.ada_riwayat_sc) keluhanList.push("riwayat_sc");

    const result = evaluateScreening({
      nama_pasien: formData.nama_pasien || "Pasien Persalinan",
      umur: formData.umur,
      paritas: formData.paritas,
      sistolik: formData.sistolik,
      diastolik: formData.diastolik,
      edema_level: "none",
      keluhan_spesifik: keluhanList,
      sudah_dapat_treatment: false,
      tipe_screening: "persalinan",
      wilayah_puskesmas: formData.wilayah_puskesmas,
    });

    sessionStorage.setItem("latest_persalinan_result", JSON.stringify(result));

    setTimeout(() => {
      setIsLoading(false);
      setPersalinanResult(result);
      setHasScreened(true);
    }, 500);
  };

  const handleRescreen = () => {
    setHasScreened(false);
  };

  return (
    <BundaSehatLayout activeNav="persalinan">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <Badge variant="rose" className="mb-2 gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Form & Hasil Screening Persalinan</span>
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Penentuan Rekomendasi Tempat Persalinan
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {hasScreened
              ? "Berikut adalah hasil kalkulasi kesiapan persalinan dan rekomendasi tingkat tenaga medis"
              : "Hitung skoring kesiapan bersalin & tentukan tingkat tenaga medis yang wajib mendampingi"}
          </p>
        </div>

        {/* CONDITION 1: HAS SCREENED -> DISPLAY PERSALINAN RESULT */}
        {hasScreened && persalinanResult ? (
          <div className="space-y-6 animate-fadeIn">
            <Card className="border-slate-200 shadow-soft-lg bg-white rounded-3xl overflow-hidden">
              <div
                className={`p-6 md:p-8 text-white ${
                  persalinanResult.kategori_risiko === "KRR"
                    ? "bg-emerald-600"
                    : persalinanResult.kategori_risiko === "KRT"
                    ? "bg-amber-500"
                    : "bg-rose-600"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
                  Rekomendasi Utama Persalinan:
                </span>
                <h2 className="text-2xl font-black mt-1">
                  {persalinanResult.rekomendasi_tempat}
                </h2>
                <p className="text-xs text-white/90 mt-2 font-medium">
                  Penolong Wajib: <strong className="font-bold">{persalinanResult.penolong_persalinan}</strong>
                </p>
              </div>

              <CardContent className="p-6 space-y-5">
                <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
                  <h4 className="font-extrabold text-rose-900 text-xs uppercase tracking-wider">
                    Analisis Kesiapan Ibu Bersalin:
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {persalinanResult.kategori_risiko === "KRR"
                      ? "Kondisi fisik dan janin dalam batas normal (Preskep). Persalinan aman dilakukan di Bidan Praktik Mandiri (BPM) atau Puskesmas setempat."
                      : persalinanResult.kategori_risiko === "KRT"
                      ? "Terdeteksi faktor risiko sedang. Persalinan direkomendasikan di Puskesmas PONED dengan pengawasan Bidan & Dokter."
                      : "Terdeteksi faktor risiko berat / riwayat komplikasi. Wajib rujukan ke Rumah Sakit (RS) fasilitas SC."}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Rincian Data Persalinan:</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span>Presentasi Janin: <strong>{formData.posisi_janin === "kepala_bawah font-bold" ? "Kepala di Bawah" : "Sungsang/Lintang"}</strong></span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span>Riwayat SC: <strong>{formData.ada_riwayat_sc ? "Ada" : "Tidak Ada"}</strong></span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-slate-100 p-6 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs text-slate-500">Kondisi fisik berubah saat mendekati HPL?</span>
                <Button
                  type="button"
                  variant="rose"
                  onClick={handleRescreen}
                  className="gap-2 font-bold shadow-soft-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Screening Persalinan Ulang</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          /* CONDITION 2: NOT SCREENED -> DISPLAY FORM INPUT PERSALINAN */
          <Card className="border-slate-200/80 shadow-soft-lg bg-white rounded-3xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-rose-600" />
                  <span>Form Evaluasi Kesiapan Persalinan</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Sistem akan memvalidasi apakah persalinan aman di BPM/Puskesmas atau wajib rujukan RS
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                <div>
                  <Label htmlFor="nama">Nama Pasien / Ibu Hamil</Label>
                  <Input
                    id="nama"
                    placeholder="Contoh: Ibu Rahma Rahayu"
                    value={formData.nama_pasien}
                    onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="umur">Umur (Tahun)</Label>
                    <Input
                      id="umur"
                      type="number"
                      value={formData.umur}
                      onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paritas">Paritas (Riwayat Melahirkan)</Label>
                    <Input
                      id="paritas"
                      type="number"
                      value={formData.paritas}
                      onChange={(e) => setFormData({ ...formData, paritas: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <Label htmlFor="sistolik" className="text-xs">Sistolik (mmHg)</Label>
                    <Input
                      id="sistolik"
                      type="number"
                      value={formData.sistolik}
                      onChange={(e) => setFormData({ ...formData, sistolik: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolik" className="text-xs">Diastolik (mmHg)</Label>
                    <Input
                      id="diastolik"
                      type="number"
                      value={formData.diastolik}
                      onChange={(e) => setFormData({ ...formData, diastolik: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="posisi">Presentasi / Posisi Janin</Label>
                  <Select
                    value={formData.posisi_janin}
                    onValueChange={(val) => setFormData({ ...formData, posisi_janin: val })}
                  >
                    <SelectTrigger id="posisi" className="mt-1">
                      <SelectValue placeholder="Pilih posisi janin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kepala_bawah">Kepala di Bawah (Normal / Preskep)</SelectItem>
                      <SelectItem value="sungsang">Sungsang / Bokong di Bawah (Resti)</SelectItem>
                      <SelectItem value="lintang">Posisi Lintang / Melintang (Wajib SC RS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-center justify-between">
                  <div className="text-xs text-rose-900 font-semibold">
                    <span>Apakah Ada Riwayat Operasi SC Sebelumnya?</span>
                  </div>
                  <Checkbox
                    id="riwayat_sc_check"
                    checked={formData.ada_riwayat_sc}
                    onCheckedChange={(checked) => setFormData({ ...formData, ada_riwayat_sc: checked })}
                  />
                </div>
              </CardContent>

              <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
                <Button type="submit" variant="rose" isLoading={isLoading} className="gap-2 font-bold shadow-soft-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Kalkulasi Rekomendasi Persalinan</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

      </div>
    </BundaSehatLayout>
  );
}
