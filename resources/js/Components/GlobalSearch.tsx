import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import {
  Search,
  X,
  Loader2,
  ChevronRight,
  Activity,
  Stethoscope,
  BookOpen,
  User,
  FileText,
  Video,
  Hospital,
  ShieldCheck,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  category: "Fitur Navigasi" | "Edukasi Kebidanan" | "Video Terapi" | "Rujukan Faskes";
  description: string;
  url: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Dynamic async search from database endpoint
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Global search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
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
      const cat = item.category || "Hasil Lainnya";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
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
          className="w-full h-9 pl-9 pr-9 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:outline-none focus-visible:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-inner-xs"
        />

        {/* Loading Spinner or Clear Button */}
        {isLoading ? (
          <Loader2 className="absolute right-3 h-3.5 w-3.5 text-emerald-600 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Auto-complete Dropdown Popover */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/90 shadow-soft-xl rounded-2xl p-2 z-50 overflow-hidden max-h-[380px] overflow-y-auto space-y-3 animate-fadeIn">
          
          {isLoading ? (
            <div className="py-6 text-center space-y-2 text-slate-500">
              <Loader2 className="h-5 w-5 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-medium">Mencari data kebidanan...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 px-4 text-center space-y-1.5 text-slate-500">
              <Search className="h-7 w-7 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-900">
                Tidak ada hasil untuk "{query}"
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([cat, items]) => (
              <div key={cat} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-1">
                  {cat}
                </span>

                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item.url)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50/70 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}
