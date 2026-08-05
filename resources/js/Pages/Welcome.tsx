import React from "react";
import { router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import {
  Activity,
  Heart,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Video,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Leaf,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Welcome() {
  const handleLoginDemo = () => {
    localStorage.setItem("bundasehat_auth", "true");
    router.visit("/beranda");
  };

  return (
    <BundaSehatLayout activeNav="landing">
      <div className="w-full">

        {/* HERO BANNER INFORMASI KESEHATAN KEHAMILAN (FULL VIEWPORT HEIGHT WITH SEAMLESS NAVBAR) */}
        <section id="banner" className="w-full min-h-screen -mt-16 pt-20 lg:pt-24 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white flex items-center relative overflow-hidden shadow-soft-md">
          
          {/* Background Design Attributes & Ornaments (Waves, Concentric Circles, Plus Signs, Sparkles) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Glowing Ambient Ornaments */}
            <div className="absolute -right-10 -bottom-10 w-[650px] h-[650px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-20 top-0 w-96 h-96 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Concentric Circles Rings */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-white/5 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-pink-300/10 rounded-full border border-white/15 pointer-events-none" />

            {/* Organic Waves SVG (Gelombang) */}
            <svg
              className="absolute -bottom-10 right-0 w-full max-w-4xl h-72 text-white/5 pointer-events-none"
              viewBox="0 0 1200 400"
              fill="currentColor"
            >
              <path d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,245.3C672,256,768,256,864,240C960,224,1056,192,1104,176L1152,160L1152,400L1104,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"></path>
            </svg>

            {/* Floating Plus Signs (+ Ornaments) */}
            <div className="absolute top-1/4 right-[42%] text-white/25 text-3xl font-extralight select-none animate-pulse">
              +
            </div>
            <div className="absolute bottom-1/3 left-[46%] text-white/20 text-4xl font-extralight select-none">
              +
            </div>
            <div className="absolute top-1/3 left-10 text-white/15 text-2xl font-extralight select-none">
              +
            </div>
            <div className="absolute bottom-12 right-24 text-white/25 text-3xl font-extralight select-none">
              +
            </div>

            {/* Sparkles / Shining Stars */}
            <div className="absolute top-20 right-[35%] text-pink-200/50 text-xl animate-pulse">
              ✦
            </div>
            <div className="absolute bottom-28 left-[28%] text-white/30 text-lg">
              ✦
            </div>
          </div>

          {/* Inner Centered Container with Max-W-[1400px] */}
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 my-auto py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              
              {/* Column 1: Hero Text Content (Order 2 on Mobile, Order 1 on Desktop) */}
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-6 text-center lg:text-left">
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Pendamping Ibu Hamil & Persalinan Sehat Tanpa Komplikasi
                </h1>

                <p className="text-sm md:text-lg text-pink-50 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                  Pantau kesehatan janin, kalkulasi usia kehamilan & HPL, serta dapatkan rekomendasi terapi komplementer non-obat yang aman dan tervalidasi.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={handleLoginDemo}
                    className="px-8 py-4 rounded-full bg-white text-rose-600 font-extrabold text-sm md:text-base shadow-soft-md hover:bg-pink-50 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Masuk ke Beranda Pasien</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

              </div>

              {/* Column 2: Large Woman Illustration + Scaled-Up Floating Cards (Right Side Layout Shifted Right) */}
              <div className="lg:col-span-6 order-1 lg:order-2 w-full flex justify-center lg:justify-end lg:translate-x-6">
                <div className="relative w-full max-w-lg sm:max-w-xl h-[420px] sm:h-[520px] md:h-[580px] flex items-center justify-center">
                  
                  {/* Layer 1: Ambient Background Glowing Soft Circle */}
                  <div className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-white/25 to-pink-300/35 rounded-full blur-3xl pointer-events-none" />

                  {/* Layer 2: Scaled-Up Woman Graphic (Flipped Horizontal with scale-x-[-1]) */}
                  <img
                    src="/pregnant-woman.svg"
                    alt="Ilustrasi Ibu Hamil BundaSehat"
                    className="relative z-10 h-full max-h-[440px] sm:max-h-[540px] md:max-h-[600px] w-auto object-contain drop-shadow-2xl scale-x-[-1]"
                  />

                  {/* Layer 3: Interactive Floating Cards OVER the Image (Icon Only -> Full Rounded Capsule Expand on Hover) */}

                  {/* Floating Card 1: Top Left */}
                  <div className="absolute top-6 left-0 sm:left-4 z-20 group cursor-pointer">
                    <div className="flex items-center gap-0 group-hover:gap-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-soft-lg border border-white/60 transition-all duration-300 group-hover:px-5 group-hover:py-2.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 shadow-soft-xs">
                        <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-rose-600" />
                      </div>
                      <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-left">
                        <h4 className="text-xs sm:text-sm font-extrabold text-rose-950">Deteksi Risiko Dini</h4>
                        <p className="text-[11px] font-bold text-rose-600/80">Skor KSPR Valid</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2: Middle Right */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-4 z-20 group cursor-pointer">
                    <div className="flex items-center gap-0 group-hover:gap-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-soft-lg border border-white/60 transition-all duration-300 group-hover:px-5 group-hover:py-2.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 shadow-soft-xs">
                        <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-rose-600" />
                      </div>
                      <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-left">
                        <h4 className="text-xs sm:text-sm font-extrabold text-rose-950">Prediksi HPL Akurat</h4>
                        <p className="text-[11px] font-bold text-rose-600/80">Perhitungan Otomatis</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 3: Bottom Left */}
                  <div className="absolute bottom-6 left-0 sm:left-4 z-20 group cursor-pointer">
                    <div className="flex items-center gap-0 group-hover:gap-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-soft-lg border border-white/60 transition-all duration-300 group-hover:px-5 group-hover:py-2.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 shadow-soft-xs">
                        <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
                      </div>
                      <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-left">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Terapi Komplementer</h4>
                        <p className="text-[11px] font-bold text-slate-600">Aman & Tervalidasi</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 1: ALASAN MENGGUNAKAN BUNDASEHAT (FULL WIDTH / EDGE-TO-EDGE) */}
        <section id="alasan" className="w-full bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                Solusi Kebidanan Cerdas Pencegah Komplikasi
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-xl mx-auto">
                Dirancang khusus untuk mendukung pendampingan ibu hamil dengan standar ilmiah dan pemantauan berlapis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Card 1 */}
              <Card className="p-6 sm:p-8 rounded-3xl border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
                <div className="h-12 w-12 rounded-full bg-pink-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">Skoring KSPR Adaptif</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Mengintegrasikan Kartu Skor Poedji Rochjati (KSPR) untuk mengelompokkan risiko menjadi Risiko Ringan (KRR), Risiko Sedang (KRT), dan Risiko Berat (KRST).
                </p>
              </Card>

              {/* Card 2 */}
              <Card className="p-6 sm:p-8 rounded-3xl border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">Pencegahan Bias Treatment</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Memastikan hasil skoring tidak bias oleh obat-obatan awal yang sudah diminum (seperti obat tensi/anti-hypertension) agar rekomendasi faskes tetap akurat.
                </p>
              </Card>

              {/* Card 3 */}
              <Card className="p-6 sm:p-8 rounded-3xl border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all bg-white">
                <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">Terapi Komplementer Non-Obat</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Memberikan saran intervensi pendamping seperti pijat oxytocin, kompres hangat, dan aromaterapi yang disesuaikan dengan kondisi risiko fisik spesifik ibu.
                </p>
              </Card>

            </div>
          </div>
        </section>

        {/* SECTION 2: FITUR-FITUR DALAM WEB INI (FULL WIDTH / EDGE-TO-EDGE) */}
        <section id="fitur" className="w-full bg-slate-900 text-white py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Segala Yang Bunda Butuhkan Dalam Satu Tempat
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Akses mudah fitur screening dan konsultasi edukasi kebidanan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Screening Kehamilan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Screening bertahap kondisi fisik, HPHT, edema, tensi, dan gejala bahaya trimester.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Screening Persalinan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penentuan tingkat tenaga medis dan tempat persalinan aman (BPM / Puskesmas / RS SC).
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-white text-base">Kamus Kesehatan A-Z</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Katalog edukasi lengkap seputar komplikasi kehamilan ala Halodoc dengan pencarian cepat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Video className="h-6 w-6" />
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

        {/* SECTION 3: PENJELASAN TENTANG WEB INI (FULL WIDTH / EDGE-TO-EDGE) */}
        <section id="tentang" className="w-full bg-white py-16 sm:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              
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
                <Card className="p-6 sm:p-8 rounded-3xl border-pink-100 bg-pink-50/50 space-y-4">
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
                      <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>Terhubung langsung dengan rekomendasi Faskes Rujukan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>Rekomendasi non-obat terapi komplementer yang teruji</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>Antarmuka ramah pengguna (Mobile-First Design)</span>
                    </div>
                  </div>
                </Card>
              </div>

            </div>
          </div>
        </section>

      </div>
    </BundaSehatLayout>
  );
}
