import React from "react";
import { Link } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { ArrowRight } from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function TentangKami() {
  return (
    <BundaSehatLayout activeNav="tentang-kami">
      <div className="w-full">

        {/* HERO HEADER SEDERHANA (TINGGI ~200-300px) */}
        <section className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white pt-20 pb-12 sm:pt-24 sm:pb-14 relative overflow-hidden shadow-soft-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Tentang Kami
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed">
              Mengenal tujuan, latar belakang, dan peran BundaSehat dalam mendukung kesehatan ibu dan janin.
            </p>
          </div>
        </section>

        {/* SECTION TENTANG KAMI */}
        <section id="tentang" className="w-full bg-white pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">

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
                  Aplikasi berbasis website ini dikembangkan khusus untuk mendukung pendampingan ibu hamil dalam melakukan deteksi dini faktor risiko tinggi (<em className="text-coral-600 font-semibold">Resti</em>) dan kesiapan persalinan sehat tanpa komplikasi.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Platform ini dirancang dengan mengintegrasikan standar medis nasional Kartu Skor Poedji Rochjati (KSPR), pemantauan usia kehamilan &amp; taksiran persalinan (HPL), serta rekomendasi penolong dan tempat persalinan yang aman.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Kami berkomitmen menjadikan platform pilihan utama ibu hamil dan bidan wilayah dalam mempercepat rujukan medis serta menekan angka komplikasi kehamilan secara digital dan transparan.
                </p>
              </div>

            </div>

            {/* Row 2: Mengapa BundaSehat Dibuat? */}
            <div className="pt-8 border-t border-slate-100 space-y-6 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Mengapa BundaSehat Dibuat?
              </h2>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-medium text-left">
                <p>
                  Kehamilan membutuhkan pemantauan yang berkelanjutan dan penuh kehati-hatian. Setiap tahapan dan perubahan kondisi fisik ibu maupun perkembangan janin memerlukan perhatian dini untuk memastikan proses persalinan dapat berjalan lancar dan aman.
                </p>

                <p>
                  Namun pada kenyataannya, tidak semua ibu memiliki akses informasi kesehatan kebidanan yang mudah dipahami, akurat, dan bebas dari kebingungan mitos yang beredar luas di masyarakat.
                </p>

                <p>
                  BundaSehat dikembangkan sebagai pendamping digital yang menjembatani ibu hamil dengan standar klinis kebidanan terpercaya. Kami hadir untuk membantu mengenali tanda bahaya sedini mungkin, memberikan edukasi perawatan mandiri yang aman, dan mendukung pengambilan keputusan rujukan persalinan yang tepat waktu.
                </p>
              </div>
            </div>

            {/* Row 3: Landasan & Keahlian */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-slate-100">

              {/* Left Text Content */}
              <div className="md:col-span-7 space-y-4 text-slate-700 order-2 md:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Landasan &amp; Keahlian
                </h2>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  <strong className="font-bold text-slate-900">Kepakaran Kebidanan Bu Asih &amp; Nakes Wilayah</strong> menjadi fondasi utama dalam penyusunan rekomendasi medis, edukasi kamus kesehatan A-Z, dan panduan terapi komplementer non-obat yang dihadirkan di dalam platform.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Visi kami adalah berkontribusi aktif dalam percepatan transformasi digital di bidang kesehatan ibu dan anak, dengan menghadirkan solusi teknologi yang menjawab permasalahan krusial kebidanan secara tepat dan berbasis bukti medis.
                </p>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  Moto kami yakni <em className="font-bold text-emerald-700">Inovasi Medis &amp; Kemanusiaan</em>. Kami meyakini bahwa inovasi digital hanya akan memberikan nilai dampak nyata jika mengedepankan keselamatan dan kenyamanan ibu hamil serta janinnya.
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

            {/* Row 4: CTA Terakhir */}
            <div className="pt-6 border-t border-slate-100 text-center space-y-4 max-w-xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Mulai Kenali Risiko Kehamilan Anda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Lakukan deteksi dini kondisi kesehatan dan kesiapan persalinan Anda secara mandiri dan akurat.
              </p>
              <div className="pt-2">
                <Link href="/screening/kehamilan">
                  <Button
                    size="lg"
                    className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm gap-2 shadow-soft-sm"
                  >
                    <span>Tes Screening Kehamilan</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>

      </div>
    </BundaSehatLayout>
  );
}
