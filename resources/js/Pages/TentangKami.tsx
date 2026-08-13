import React from "react";
import { router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card } from "@/Components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/Components/ui/accordion";
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
  CheckCircle2,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function TentangKami() {
  const handleLoginDemo = () => {
    localStorage.setItem("bundasehat_auth", "true");
    router.visit("/");
  };

  return (
    <BundaSehatLayout activeNav="tentang-kami">
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

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight space-y-2 sm:space-y-3">
                  <span className="block">Pendamping</span>
                  <span className="block">Kehamilan &</span>
                  <span className="block">Persalinan Sehat</span>
                </h1>

                <p className="text-sm md:text-lg text-pink-50 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                  Skrining risiko kehamilan, hitung HPL otomatis, dan panduan terapi komplementer terpercaya.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={handleLoginDemo}
                    className="px-8 py-4 rounded-full bg-white text-rose-600 font-bold text-sm md:text-base shadow-soft-md hover:bg-pink-50 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Masuk</span>
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
                    alt="Ilustrasi Ibu Hamil"
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
                        <h4 className="text-xs sm:text-sm font-bold text-rose-950">Deteksi Risiko Dini</h4>
                        <p className="text-[11px] font-bold text-rose-600/80">Kalkulasi MAP & KSPR</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2: Top Right */}
                  <div className="absolute top-12 right-0 sm:right-4 z-20 group cursor-pointer">
                    <div className="flex items-center gap-0 group-hover:gap-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-soft-lg border border-white/60 transition-all duration-300 group-hover:px-5 group-hover:py-2.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 shadow-soft-xs">
                        <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-rose-600" />
                      </div>
                      <div className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap text-left">
                        <h4 className="text-xs sm:text-sm font-bold text-rose-950">Prediksi HPL Akurat</h4>
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
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">Terapi Komplementer</h4>
                        <p className="text-[11px] font-bold text-slate-600">Aman & Tervalidasi</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION FITUR (LAYANAN & FITUR UNGGULAN RADIX ACCORDION) */}
        <section id="fitur" className="w-full bg-white text-slate-900 pt-12 sm:pt-16 pb-6 sm:pb-8">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Layanan & Fitur Unggulan
              </h2>
            </div>

            {/* Accordion Fitur Kebidanan Clean Style */}
            <div className="w-full">
              <Accordion type="single" collapsible defaultValue="item-1">

                {/* Accordion Item 1 */}
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                      Screening Kehamilan
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-13 text-slate-600 space-y-2">
                    <p>
                      Screening bertahap kondisi fisik, HPHT, edema, tensi darah (MAP), dan gejala bahaya trimester untuk mengkategorikan tingkat risiko kehamilan secara akurat.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-rose-600">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Kartu Skor Risiko Komplikasi</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Kalkulasi Otomatis HPL</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Accordion Item 2 */}
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                      Screening Persalinan
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-13 text-slate-600 space-y-2">
                    <p>
                      Penentuan tingkat rujukan tenaga medis dan tempat persalinan aman (Bidan Praktik Mandiri / Puskesmas / Rumah Sakit SC) untuk mencegah keterlambatan penanganan rujukan emergency.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-rose-600">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Rekomendasi Penolong Bersalin</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Deteksi Dini Komplikasi Salin</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Accordion Item 3 */}
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                      Kamus Kesehatan
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-13 text-slate-600 space-y-2">
                    <p>
                      Katalog edukasi medis lengkap seputar komplikasi kehamilan ala Halodoc dengan sistem pencarian cepat kata kunci penyakit, gejala fisik, dan penanganan awal.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-emerald-600">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Istilah Medis Mudah Dipahami</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Filter Pencarian Instan</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Accordion Item 4 */}
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-900">
                      Video Terapi Komplementer
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-13 text-slate-600 space-y-2">
                    <p>
                      Panduan video interaktif teknik terapi relaksasi, pijat oxytocin, kompres hangat, dan penanganan non-obat yang tervalidasi oleh pakar kebidanan (Bu Asih & Nakes Wilayah).
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-amber-600">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Tutorial Video HD Interaktif</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Terbukti Aman & Bebas Efek Samping</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </section>

        {/* SECTION 3: TENTANG KAMI (ALTERNATING 2-ROW LAYOUT LIKE REFERENCE) */}
        <section id="tentang" className="w-full bg-white pt-6 sm:pt-8 pb-16 sm:pb-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">

            {/* Section Title */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Tentang Kami
              </h2>
            </div>

            {/* Row 1: Left Image Box, Right Text Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Image Box */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full h-64 sm:h-80 rounded-3xl bg-slate-100/80 p-8 flex flex-col items-center justify-center border border-slate-200 shadow-soft-sm">
                  <ApplicationLogo className="h-20 sm:h-24 w-20 sm:w-24 mb-3" />
                  <span className="font-bold text-xl text-slate-800 tracking-wide">
                    Logo
                  </span>
                </div>
              </div>

              {/* Right Text Content */}
              <div className="md:col-span-7 space-y-4 text-slate-700">
                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Aplikasi berbasis website ini dikembangkan khusus untuk mendukung pendampingan ibu hamil dalam melakukan deteksi dini faktor risiko tinggi (<em className="text-rose-600 font-semibold">Resti</em>) dan kesiapan persalinan sehat tanpa komplikasi.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Platform ini dirancang dengan mengintegrasikan standar medis nasional Kartu Skor Poedji Rochjati (KSPR), pemantauan usia kehamilan & taksiran persalinan (HPL), serta rekomendasi penolong dan tempat persalinan yang aman.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Kami berkomitmen menjadikan platform pilihan utama ibu hamil dan bidan wilayah dalam mempercepat rujukan medis serta menekan angka komplikasi kehamilan secara digital dan transparan.
                </p>
              </div>

            </div>

            {/* Row 2: Left Text Content, Right Image Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Text Content */}
              <div className="md:col-span-7 space-y-4 text-slate-700 order-2 md:order-1">
                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  <strong className="font-bold text-slate-900">Kepakaran Kebidanan Bu Asih & Nakes Wilayah</strong> menjadi fondasi utama dalam penyusunan rekomendasi medis, edukasi kamus kesehatan A-Z, dan panduan terapi komplementer non-obat yang dihadirkan di dalam platform.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Visi kami adalah berkontribusi aktif dalam percepatan transformasi digital di bidang kesehatan ibu dan anak, dengan menghadirkan solusi teknologi yang menjawab permasalahan krusial kebidanan secara tepat dan berbasis bukti medis.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Moto kami yakni <em className="font-bold text-rose-600">Inovasi Medis & Kemanusiaan</em>. Kami meyakini bahwa inovasi digital hanya akan memberikan nilai dampak nyata jika mengedepankan keselamatan dan kenyamanan ibu hamil serta janinnya.
                </p>
              </div>

              {/* Right Image Box */}
              <div className="md:col-span-5 flex justify-center order-1 md:order-2">
                <div className="w-full h-64 sm:h-80 rounded-3xl bg-slate-100/80 p-8 flex flex-col items-center justify-center border border-slate-200 shadow-soft-sm">
                  <ApplicationLogo className="h-20 sm:h-24 w-20 sm:w-24 mb-3" />
                  <span className="font-bold text-xl text-slate-800 tracking-wide">
                    Logo
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

      </div>
    </BundaSehatLayout>
  );
}
