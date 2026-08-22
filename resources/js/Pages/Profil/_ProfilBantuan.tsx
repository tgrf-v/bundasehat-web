import React from "react";
import { Card } from "@/Components/ui/card";
import { ArrowLeft, Headphones } from "lucide-react";

interface ProfilBantuanProps {
  onBack: () => void;
}

export function ProfilBantuan({ onBack }: ProfilBantuanProps) {
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
          Bantuan &amp; Dukungan
        </h2>
      </div>

      <Card className="rounded-3xl border-slate-100 bg-white p-6 sm:p-8 shadow-soft-sm space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Memiliki kendala teknis atau pertanyaan seputar pemantauan kehamilan Anda? Tim medis dan support kami siap membantu.
        </p>

        <div className="p-5 rounded-3xl bg-emerald-50 text-emerald-900 border border-emerald-100 space-y-3">
          <div className="font-bold flex items-center gap-2 text-emerald-700 text-sm">
            <Headphones className="h-5 w-5" />
            <span>Hotline Bidan &amp; Consultation Center</span>
          </div>
          <div className="text-xs space-y-1 text-emerald-800">
            <p><strong>WhatsApp Support:</strong> +62 812-3456-7890</p>
            <p><strong>Jam Operasional:</strong> Senin - Minggu (24 Jam Emergency)</p>
            <p><strong>Email Resmi:</strong> help@aplikasi.id</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
