import React from "react";
import { router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import {
  Activity,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Video,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Welcome() {
  const handleLoginDemo = () => {
    localStorage.setItem("bundasehat_auth", "true");
    router.visit("/beranda");
  };

  return (
    <BundaSehatLayout activeNav="landing">
      <div className="space-y-16 py-6 md:py-10">

        {/* HERO BANNER INFORMASI KESEHATAN KEHAMILAN */}
        <section id="banner" className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white p-8 sm:p-12 md:p-16 shadow-soft-lg relative overflow-hidden text-center md:text-left">
            
            {/* Background Accent Graphics */}
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-20 top-0 w-48 h-48 bg-rose-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="max-w-3xl space-y-6 relative z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Pendamping Ibu Hamil & Persalinan Sehat Tanpa Komplikasi
              </h1>

              <p className="text-sm md:text-lg text-pink-50 leading-relaxed font-medium">
                Pantau kesehatan janin, kalkulasi usia kehamilan & HPL, serta dapatkan rekomendasi terapi komplementer non-obat yang aman dan tervalidasi.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={handleLoginDemo}
                  className="px-8 py-4 rounded-full bg-white text-rose-600 font-extrabold text-sm md:text-base shadow-soft-md hover:bg-pink-50 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Masuk ke Beranda Pasien</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <a
                  href="#fitur"
                  className="px-8 py-4 rounded-full bg-white/15 text-white border border-white/30 font-bold text-sm md:text-base hover:bg-white/25 transition-all backdrop-blur-sm"
                >
                  Pelajari Fitur
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 text-xs md:text-sm font-semibold text-pink-100 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>Validasi Skor Poedji Rochjati</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>Pencegahan Bias Treatment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: ALASAN MENGGUNAKAN BUNDASEHAT */}
        <section id="alasan" className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Solusi Kebidanan Cerdas Pencegah Komplikasi
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl mx-auto">
              Dirancang khusus untuk mendukung pendampingan ibu hamil dengan standar ilmiah dan pemantauan berlapis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <Card className="p-6 rounded-3xl border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
              <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">Skoring KSPR Adaptif</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Mengintegrasikan Kartu Skor Poedji Rochjati (KSPR) untuk mengelompokkan risiko menjadi Risiko Ringan (KRR), Risiko Sedang (KRT), dan Risiko Berat (KRST).
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="p-6 rounded-3xl border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">Pencegahan Bias Treatment</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Memastikan hasil skoring tidak bias oleh obat-obatan awal yang sudah diminum (seperti obat tensi/anti-hypertension) agar rekomendasi faskes tetap akurat.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="p-6 rounded-3xl border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
              <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mb-2">Terapi Komplementer Non-Obat</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                Memberikan saran intervensi pendamping seperti pijat oxytocin, kompres hangat, dan aromaterapi yang disesuaikan dengan kondisi risiko fisik spesifik ibu.
              </p>
            </Card>

          </div>
        </section>

        {/* SECTION 2: FITUR-FITUR DALAM WEB INI */}
        <section id="fitur" className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-soft-lg space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Segala Yang Bunda Butuhkan Dalam Satu Tempat
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Akses mudah fitur screening dan konsultasi edukasi kebidanan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Screening Kehamilan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Screening bertahap kondisi fisik, HPHT, edema, tensi, dan gejala bahaya trimester.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Screening Persalinan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penentuan tingkat tenaga medis dan tempat persalinan aman (BPM / Puskesmas / RS SC).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Kamus Kesehatan A-Z</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Katalog edukasi lengkap seputar komplikasi kehamilan ala Halodoc dengan pencarian cepat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">Video Terapi Komplementer</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Panduan video interaktif teknik terapi relaksasi, pijat, dan penanganan non-obat.
                </p>
              </div>

            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleLoginDemo}
                className="px-8 py-4 rounded-full bg-rose-500 text-white font-extrabold text-sm md:text-base shadow-soft-md hover:bg-rose-600 transition-all"
              >
                Coba Demo Sekarang
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: PENJELASAN TENTANG WEB INI */}
        <section id="tentang" className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                Dikembangkan Berdasarkan Kepakaran Kebidanan Bu Asih
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                BundaSehat merupakan platform penelitian kebidanan yang menghubungkan tenaga kesehatan (Bidan Wilayah), dosen kebidanan (Bu Asih), dan Ibu Hamil untuk mempercepat deteksi dini faktor risiko tinggi (*Resti*) sebelum persalinan.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dengan pengkategorian risiko yang transparan dan pencegahan bias data medis, BundaSehat membantu menurunkan angka kematian ibu dan bayi secara signifikan.
              </p>
            </div>

            <div className="md:col-span-6">
              <Card className="p-6 rounded-3xl border-pink-100 bg-pink-50/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white p-2 border border-pink-200 flex items-center justify-center shadow-soft-sm">
                    <ApplicationLogo className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Tim Pakar Kebidanan BundaSehat</h4>
                    <p className="text-xs text-rose-600 font-semibold">Pengawasan Ilmiah Bu Asih & Nakes Wilayah</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-pink-200/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>Terhubung langsung dengan rekomendasi Faskes Rujukan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>Rekomendasi non-obat terapi komplementer yang teruji</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>Antarmuka ramah pengguna (Mobile-First Design)</span>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </section>

      </div>
    </BundaSehatLayout>
  );
}
