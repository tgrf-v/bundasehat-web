import React, { useState } from "react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Tabs } from "@/Components/ui/tabs";
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
  summary: string;
  firstAid: string;
}

interface VideoItem {
  id: string;
  title: string;
  category: string;
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
    id: "hipertensi",
    letter: "H",
    title: "Hipertensi Gestasional (Tekanan Darah Tinggi Kehamilan)",
    category: "Vaskular",
    summary: "Tekanan darah sistolik ≥ 140 mmHg atau diastolik ≥ 90 mmHg yang pertama kali muncul setelah usia kehamilan 20 minggu.",
    firstAid: "Tirah baring (rest) posisi miring ke kiri, batasi asupan garam tinggi, kelola stres dengan relaksasi napas, dan rutin cek tensi mingguan.",
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
    id: "seksio",
    letter: "S",
    title: "Seksio Sesarea (SC) & Indikasi Rujukan",
    category: "Persalinan",
    summary: "Operasi melahirkan janin melalui insisi dinding perut dan rahim pada kondisi panggul sempit atau posisi janin lintang.",
    firstAid: "Persiapkan dokumen BPJS/Askes, mintalah pendampingan suami, dan ikuti instruksi puasa pre-operasi dari dokter spesialis.",
  },
];

const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Teknik Pijat Oxytocin Ibu Hamil & Pelancar ASI",
    category: "Pijat & Relaksasi",
    youtubeId: "dQw4w9WgXcQ",
    duration: "08:45",
    description: "Panduan gerakan pijat sepanjang tulang belakang untuk merangsang hormon oksitosin dan melancarkan persalinan.",
  },
  {
    id: "v2",
    title: "Senam Hamil Trimester 3 Pelancar Pembukaan Persalinan",
    category: "Olahraga Bumil",
    youtubeId: "dQw4w9WgXcQ",
    duration: "12:30",
    description: "Gerakan squat ringan dan pelenturan panggul yang aman untuk membantu kepala janin turun ke pintu atas panggul.",
  },
  {
    id: "v3",
    title: "Terapi Napas Deep Breathing Meredakan Nyeri Kontraksi",
    category: "Manajemen Nyeri",
    youtubeId: "dQw4w9WgXcQ",
    duration: "06:15",
    description: "Teknik olah napas lambat untuk mengalihkan sensasi nyeri mulas saat pembengkakan edema atau kontraksi persalinan.",
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KamusIndex() {
  const [activeTab, setActiveTab] = useState<string>("artikel");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("semua");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter =
      selectedLetter === "semua" || art.letter.toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
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
            
            {/* Alphabet Filter Pills (Halodoc Style) */}
            <div className="space-y-4">
              <div className="flex items-center justify-center flex-wrap gap-1 max-w-3xl mx-auto pt-1">
                <button
                  onClick={() => setSelectedLetter("semua")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedLetter === "semua"
                      ? "bg-rose-500 text-white shadow-soft-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Semua (A-Z)
                </button>
                {ALPHABET.map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedLetter(char)}
                    className={`h-7 w-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      selectedLetter === char
                        ? "bg-rose-500 text-white shadow-soft-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="p-5 rounded-3xl border-slate-100 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer bg-white space-y-3"
                  onClick={() => setSelectedArticle(article)}
                >
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                    <span>Baca Pertolongan Pertama</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Article Detail Modal Dialog */}
            {selectedArticle && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                <Card className="max-w-lg w-full rounded-3xl bg-white p-6 space-y-4 shadow-soft-lg">
                  <div className="flex items-center justify-end border-b border-slate-100 pb-3">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                      aria-label="Tutup"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedArticle.title}
                  </h3>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Pengertian & Gejala:</span>
                      <p className="leading-relaxed text-slate-600">{selectedArticle.summary}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 space-y-1 text-rose-950">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                        <span>Pertolongan Pertama Mandiri:</span>
                      </span>
                      <p className="leading-relaxed text-slate-800 font-medium pl-5">
                        {selectedArticle.firstAid}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="default" size="sm" onClick={() => setSelectedArticle(null)}>
                      Mengerti & Tutup
                    </Button>
                  </div>
                </Card>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: VIDEO TERAPI KOMPLEMENTER (NON-OBAT) */}
        {activeTab === "terapi" && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VIDEOS.map((vid) => (
                <Card key={vid.id} className="rounded-3xl border-slate-100 overflow-hidden shadow-soft-sm bg-white space-y-3">
                  {/* Embedded Video Placeholder / Player */}
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center group cursor-pointer">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-end">
                      <span className="text-[11px] font-bold text-slate-400">{vid.duration}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {vid.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        )}

      </div>
    </BundaSehatLayout>
  );
}
