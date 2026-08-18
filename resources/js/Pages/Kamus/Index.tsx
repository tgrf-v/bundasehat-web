import React, { useState } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Tabs } from "@/Components/ui/tabs";
import { Dialog } from "@/Components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/Components/ui/drawer";
import {
  BookOpen,
  Video,
  Heart,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  FileText,
  AlertTriangle,
  Stethoscope,
  X,
} from "lucide-react";

interface ArticleItem {
  id: string;
  letter: string;
  title: string;
  category: string;
  content?: string;
  summary: string;
  firstAid: string;
}

interface VideoItem {
  id: string;
  title: string;
  badge: string;
  category: string;
  instructor: string;
  youtubeId: string;
  duration: string;
  description: string;
}

const ARTICLES: ArticleItem[] = [
  {
    id: "anemia",
    letter: "A",
    title: "Anemia pada Ibu Hamil (Kekurangan Sel Darah Merah)",
    category: "Komplikasi Umum",
    summary: "Kondisi di mana kadar hemoglobin (Hb) ibu hamil < 11 g/dL pada trimester 1 & 3, atau < 10.5 g/dL pada trimester 2.",
    firstAid: "Konsumsi suplemen Tablet Tambah Darah (TTD) bersama vitamin C (jus jeruk), hindari teh/kopi saat minum obat, dan perbanyak bayam & hati ayam.",
  },
  {
    id: "abortus-imminens",
    letter: "A",
    title: "Abortus Imminens (Ancaman Keguguran Usia Dini)",
    category: "Gawat Darurat T1",
    summary: "Bercak darah atau perdarahan pervaginam pada usia kehamilan kurang dari 20 minggu dengan ostium uteri masih tertutup.",
    firstAid: "Tirah baring (bed rest) total, batasi aktivitas fisik berat, hindari hubungan suami istri sementara, dan segera konsultasi SpOG.",
  },
  {
    id: "air-ketuban-merembes",
    letter: "A",
    title: "Air Ketuban Merembes / Ketuban Pecah Dini (KPD)",
    category: "Persalinan & Ketuban",
    summary: "Keluarnya cairan ketuban berbau khas amis dari jalan lahir sebelum tanda-tanda persalinan atau pembukaan rahim dimulai.",
    firstAid: "Gunakan pembalut bersih, catat warna & bau cairan, DILARANG mencuci vagina dengan sabun pembersih, dan langsung berangkat ke Puskesmas/RS.",
  },
  {
    id: "diabetes-gestasional",
    letter: "D",
    title: "Diabetes Melitus Gestasional (DMG / Gula Darah Tinggi)",
    category: "Metabolik",
    summary: "Gangguan toleransi glukosa yang pertama kali terdeteksi saat kehamilan (GDS ≥ 200 mg/dL atau GDP ≥ 126 mg/dL).",
    firstAid: "Kelola pola makan dengan konsultasi gizi, hindari minuman manis berkarbohidrat tinggi, lakukan jalan pagi ringan, dan cek gula rutin.",
  },
  {
    id: "distosia-bahu",
    letter: "D",
    title: "Distosia Bahu (Kemacetan Bahu Janin Saat Persalinan)",
    category: "Komplikasi Persalinan",
    summary: "Kondisi darurat di mana kepala janin sudah lahir tetapi bahu tersangkut di belakang simfisis pubis ibu.",
    firstAid: "Posisi penanganan medis khusus (fleksi panggul maksimal / manuver McRoberts). Penanganan wajib oleh Dokter Spesialis Kebidanan.",
  },
  {
    id: "eklamsia",
    letter: "E",
    title: "Eklamsia & Kejang Kebidanan Darurat",
    category: "Risiko Sangat Tinggi",
    summary: "Komplikasi berat dari preeklamsia ditandai timbulnya kejang-kejang disertai penurunan kesadaran pada ibu hamil.",
    firstAid: "Posisikan miring kiri, amankan dari cedera benturan, jangan masukkan benda ke mulut, dan segera panggil ambulans IGD RS rujukan.",
  },
  {
    id: "edema-tungkai",
    letter: "E",
    title: "Edema Tungkai & Wajah (Pembengkakan Ekstremitas)",
    category: "Vaskular",
    summary: "Penumpukan cairan di jaringan tubuh yang menyebabkan kaki, tangan, atau wajah membengkak terutama saat berdiri lama.",
    firstAid: "Tinggikan posisi kaki saat berbaring menggunakan bantal, ganti posisi duduk berkala, kurangi konsumsi makanan tinggi natrium.",
  },
  {
    id: "hyperemesis-gravidarum",
    letter: "H",
    title: "Hyperemesis Gravidarum (Mual Muntah Berlebihan)",
    category: "Gastrointestinal",
    summary: "Mual dan muntah parah pada awal kehamilan yang menyebabkan dehidrasi, penurunan berat badan > 5%, dan ketonuria.",
    firstAid: "Makan porsi kecil tapi sering (biskuit/roti bakar kering), minum air hangat hangat kuku atau air jahe, hindari bau menyengat.",
  },
  {
    id: "hipertensi",
    letter: "H",
    title: "Hipertensi Gestasional (Tekanan Darah Tinggi Kehamilan)",
    category: "Vaskular",
    summary: "Tekanan darah sistolik ≥ 140 mmHg atau diastolik ≥ 90 mmHg yang pertama kali muncul setelah usia kehamilan 20 minggu.",
    firstAid: "Tirah baring (rest) posisi miring ke kiri, batasi asupan garam tinggi, kelola stres dengan relaksasi napas, dan rutin cek tensi mingguan.",
  },
  {
    id: "kehamilan-ektopik",
    letter: "K",
    title: "Kehamilan Ektopik Terganggu (KET / Luar Rahim)",
    category: "Darurat Kebidanan",
    summary: "Nyeri perut bawah hebat hebat yang timbul akibat pembuahan menempel di luar rahim (biasanya tuba falopi) dan pecah.",
    firstAid: "Kondisi darurat operasi segera. Langsung rujuk ke RS fasilitas bedah tanpa ditunda.",
  },
  {
    id: "map-tinggi",
    letter: "M",
    title: "Mean Arterial Pressure (MAP) ≥ 90 mmHg",
    category: "Skrining Kardiovaskular",
    summary: "Nilai rata-rata tekanan arteri rerata ≥ 90 mmHg sebagai indikator dini skrining risiko pre-hipertensi gestasional.",
    firstAid: "Lakukan pemantauan tensi berkala 2 kali sehari, kurangi stres fisik & pikiran, serta lakukan kontrol ketat ke Bidan / Dokter.",
  },
  {
    id: "oligohidramnion",
    letter: "O",
    title: "Oligohidramnion (Volume Air Ketuban Sedikit)",
    category: "Cairan Ketuban",
    summary: "Kondisi di mana indeks cairan ketuban (AFI) < 5 cm atau kantung tunggal teruji < 2 cm pada pemeriksaan USG.",
    firstAid: "Perbanyak konsumsi air putih (min 2.5-3 liter/hari), tirah baring posisi miring kiri, dan evaluasi berkala USG fetomaternal.",
  },
  {
    id: "preeklamsia",
    letter: "P",
    title: "Preeklamsia & Tanda Bahaya Epigastrium",
    category: "Risiko Tinggi (KRST)",
    summary: "Hipertensi kehamilan disertai proteinuria atau pembengkakan (edema) wajah/tangan serta nyeri ulu hati dan pandangan kabur.",
    firstAid: "Segera rujukan ke RS / Faskes terdekat. Posisikan ibu miring kiri, longgarkan pakaian, dan hindari kebisingan.",
  },
  {
    id: "perdarahan",
    letter: "P",
    title: "Perdarahan Antepartum (Plasenta Previa / Solusio)",
    category: "Darurat Kebidanan",
    summary: "Keluarnya darah dari jalan lahir pada usia kehamilan di atas 20 minggu yang bisa menandakan plasenta menutupi jalan lahir.",
    firstAid: "Tirah baring total, DILARANG melakukan pemeriksaan dalam per vaginam, segera bawa ke IGD Rumah Sakit dengan ambulans.",
  },
  {
    id: "posisi-lintang",
    letter: "P",
    title: "Posisi Janin Lintang / Sungsang (Presentasi Non-Kepala)",
    category: "Letak Janin",
    summary: "Kondisi letak janin melintang atau bokong di bagian bawah rahim pada usia kehamilan menjelang persalinan (aterm).",
    firstAid: "Lakukan senam posisi Knee-Chest (sujud ringan) sesuai arahan Bidan/Dokter pada usia kehamilan 32-36 minggu.",
  },
  {
    id: "seksio",
    letter: "S",
    title: "Seksio Sesarea (SC) & Indikasi Rujukan",
    category: "Persalinan",
    summary: "Operasi melahirkan janin melalui insisi dinding perut dan rahim pada kondisi panggul sempit atau posisi janin lintang.",
    firstAid: "Persiapkan dokumen BPJS/Askes, mintalah pendampingan suami, dan ikuti instruksi puasa pre-operasi dari dokter spesialis.",
  },
  {
    id: "simfisiolisis",
    letter: "S",
    title: "Simfisiolisis (Symphysis Pubis Dysfunction / SPD)",
    category: "Muskuloskeletal",
    summary: "Nyeri tajam di area tulang kemaluan dan panggul akibat pelonggaran sendi relaksin menyambut proses melahirkan.",
    firstAid: "Gunakan sabuk penyangga panggul (maternity belt), hindari melangkah melebar, dan lakukan kompres hangat dingin bergantian.",
  },
  {
    id: "trombofilia",
    letter: "T",
    title: "Trombofilia Gestasional (Risiko Penggumpalan Darah)",
    category: "Hematologi",
    summary: "Kecenderungan darah lebih mudah membeku selama kehamilan yang berisiko menyumbat aliran nutrisi plasenta janin.",
    firstAid: "Konsultasi ke Dokter Spesialis Hematologi/SpOG untuk evaluasi terapi pengencer darah (heparin) dan hindari imobilitas berlebihan.",
  },
];

