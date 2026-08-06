import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import {
  Search,
  X,
  Loader2,
  Activity,
  Stethoscope,
  BookOpen,
  User,
  FileText,
  Video,
  Hospital,
  ChevronRight,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  category: "Fitur Navigasi" | "Edukasi Kebidanan" | "Video Terapi" | "Rujukan Faskes";
  description: string;
  url: string;
  icon: React.ElementType;
}

const SEARCH_INDEX: SearchResultItem[] = [
  // Fitur Navigasi
  {
    id: "nav-kehamilan",
    title: "Screening Kehamilan",
    category: "Fitur Navigasi",
    description: "Evaluasi risiko trimester, tensi darah (MAP), dan edema kaki",
    url: "/screening/kehamilan",
    icon: Activity,
  },
  {
    id: "nav-persalinan",
    title: "Screening Persalinan",
    category: "Fitur Navigasi",
    description: "Kesiapan tempat & penolong bersalin aman (PONED / RS)",
    url: "/screening/persalinan",
    icon: Stethoscope,
  },
  {
    id: "nav-kamus",
    title: "Kamus Kesehatan Kebidanan",
    category: "Fitur Navigasi",
    description: "Modul komplikasi, pertolongan pertama, dan terapi video",
    url: "/kamus",
    icon: BookOpen,
  },
  {
    id: "nav-profil",
    title: "Profil Saya & Riwayat",
    category: "Fitur Navigasi",
    description: "Data HPHT, Puskesmas domisili, dan riwayat screening",
    url: "/profil",
    icon: User,
  },

  // Edukasi Kebidanan
  {
    id: "edu-anemia",
    title: "Anemia pada Ibu Hamil (Hb Rendah)",
    category: "Edukasi Kebidanan",
    description: "Kadar hemoglobin < 11 g/dL, penggunaan Tablet Tambah Darah (TTD)",
    url: "/kamus#anemia",
    icon: FileText,
  },
  {
    id: "edu-hipertensi",
    title: "Hipertensi Gestasional (Tensi Tinggi)",
    category: "Edukasi Kebidanan",
    description: "Tekanan darah sistolik ≥ 140 / diastolik ≥ 90 mmHg usia > 20 minggu",
    url: "/kamus#hipertensi",
    icon: FileText,
  },
  {
    id: "edu-preeklamsia",
    title: "Preeklamsia & Nyeri Epigastrium",
    category: "Edukasi Kebidanan",
    description: "Tanda bahaya pusing berat, pandangan kabur, dan ulu hati nyeri",
    url: "/kamus#preeklamsia",
    icon: FileText,
  },
  {
    id: "edu-perdarahan",
    title: "Perdarahan Antepartum",
    category: "Edukasi Kebidanan",
    description: "Tanda darurat plasenta previa / solusio, rujukan emergency RS",
    url: "/kamus#perdarahan",
    icon: FileText,
  },
  {
    id: "edu-sc",
    title: "Seksio Sesarea (SC)",
    category: "Edukasi Kebidanan",
    description: "Indikasi rujukan operasi melahirkan pada kondisi khusus",
    url: "/kamus#seksio",
    icon: FileText,
  },

  // Video Terapi
  {
    id: "vid-oxytocin",
    title: "Pijat Oxytocin Tulang Belakang",
    category: "Video Terapi",
    description: "Panduan relaksasi perangsang kontraksi dan pelancar ASI",
    url: "/kamus#video-oxytocin",
    icon: Video,
  },
  {
    id: "vid-breathing",
    title: "Teknik Pernapasan Deep Breathing",
    category: "Video Terapi",
    description: "Latihan pernapasan dalam penurun stres dan penstabil tensi",
    url: "/kamus#video-breathing",
    icon: Video,
  },
  {
    id: "vid-panggul",
    title: "Senam Pelenturan Panggul Trimester 3",
    category: "Video Terapi",
    description: "Gerakan pemenuhan posisi jalan lahir janin mendekati HPL",
    url: "/kamus#video-panggul",
    icon: Video,
  },
  {
    id: "vid-edema",
    title: "Elevasi & Kompres Pergelangan Kaki",
    category: "Video Terapi",
    description: "Terapi meredakan bengkak pembuluh ekstremitas bawah",
    url: "/kamus#video-edema",
    icon: Video,
  },

  // Rujukan Faskes
  {
    id: "faskes-poned",
    title: "Puskesmas PONED (Pelayanan Obstetri Neonatal)",
    category: "Rujukan Faskes",
    description: "Fasilitas penanganan kegawatdaruratan kebidanan tingkat awal",
    url: "/screening/persalinan",
    icon: Hospital,
  },
  {
    id: "faskes-rs",
    title: "Rumah Sakit Rujukan Spesialis Sp.OG",
    category: "Rujukan Faskes",
    description: "Fasilitas rujukan lanjutan persalinan tindakan Seksio Sesarea (SC)",
    url: "/screening/persalinan",
    icon: Hospital,
  },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search evaluation
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.description.toLowerCase().includes(trimmed) ||
          item.category.toLowerCase().includes(trimmed)
      );
      setResults(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.visit(url);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  // Group results by category
  const groupedResults = results.reduce<Record<string, SearchResultItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari..."
          className="w-full h-9 pl-9 pr-9 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:outline-none focus-visible:outline-none focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all shadow-inner-xs"
        />

        {/* Loading Spinner or Clear Button */}
        {isLoading ? (
          <Loader2 className="absolute right-3 h-3.5 w-3.5 text-rose-500 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden md:inline-flex items-center gap-0.5 pointer-events-none absolute right-3 h-5 px-1.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-500">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Auto-complete Dropdown Popover */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-soft-xl rounded-2xl p-2 z-50 overflow-hidden max-h-[380px] overflow-y-auto space-y-3 animate-fadeIn">
          
          {isLoading ? (
            <div className="py-6 text-center space-y-2 text-slate-500">
              <Loader2 className="h-5 w-5 text-rose-500 animate-spin mx-auto" />
              <p className="text-xs font-medium">Mencari data kebidanan...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 px-4 text-center space-y-1.5 text-slate-500">
              <Search className="h-7 w-7 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-900">
                Tidak ada hasil untuk "{query}"
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Coba kata kunci seperti <span className="text-rose-600 font-bold">"hipertensi"</span>, <span className="text-rose-600 font-bold">"preeklamsia"</span>, atau <span className="text-rose-600 font-bold">"oxytocin"</span>
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pt-1">
                  {cat}
                </span>

                {items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.url)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-rose-100 text-slate-600 group-hover:text-rose-600 flex items-center justify-center shrink-0 transition-colors">
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}
