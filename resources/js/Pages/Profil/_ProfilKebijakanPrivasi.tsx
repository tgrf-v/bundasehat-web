import React from "react";
import { Card } from "@/Components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ProfilKebijakanPrivasiProps {
  onBack: () => void;
}

export function ProfilKebijakanPrivasi({ onBack }: ProfilKebijakanPrivasiProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between relative py-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
          Kebijakan Privasi
        </h2>
      </div>

      <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-base">1. Pengumpulan Informasi Pribadi</h3>
        <p>
          Aplikasi ini mengumpulkan data penting seperti Nama, NIK, tanggal HPHT, dan faskes rujukan domisili semata-mata untuk mengintegrasikan layanan rujukan kesehatan ibu dan anak.
        </p>

        <h3 className="font-bold text-slate-900 text-base pt-2">2. Keamanan Data Pasien</h3>
        <p>
          Kami tidak pernah menjual atau membagikan data rekam kesehatan pasien kepada pihak ketiga di luar jaringan Puskesmas dan Rumah Sakit Rujukan resmi terdaftar.
        </p>
      </Card>
    </div>
  );
}