const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Teknik Pijat Oxytocin Ibu Hamil & Pelancar ASI",
    badge: "TERAPI FISIK",
    category: "Trimester 3 · Laktasi",
    instructor: "dr. Sari, Sp.OG",
    youtubeId: "8F1Yj9tG134",
    duration: "6:24",
    description: "Panduan gerakan pijat sepanjang tulang belakang untuk merangsang hormon oksitosin dan mempersiapkan produksi ASI.",
  },
  {
    id: "v2",
    title: "Senam Hamil Trimester 3 Pelancar Pembukaan Persalinan",
    badge: "SENAM HAMIL",
    category: "Trimester 3 · Persalinan",
    instructor: "Bidan Anisa",
    youtubeId: "dQw4w9WgXcQ",
    duration: "9:10",
    description: "Gerakan squat ringan dan pelenturan panggul yang aman untuk membantu kepala janin turun ke pintu panggul.",
  },
  {
    id: "v3",
    title: "Terapi Napas Deep Breathing Meredakan Nyeri Kontraksi",
    badge: "RELAKSASI",
    category: "Manajemen Nyeri",
    instructor: "dr. Putri, Sp.OG",
    youtubeId: "5qap5aO4i9A",
    duration: "5:47",
    description: "Teknik olah napas lambat untuk mengalihkan sensasi nyeri mulas saat pembukaan, edema, atau kontraksi awal.",
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface KamusPageProps {
  articles?: ArticleItem[];
  videos?: VideoItem[];
}

export default function KamusIndex({ articles, videos }: KamusPageProps) {
  const [activeTab, setActiveTab] = useState<string>("artikel");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("semua");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const articleList = articles && articles.length > 0 ? articles : ARTICLES;
  const videoList = videos && videos.length > 0 ? videos : VIDEOS;

  const filteredArticles = articleList.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter =
      selectedLetter === "semua" || art.letter.toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  const filteredVideos = videoList.filter((vid) => {
    return (
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <BundaSehatLayout activeNav="kamus">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Katalog Medis & Terapi Komplementer
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
            Panduan istilah medis kehamilan A-Z & video terapi mandiri.
          </p>
        </div>

        {/* Tabs Switcher: Artikel A-Z vs Video Terapi Komplementer */}
        <div className="flex justify-center">
          <Tabs
            items={[
              { id: "artikel", label: "Kamus Kesehatan A-Z", icon: <FileText className="h-4 w-4" /> },
              { id: "terapi", label: "Video Terapi Komplementer", icon: <Video className="h-4 w-4" /> },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
        </div>

        {/* TAB 1: ARTIKEL KESEHATAN A-Z */}
        {activeTab === "artikel" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Alphabet Filter Pills (Segmented Horizontal Capsule Bar) */}
            <div className="max-w-4xl mx-auto">
              <div className="p-1.5 bg-white border border-slate-200/80 rounded-full shadow-soft-xs flex items-center justify-between gap-0.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setSelectedLetter("semua")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedLetter === "semua"
                      ? "bg-emerald-700 text-white shadow-soft-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                  }`}
                >
                  Semua
                </button>
                {ALPHABET.map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedLetter(char)}
                    className={`h-7 w-7 rounded-full text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                      selectedLetter === char
                        ? "bg-emerald-700 text-white shadow-soft-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacked Row List Layout (Baris 2-Tingkat) */}
            <div className="space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium bg-white rounded-2xl border border-slate-100">
                  Tidak ada istilah komplikasi ditemukan untuk filter huruf ini.
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-slate-200 transition-all cursor-pointer group space-y-2"
                  >
                    {/* Baris 1 (Atas): Judul Lengkap */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                        {article.title}
                      </h3>
                    </div>

                    {/* Baris 2 (Bawah): Deskripsi ringkas 1-2 kalimat + Ikon Panah > */}
                    <div className="flex items-end justify-between gap-4 pt-0.5">
                      <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                        {article.summary}
                      </p>
                      <div className="text-slate-400 group-hover:text-rose-600 shrink-0 group-hover:translate-x-1 transition-transform pb-0.5">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Article Detail Non-Modal Side Drawer (Slide from Right) */}
            <Drawer
              open={Boolean(selectedArticle)}
              onOpenChange={(open) => {
                if (!open) setSelectedArticle(null);
              }}
              modal={false}
              disablePointerDismissal
              swipeDirection="right"
            >
              <DrawerContent>
                {selectedArticle && (
                  <div className="flex flex-col h-full">
                    
                    {/* Header Drawer (Official Shadcn p-4 pb-0) */}
                    <DrawerHeader className="pb-3 border-b border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {selectedArticle.category}
                        </span>
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                          {selectedArticle.letter}
                        </span>
                      </div>
                      <DrawerTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-2">
                        {selectedArticle.title}
                      </DrawerTitle>
                    </DrawerHeader>

                    {/* Body Drawer (Official Shadcn p-4 flex-1 overflow-y-auto) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedArticle.content ? (
                        <div
                          className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-3.5 [&_h2]:mb-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-slate-600 [&_hr]:my-3 [&_hr]:border-slate-200"
                          dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                        />
                      ) : (
                        <>
                          {/* Section 1: Pengertian & Gejala */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Pengertian &amp; Gejala Medis
                            </h4>
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                              {selectedArticle.summary}
                            </div>
                          </div>

                          {/* Section 2: Pertolongan Pertama Mandiri */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span>Pertolongan Pertama Mandiri</span>
                            </h4>
                            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
                              {selectedArticle.firstAid}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer Drawer (Official Shadcn p-4 pt-0 mt-auto) */}
                    <DrawerFooter className="pt-2 border-t border-slate-100 flex-row justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={() => setSelectedArticle(null)}
                        className="rounded-full font-bold text-xs px-5"
                      >
                        Tutup
                      </Button>
                    </DrawerFooter>

                  </div>
                )}
              </DrawerContent>
            </Drawer>

          </div>
        )}

        {/* TAB 2: VIDEO TERAPI KOMPLEMENTER (NON-OBAT) */}
        {activeTab === "terapi" && (
          <div className="space-y-6 animate-fadeIn">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8">
                <Video className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-sm">Tidak ada video ditemukan</h3>
                <p className="text-xs text-slate-500 mt-1">Coba kata kunci pencarian terapi lainnya.</p>
              </div>
            ) : (
              /* Custom Video Grid matching User Design */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredVideos.map((vid) => (
                  <Card
                    key={vid.id}
                    className="rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all bg-white group cursor-pointer flex flex-col justify-between"
                    onClick={() => setSelectedVideo(vid)}
                  >
                  <div className="flex flex-col h-full">
                    {/* Thumbnail Container with Top Badge, Play Button, and Duration */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top-Left Badge (TERAPI FISIK / SENAM HAMIL / RELAKSASI) */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                        {vid.badge}
                      </span>

                      {/* White Circle Play Button in Center (Visible on Hover Only) */}
                      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-white text-rose-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"></path>
                          </svg>
                        </div>
                      </div>

                      {/* Bottom-Right Duration */}
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Card Body Container */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        {/* Category Subtitle */}
                        <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wide">
                          {vid.category}
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-rose-600 transition-colors">
                          {vid.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
                          {vid.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs">
                        <span className="font-bold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          Tonton &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            )}

            {/* Video Modal Player Pop-up (Cinema Mode) */}
            {selectedVideo && (
              <div
                className="fixed inset-0 z-[100] bg-slate-950/80 flex items-center justify-center p-4 animate-fadeIn"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedVideo(null);
                }}
              >
                <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl space-y-0 text-white animate-scaleUp">
                  {/* Dark Cinema Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900">
                    <div className="space-y-0.5 min-w-0 pr-4">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        {selectedVideo.category} · {selectedVideo.badge}
                      </div>
                      <h3 className="font-bold text-white text-base sm:text-lg truncate">
                        {selectedVideo.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors shrink-0"
                      aria-label="Tutup"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Seamless 16:9 Video Player */}
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Dark Cinema Footer Description */}
                  <div className="p-4 sm:p-5 bg-slate-900 space-y-2 border-t border-slate-800">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </BundaSehatLayout>
  );
}
