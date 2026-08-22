import React from "react";
import { Card } from "@/Components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ProfilSyaratKetentuanProps {
  onBack: () => void;
}

export function ProfilSyaratKetentuan({ onBack }: ProfilSyaratKetentuanProps) {
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
          Syarat dan Ketentuan
        </h2>
      </div>

      <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-base">1. Ketentuan Penggunaan Aplikasi</h3>
        <p>
          Aplikasi ini dikembangkan sebagai platform bantuan awal skrining mandiri kehamilan dan persalinan berbasis metode Poedji Rochjati. Seluruh kalkulasi skor bertujuan sebagai panduan deteksi dini risiko kebidanan dan bukan merupakan vonis medis final.
        </p>

        <h3 className="font-bold text-slate-900 text-base pt-2">2. Tanggung Jawab Pengguna</h3>
        <p>
          Pengguna berkewajiban memasukkan informasi riwayat kesehatan, HPHT, dan indikator klinis secara jujur dan akurat untuk menjamin ketepatan rekomendasi rujukan faskes.
        </p>

        <h3 className="font-bold text-slate-900 text-base pt-2">3. Kerahasiaan Rekam Medis</h3>
        <p>
          Seluruh rekaman data pribadi dan skrining dilindungi dengan sistem enkripsi dan hanya digunakan untuk keperluan pelayanan medis resmi.
        </p>
      </Card>
    </div>
  );
}
