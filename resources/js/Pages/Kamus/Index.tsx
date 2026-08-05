import React, { useState } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Dialog } from "@/Components/ui/dialog";
import { Tabs } from "@/Components/ui/tabs";
import { KamusItem } from "@/types/screening";
import {
  BookOpen,
  Search,
  Sparkles,
  Heart,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";

export default function KamusIndex() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<KamusItem | null>(null);

  const kamusList: KamusItem[] = [
    {
      id: 1,
      judul: "Terapi Perendaman Kaki Air Hangat & Garam Epsom",
      slug: "terapi-perendaman-kaki-air-hangat-garam-epsom",
      kategori: "terapi_komplementer",
      ringkasan: "Terapi non-obat terbukti efektif mengurangi pembengkakan (edema) kaki pada ibu hamil trimester 2 dan 3.",
      konten:
        "Perendaman kaki menggunakan air hangat berdesinfektan alami atau garam epsom selama 15-20 menit membantu melancarkan sirkulasi pembuluh darah perifer dan menurunkan retensi cairan ekstremitas bawah.",
      tingkat_risiko_target: "Sedang",
      panduan_langkah: [
        "Siapkan wadah baskom berisi air hangat suam-suam kuku (37-40 derajat Celsius).",
        "Tambahkan 2 sendok makan garam epsom atau garam murni, aduk hingga larut.",
        "Rendam kedua kaki hingga di atas pergelangan kaki selama 15-20 menit.",
        "Keringkan kaki dengan handuk bersih dan posisikan kaki lebih tinggi dari jantung saat berbaring.",
      ],
      sumber_referensi: "Jurnal Kebidanan & Terapi Komplementer (Bu Asih et al.)",
      is_active: true,
    },
    {
      id: 2,
      judul: "Teknik Relaksasi Napas Dalam & Aromaterapi Lavender",
      slug: "teknik-relaksasi-napas-dalam-aromaterapi-lavender",
      kategori: "terapi_komplementer",
      ringkasan: "Panduan penenang kecemasan dan penstabil tekanan darah ringan secara alami untuk ibu hamil.",
      konten:
        "Inhalasi aromaterapi lavender yang dikombinasikan dengan latihan pernapasan diafragma membantu menurunkan regulasi sistem saraf simpatis dan meredakan ketegangan vaskular.",
      tingkat_risiko_target: "Ringan",
      panduan_langkah: [
        "Duduk dalam posisi rileks atau berbaring miring ke kiri.",
        "Teteskan 2-3 tetes minyak esensial lavender pada diffuser atau sapu tangan.",
        "Tarik napas perlahan melalui hidung selama 4 hitungan, tahan 2 hitungan, lalu hembuskan lewat mulut selama 6 hitungan.",
        "Ulangi selama 10-15 menit pada pagi dan malam hari.",
      ],
      sumber_referensi: "Panduan Praktik Klinis Kebidanan Terintegrasi",
      is_active: true,
    },
    {
      id: 3,
      judul: "Mengenal Preeklamsia & Tanda Bahaya Kehamilan Trimester 3",
      slug: "mengenal-preeklamsia-tanda-bahaya-kehamilan",
      kategori: "edukasi",
      ringkasan: "Edukasi komprehensif mengenai bahaya hipertensi gestasional, bengkak wajah, dan pusing berlebih.",
      konten:
        "Preeklamsia adalah kondisi komplikasi kehamilan yang ditandai dengan tekanan darah tinggi (>= 140/90 mmHg) disertai pembengkakan dan atau proteinuria. Penanganan cepat sangat krusial untuk keselamatan ibu dan bayi.",
      tingkat_risiko_target: "Berat",
      panduan_langkah: [
        "Rutin periksakan tekanan darah ke faskes/bidan minimal 1 bulan sekali.",
        "Segera ke IGD atau Rumah Sakit jika timbul pusing berat tak kunjung hilang atau pandangan kabur.",
        "Waspadai nyeri ulu hati hebat yang menetap.",
      ],
      sumber_referensi: "Kemenkes RI & Ikatan Bidan Indonesia (IBI)",
      is_active: true,
    },
    {
      id: 4,
      judul: "Pertolongan Pertama Nyeri Ulu Hati & Sesak Napas Kehamilan",
      slug: "pertolongan-pertama-nyeri-ulu-hati-sesak-napas",
      kategori: "pertolongan_pertama",
      ringkasan: "Langkah darurat awal sebelum ibu hamil dirujuk ke faskes atau rumah sakit.",
      konten:
        "Nyeri epigastrium atau ulu hati pada usia kehamilan tua merupakan salah satu tanda bahaya eklamsia. Posisikan ibu hamil secara tepat dan segera hubungi tenaga kesehatan.",
      tingkat_risiko_target: "Berat",
      panduan_langkah: [
        "Baringkan ibu miring ke kiri untuk memaksimalkan aliran darah ke janin.",
        "Longgarkan pakaian di bagian dada dan perut.",
        "Jangan berikan makanan/minuman keras secara paksa jika terjadi mual muntah hebat.",
        "Hubungi Bidan Desa atau bawa segera ke Rumah Sakit terdekat.",
      ],
      sumber_referensi: "SOP Kebidanan Darurat Faskes Lanjutan",
      is_active: true,
    },
  ];

  const filteredItems = kamusList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeTab === "semua" || item.kategori === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <BundaSehatLayout activeNav="kamus">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Page Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <Badge variant="outline" className="mb-1.5 gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>Edukasi & Konseling Kebidanan</span>
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Kamus Kesehatan & Terapi Komplementer
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Panduan pengetahuan seputar komplikasi kehamilan & tata cara pereda gejala non-obat
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari terapi / edukasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs Filter */}
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          items={[
            { id: "semua", label: "Semua Panduan", count: kamusList.length },
            { id: "terapi_komplementer", label: "Terapi Komplementer", count: 2 },
            { id: "edukasi", label: "Edukasi Kebidanan", count: 1 },
            { id: "pertolongan_pertama", label: "Pertolongan Pertama", count: 1 },
          ]}
        />

        {/* Articles & Therapy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200/80 hover:border-emerald-300 transition-all duration-300 shadow-soft-sm hover:shadow-soft-md cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedArticle(item)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={item.kategori === "terapi_komplementer" ? "default" : "outline"} className="text-[10px]">
                    {item.kategori === "terapi_komplementer"
                      ? "Terapi Komplementer"
                      : item.kategori === "edukasi"
                      ? "Edukasi Kebidanan"
                      : "Pertolongan Pertama"}
                  </Badge>

                  <Badge
                    variant={
                      item.tingkat_risiko_target === "Berat"
                        ? "berat"
                        : item.tingkat_risiko_target === "Sedang"
                        ? "sedang"
                        : "ringan"
                    }
                    className="text-[10px]"
                  >
                    Risiko {item.tingkat_risiko_target}
                  </Badge>
                </div>

                <CardTitle className="text-base font-bold text-slate-900 leading-snug hover:text-emerald-700 transition-colors">
                  {item.judul}
                </CardTitle>
              </CardHeader>

              <CardContent className="py-2 text-xs text-slate-600 leading-relaxed">
                {item.ringkasan}
              </CardContent>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Buka Panduan Langkah</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>

        {/* Article Detail Modal / Dialog */}
        {selectedArticle && (
          <Dialog
            isOpen={!!selectedArticle}
            onClose={() => setSelectedArticle(null)}
            title={selectedArticle.judul}
            description={`Kategori: ${selectedArticle.kategori.replace("_", " ")} | Sumber: ${selectedArticle.sumber_referensi}`}
          >
            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-medium">
                {selectedArticle.konten}
              </div>

              {selectedArticle.panduan_langkah && selectedArticle.panduan_langkah.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Panduan Langkah Praktis:</span>
                  </h4>
                  <ol className="space-y-2 text-xs text-slate-700">
                    {selectedArticle.panduan_langkah.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button variant="default" size="sm" onClick={() => setSelectedArticle(null)}>
                  Tutup Panduan
                </Button>
              </div>
            </div>
          </Dialog>
        )}

      </div>
    </BundaSehatLayout>
  );
}
