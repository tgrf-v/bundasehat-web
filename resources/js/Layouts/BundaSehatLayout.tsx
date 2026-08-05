import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
  Heart,
  Activity,
  BookOpen,
  User,
  Home,
  Sparkles,
  ChevronRight,
  LogOut,
  LogIn,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import ApplicationLogo from "@/Components/ApplicationLogo";

interface LayoutProps {
  children: React.ReactNode;
  activeNav?: "landing" | "beranda" | "kehamilan" | "persalinan" | "kamus" | "profil";
}

export const BundaSehatLayout: React.FC<LayoutProps> = ({
  children,
  activeNav = "beranda",
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("bundasehat_auth");
    if (savedAuth !== null) {
      setIsLoggedIn(savedAuth === "true");
    }
  }, []);

  const toggleAuthMode = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    localStorage.setItem("bundasehat_auth", String(loggedIn));
    if (loggedIn) {
      router.visit("/beranda");
    } else {
      router.visit("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Demo Toggle Bar (Simulasi Mode Akses Penguji) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            <span className="font-medium text-slate-300">Simulasi Mode Akses Penguji:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-full border border-slate-700">
            <button
              onClick={() => toggleAuthMode(false)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                !isLoggedIn
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sebelum Login (Landing Page)
            </button>
            <button
              onClick={() => toggleAuthMode(true)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isLoggedIn
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Setelah Login (Beranda Pasien)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Desktop */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-soft-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href={isLoggedIn ? "/beranda" : "/"} className="flex items-center gap-3 group">
            <ApplicationLogo className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                Bunda<span className="text-rose-500">Sehat</span>
              </span>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase">
                Screening & Komplikasi Ibu Hamil
              </p>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {!isLoggedIn ? (
              <>
                <a
                  href="#banner"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-pink-50 hover:text-rose-600 transition-colors"
                >
                  Informasi
                </a>
                <a
                  href="#alasan"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-pink-50 hover:text-rose-600 transition-colors"
                >
                  Keunggulan
                </a>
                <a
                  href="#fitur"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-pink-50 hover:text-rose-600 transition-colors"
                >
                  Fitur Web
                </a>
                <a
                  href="#tentang"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-pink-50 hover:text-rose-600 transition-colors"
                >
                  Tentang Aplikasi
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/beranda"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeNav === "beranda"
                      ? "bg-pink-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Beranda
                </Link>
                <Link
                  href="/screening/kehamilan"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeNav === "kehamilan"
                      ? "bg-pink-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Screening Kehamilan
                </Link>
                <Link
                  href="/screening/persalinan"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeNav === "persalinan"
                      ? "bg-pink-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Screening Persalinan
                </Link>
                <Link
                  href="/kamus"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeNav === "kamus"
                      ? "bg-pink-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Kamus Kesehatan
                </Link>
                <Link
                  href="/profil"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeNav === "profil"
                      ? "bg-pink-50 text-rose-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Profil Saya
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-soft-sm hover:bg-rose-600 transition-all active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk / Login</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/profil"
                  className="hidden sm:flex items-center gap-2 p-1.5 px-3 rounded-full bg-slate-100 hover:bg-pink-50 transition-colors border border-slate-200/80"
                >
                  <div className="h-7 w-7 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                    R
                  </div>
                  <span className="text-xs font-bold text-slate-800 pr-1">Ibu Rahma</span>
                </Link>

                <button
                  onClick={() => toggleAuthMode(false)}
                  title="Logout"
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-8">{children}</main>

      {/* Mobile Bottom Navigation Bar (Hanya Muncul Setelah Login) */}
      {isLoggedIn && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-soft-lg px-4 py-2">
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

      {/* Footer Edukatif */}
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
            <Link href={isLoggedIn ? "/kamus" : "/#fitur"} className="hover:text-rose-600">
              Kamus Kesehatan
            </Link>
            <Link href={isLoggedIn ? "/screening/kehamilan" : "/#fitur"} className="hover:text-rose-600">
              Screening Kehamilan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
