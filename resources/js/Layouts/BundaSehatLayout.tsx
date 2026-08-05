import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Heart,
  Activity,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Home,
  FileText,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { UserRole } from "@/types/screening";
import { Badge } from "@/Components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
  activeRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  activeNav?: "beranda" | "screening" | "persalinan" | "kamus" | "admin";
}

export const BundaSehatLayout: React.FC<LayoutProps> = ({
  children,
  activeRole = "pasien",
  onRoleChange,
  activeNav = "beranda",
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(activeRole);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Role Switcher Bar (Simulasi 3 Role Penguji) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="font-medium text-slate-300">Simulasi Role Penguji:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => handleRoleSelect("pasien")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                currentRole === "pasien"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pasien / Ibu Hamil
            </button>
            <button
              onClick={() => handleRoleSelect("admin")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                currentRole === "admin"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Bidan / Nakes
            </button>
            <button
              onClick={() => handleRoleSelect("super_admin")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                currentRole === "super_admin"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Super Admin (Bu Asih)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Desktop */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-soft-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-rose-500 flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
              <Heart className="h-5.5 w-5.5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                Bunda<span className="text-rose-600">Sehat</span>
              </span>
              <p className="text-[10px] font-medium text-slate-500 tracking-wider">
                SCREENING & KLASIFIKASI RISIKO
              </p>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeNav === "beranda"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/screening/kehamilan"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeNav === "screening"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Screening Kehamilan
            </Link>
            <Link
              href="/screening/persalinan"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeNav === "persalinan"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Screening Persalinan
            </Link>
            <Link
              href="/kamus"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeNav === "kamus"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              Kamus Kesehatan
            </Link>
          </nav>

          {/* Right Header Status / Action */}
          <div className="flex items-center gap-3">
            {currentRole === "super_admin" ? (
              <Badge variant="rose" className="gap-1.5 py-1 px-3">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Super Admin</span>
              </Badge>
            ) : currentRole === "admin" ? (
              <Badge variant="ringan" className="gap-1.5 py-1 px-3">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Bidan Wilayah</span>
              </Badge>
            ) : (
              <Link
                href="/screening/kehamilan"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-soft-sm hover:bg-rose-700 transition-all active:scale-95"
              >
                <span>Mulai Screening</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">{children}</main>

      {/* Mobile Bottom Navigation Bar (Halodoc x Hamilku App Feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-soft-lg px-4 py-2">
        <div className="grid grid-cols-4 gap-1 text-center">
          <Link
            href="/"
            className={`flex flex-col items-center py-1.5 rounded-xl transition-colors ${
              activeNav === "beranda"
                ? "text-emerald-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Beranda</span>
          </Link>

          <Link
            href="/screening/kehamilan"
            className={`flex flex-col items-center py-1.5 rounded-xl transition-colors ${
              activeNav === "screening"
                ? "text-emerald-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Screening</span>
          </Link>

          <Link
            href="/kamus"
            className={`flex flex-col items-center py-1.5 rounded-xl transition-colors ${
              activeNav === "kamus"
                ? "text-emerald-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Kamus</span>
          </Link>

          <Link
            href="/screening/hasil"
            className={`flex flex-col items-center py-1.5 rounded-xl transition-colors ${
              activeNav === "admin"
                ? "text-emerald-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Hasil</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 mt-auto hidden md:block">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500 fill-current" />
            <span className="font-semibold text-slate-700">
              BundaSehat &copy; {new Date().getFullYear()}
            </span>
            <span>- Platform Screening Komplikasi Kehamilan & Persalinan</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/kamus" className="hover:text-emerald-600">
              Kamus Kesehatan
            </Link>
            <Link href="/screening/kehamilan" className="hover:text-emerald-600">
              Form Screening
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
