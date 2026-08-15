import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
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

import { PageProps } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  activeNav?: "landing" | "beranda" | "kehamilan" | "persalinan" | "kamus" | "profil" | "tentang-kami" | "admin-bidan";
}

export const BundaSehatLayout: React.FC<LayoutProps> = ({
  children,
  activeNav = "beranda",
}) => {
  const { auth } = usePage<PageProps>().props;

  const user = auth?.user;
  const isLoggedIn = Boolean(user);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-clip lg:overflow-y-hidden">

      {/* Background Ambient Ornaments & Visible Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Visible Soft Radial Gradient Blobs */}
        <div className="absolute -right-28 -top-10 w-[650px] h-[650px] bg-gradient-to-br from-emerald-200/45 via-sage-100/35 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-28 top-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-sage-200/40 via-emerald-100/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-[500px] h-[500px] bg-gradient-to-t from-emerald-200/35 via-sage-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Floating Plus Signs (+ Ornaments) & Sparkles (Soft Opacity) */}
        <div className="absolute top-36 left-12 text-emerald-600/20 text-2xl font-normal select-none">
          +
        </div>
        <div className="absolute top-1/2 right-16 text-emerald-600/15 text-3xl font-normal select-none">
          +
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-sage-600/20 text-2xl font-normal select-none">
          +
        </div>
        <div className="absolute top-1/4 right-1/3 text-emerald-600/20 text-xl select-none">
          ✦
        </div>
      </div>      {/* Main Header Desktop (Fixed Top Navbar) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          !isLoggedIn && !isScrolled
            ? "bg-transparent border-transparent shadow-none text-white"
            : "bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-soft-sm text-slate-900"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand & Title */}
          <Link href={isLoggedIn ? "/" : "/login"} className="flex items-center gap-2.5 group shrink-0">
            <ApplicationLogo
              variant={!isLoggedIn && !isScrolled ? "white" : "color"}
              className="h-8 w-8 group-hover:scale-105 transition-transform"
            />
            <span
              className={`font-bold text-base tracking-wide transition-colors ${
                !isLoggedIn && !isScrolled ? "text-white" : "text-slate-800"
              }`}
            >
              Logo
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
                href="/"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "beranda"
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/screening/kehamilan"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "kehamilan"
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Screening Kehamilan
              </Link>
              <Link
                href="/screening/persalinan"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "persalinan"
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Screening Persalinan
              </Link>
              <Link
                href="/kamus"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "kamus"
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Kamus Kesehatan
              </Link>
              <Link
                href="/tentang-kami"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  activeNav === "tentang-kami"
                    ? "text-emerald-700 font-bold"
                    : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                Tentang Kami
              </Link>
              {user?.role === "superadmin" && (
                <Link
                  href="/admin/bidan"
                  className={`px-3 py-1.5 text-sm transition-colors rounded-full font-bold ${
                    activeNav === "admin-bidan"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-emerald-700 hover:bg-emerald-50/60"
                  }`}
                >
                  Kelola Bidan
                </Link>
              )}
            </nav>
          )}

          {/* User Profile & Auth Action Buttons */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/profil"
                className="relative group p-1 rounded-full bg-slate-100 hover:bg-emerald-100 transition-all shadow-soft-xs flex items-center justify-center"
                title={`Profil Saya (${user?.name || "User"})`}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-soft-xs group-hover:scale-105 transition-transform bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 pt-16 pb-20 md:pb-0">{children}</main>

      {/* Mobile Bottom Navigation Bar (Softglasses Style) */}
      {isLoggedIn && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-t border-white/50 shadow-soft-lg px-4 py-2">
          <div className="grid grid-cols-5 gap-1 text-center">
            <Link
              href="/"
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-colors ${
                activeNav === "beranda"
                  ? "text-emerald-700 font-bold"
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
                  ? "text-emerald-700 font-bold"
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
                  ? "text-emerald-700 font-bold"
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
                  ? "text-emerald-700 font-bold"
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
                  ? "text-emerald-700 font-bold"
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
              <ApplicationLogo className="h-5 w-5" />
              <span className="font-semibold text-slate-700">
                Logo &copy; {new Date().getFullYear()}
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

    </div>
  );
};
