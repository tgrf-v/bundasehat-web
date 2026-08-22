import React from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { ProfileFormData } from "./types";

interface ProfilEditFormProps {
  data: ProfileFormData;
  setData: <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => void;
  errors: Partial<Record<keyof ProfileFormData, string>>;
  processing: boolean;
  isSaved: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function ProfilEditForm({
  data,
  setData,
  errors,
  processing,
  isSaved,
  onSubmit,
  onBack,
}: ProfilEditFormProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar Navigation */}
      <div className="flex items-center justify-between relative py-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
          Edit Data Diri
        </h2>
      </div>

      {/* Form Container Card */}
      <Card className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-5">
        <form onSubmit={onSubmit} className="space-y-4">
          {isSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Data diri berhasil disimpan ke database!</span>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium space-y-1 animate-fadeIn">
              {Object.values(errors).map((err, idx) => (
                <p key={idx} className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <span>{err}</span>
                </p>
              ))}
            </div>
          )}

          {/* Field 1: Nama */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nama Lengkap"
              required
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.name}</p>}
          </div>

          {/* Field 2: NIK */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Nomor Induk Kependudukan (NIK)
            </label>
            <input
              type="text"
              maxLength={16}
              value={data.nik}
              onChange={(e) => setData("nik", e.target.value)}
              placeholder="16 Digit NIK KTP"
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.nik && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.nik}</p>}
          </div>

          {/* Field 3: Nomor Handphone / WA */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Nomor WhatsApp / Handphone
            </label>
            <input
              type="tel"
              value={data.no_telepon}
              placeholder="Contoh: 081234567890"
              onChange={(e) => setData("no_telepon", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.no_telepon && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.no_telepon}</p>}
          </div>

          {/* Field 4: Tanggal Lahir */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={data.tanggal_lahir}
              onChange={(e) => setData("tanggal_lahir", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.tanggal_lahir && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.tanggal_lahir}</p>}
          </div>

          {/* Field 5: Pekerjaan */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Pekerjaan
            </label>
            <input
              type="text"
              value={data.pekerjaan}
              placeholder="Contoh: Ibu Rumah Tangga / Karyawan"
              onChange={(e) => setData("pekerjaan", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.pekerjaan && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.pekerjaan}</p>}
          </div>

          {/* Field 6: Pendidikan Terakhir */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Pendidikan Terakhir
            </label>
            <input
              type="text"
              value={data.pendidikan}
              placeholder="Contoh: SMA / S-1"
              onChange={(e) => setData("pendidikan", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.pendidikan && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.pendidikan}</p>}
          </div>

          {/* Field 7: HPHT (Khusus Ibu Hamil) */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Hari Pertama Haid Terakhir (HPHT)
            </label>
            <input
              type="date"
              value={data.hpht}
              onChange={(e) => setData("hpht", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.hpht && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.hpht}</p>}
          </div>

          {/* Field 8: Wilayah Puskesmas Domisili */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Puskesmas Domisili / Rujukan
            </label>
            <input
              type="text"
              value={data.puskesmas}
              placeholder="Contoh: Puskesmas Kecamatan Cilandak"
              onChange={(e) => setData("puskesmas", e.target.value)}
              className="w-full rounded-full h-11 px-5 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
            />
            {errors.puskesmas && <p className="text-[11px] text-rose-500 mt-1 pl-3">{errors.puskesmas}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full px-6 h-11 border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors uppercase shrink-0"
            >
              Batal
            </button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={processing}
              className="rounded-full px-7 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide text-center shadow-soft-sm transition-colors shrink-0"
            >
              {processing ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
