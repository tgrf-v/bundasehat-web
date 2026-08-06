import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
  Activity,
  BookOpen,
  User,
  Home,
  Sparkles,
  LogOut,
  LogIn,
  Stethoscope,
  Globe,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { GlobalSearch } from "@/Components/GlobalSearch";

interface LayoutProps {
  children: React.ReactNode;
  activeNav?: "landing" | "beranda" | "kehamilan" | "persalinan" | "kamus" | "profil";
}

export const BundaSehatLayout: React.FC<LayoutProps> = ({
  children,
  activeNav = "beranda",
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");

  useEffect(() => {
    const savedAuth = localStorage.getItem("bundasehat_auth");
    if (savedAuth !== null) {
      setIsLoggedIn(savedAuth === "true");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAuthMode = (mode: boolean) => {
    setIsLoggedIn(mode);
    localStorage.setItem("bundasehat_auth", mode ? "true" : "false");
    if (mode) {
      router.visit("/beranda");
    } else {
      router.visit("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-clip lg:overflow-y-hidden">

      {/* Background Ambient Ornaments & Visible Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Visible Soft Radial Gradient Blobs */}
        <div className="absolute -right-28 -top-10 w-[650px] h-[650px] bg-gradient-to-br from-rose-300/65 via-pink-200/45 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-28 top-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-pink-300/55 via-rose-200/35 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-[500px] h-[500px] bg-gradient-to-t from-rose-300/45 via-pink-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Floating Plus Signs (+ Ornaments) & Sparkles (Soft Opacity) */}
        <div className="absolute top-36 left-12 text-rose-400/20 text-2xl font-normal select-none">
          +
        </div>
        <div className="absolute top-1/2 right-16 text-rose-400/15 text-3xl font-normal select-none">
          +
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-pink-400/20 text-2xl font-normal select-none">
          +
        </div>
        <div className="absolute top-1/4 right-1/3 text-rose-400/20 text-xl select-none">
          ✦
        </div>
      </div>

      {/* Main Header Desktop (Super Clean & Seamless Scroll Behavior) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          !isLoggedIn && !isScrolled
            ? "bg-transparent border-transparent shadow-none text-white"
            : "bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-soft-sm text-slate-900"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand & Title */}
          <Link href={isLoggedIn ? "/beranda" : "/"} className="flex items-center gap-3 group shrink-0">
            <ApplicationLogo
              variant={!isLoggedIn && !isScrolled ? "white" : "color"}
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span
              className={`font-bold text-lg tracking-tight flex items-center gap-1 transition-colors ${
                !isLoggedIn && !isScrolled ? "text-white" : "text-slate-900"
              }`}
            >
              Bunda<span className={!isLoggedIn && !isScrolled ? "text-pink-200" : "text-rose-500"}>Sehat</span>
            </span>
          </Link>

          {/* Global Search Bar Component (Hanya Tampil Saat Logged In / Bukan di Landing Page) */}
          {isLoggedIn && (
            <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
              <GlobalSearch />
            </div>
          )}

          {/* Navigasi Desktop (Super Clean & Minimalist Text Only) */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/beranda"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "beranda"
                    ? "text-rose-600 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/screening/kehamilan"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "kehamilan"
                    ? "text-rose-600 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Screening Kehamilan
              </Link>
              <Link
                href="/screening/persalinan"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "persalinan"
                    ? "text-rose-600 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Screening Persalinan
              </Link>
              <Link
                href="/kamus"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "kamus"
                    ? "text-rose-600 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Kamus Kesehatan
              </Link>
              <Link
                href="/profil"
                title="Profil Saya"
                className={`ml-1 flex items-center justify-center h-9 w-9 rounded-full overflow-hidden border transition-all duration-200 group ${
                  activeNav === "profil"
                    ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50 text-rose-600"
                    : "border-slate-200 bg-slate-100/80 text-slate-600 hover:border-rose-300 hover:text-rose-600 hover:scale-105"
                }`}
              >
                <User className="h-4 w-4" />
              </Link>
            </nav>
          )}

          {/* Right Action Button */}
          {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shadow-soft-sm transition-all active:scale-95 ${
                  !isScrolled
                    ? "bg-white text-rose-600 hover:bg-pink-50"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk / Login</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile Bottom Navigation Bar (Softglasses Style) */}
      {isLoggedIn && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-t border-white/50 shadow-soft-lg px-4 py-2">
          <div className="grid grid-cols-5 gap-1 text-center">
            <Link
              href="/beranda"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "beranda"
                  ? "text-rose-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Home className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Beranda</span>
            </Link>

            <Link
              href="/screening/kehamilan"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "kehamilan"
                  ? "text-rose-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Activity className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Kehamilan</span>
            </Link>

            <Link
              href="/screening/persalinan"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "persalinan"
                  ? "text-rose-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Stethoscope className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Persalinan</span>
            </Link>

            <Link
              href="/kamus"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "kamus"
                  ? "text-rose-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Kamus</span>
            </Link>

            <Link
              href="/profil"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "profil"
                  ? "text-rose-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Profil</span>
            </Link>
          </div>
        </div>
      )}

      {/* Footer Edukatif (Hanya Tampil Pada Landing Page Sebelum Login) */}
      {!isLoggedIn && (
        <footer className="bg-white border-t border-slate-100 py-8 px-4 mt-auto hidden md:block">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ApplicationLogo className="h-5 w-auto" />
              <span className="font-semibold text-slate-700">
                BundaSehat &copy; {new Date().getFullYear()}
              </span>
              <span>- Platform Screening Komplikasi Kehamilan & Persalinan Sehat</span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <Link href="/#fitur" className="hover:text-rose-600">
                Fitur Unggulan
              </Link>
            </div>
          </div>
        </footer>
      )}

      {/* Floating Demo Switcher Widget (Pojok Kanan Bawah) */}
      <div className="fixed bottom-16 right-3 md:bottom-6 md:right-6 z-50 animate-fadeIn">
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 px-2.5 rounded-full border border-slate-700/80 shadow-soft-lg text-white">
          <div className="flex items-center gap-1.5 pr-1 text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline text-[11px] font-bold">Simulasi Penguji:</span>
          </div>
          <button
            onClick={() => toggleAuthMode(false)}
            className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
              !isLoggedIn
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sebelum Login
          </button>
          <button
            onClick={() => toggleAuthMode(true)}
            className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
              isLoggedIn
                ? "bg-rose-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Setelah Login
          </button>
        </div>
      </div>

    </div>
  );
};
