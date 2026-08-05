import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("rahma.pasien@bundasehat.id");
  const [password, setPassword] = useState<string>("password123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedRolePreset, setSelectedRolePreset] = useState<"pasien" | "bidan" | "bu_asih">("pasien");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectPreset = (role: "pasien" | "bidan" | "bu_asih") => {
    setSelectedRolePreset(role);
    if (role === "pasien") {
      setEmail("rahma.pasien@bundasehat.id");
      setPassword("password123");
    } else if (role === "bidan") {
      setEmail("bidan.wilayah1@bundasehat.id");
      setPassword("bidan12345");
    } else {
      setEmail("bu.asih@bundasehat.id");
      setPassword("buasih12345");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    localStorage.setItem("bundasehat_auth", "true");
    localStorage.setItem("bundasehat_role", selectedRolePreset);

    setTimeout(() => {
      setIsLoading(false);
      router.visit("/beranda");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-50 to-pink-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Subtle Ornaments */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Landing Page</span>
        </Link>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md rounded-3xl border-pink-100 shadow-soft-lg bg-white/95 backdrop-blur-md overflow-hidden">
        
        {/* Header Branding */}
        <CardHeader className="text-center p-6 md:p-8 border-b border-slate-100 space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-white p-2 border border-pink-100 shadow-soft-sm mx-auto flex items-center justify-center">
            <ApplicationLogo className="h-12 w-12 object-contain" />
          </div>

          <div>
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Masuk ke</span>
              <span className="text-rose-500">BundaSehat</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500 mt-1">
              Platform Screening Komplikasi Kehamilan & Persalinan Sehat
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          
          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Pilih Role Akun Demo:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset("pasien")}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRolePreset === "pasien"
                    ? "bg-pink-50 border-rose-500 text-rose-600 shadow-soft-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-[11px]">Pasien</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("bidan")}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRolePreset === "bidan"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-soft-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                <span className="text-[11px]">Bidan</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("bu_asih")}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRolePreset === "bu_asih"
                    ? "bg-rose-50 border-rose-600 text-rose-700 shadow-soft-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[11px]">Bu Asih</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <Label htmlFor="email_login" className="text-xs font-bold text-slate-700">
                Alamat Email <span className="text-rose-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="email_login"
                  type="email"
                  placeholder="nama@bundasehat.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password_login" className="text-xs font-bold text-slate-700">
                  Kata Sandi / Password <span className="text-rose-500">*</span>
                </Label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Gunakan password demo yang tersedia.'); }} className="text-[11px] font-bold text-rose-600 hover:underline">
                  Lupa password?
                </a>
              </div>

              <div className="relative mt-1.5">
                <Input
                  id="password_login"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember_me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <Label htmlFor="remember_me" className="text-xs text-slate-600 cursor-pointer font-medium">
                  Ingat saya di perangkat ini
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="rose"
              size="lg"
              isLoading={isLoading}
              className="w-full font-extrabold text-sm gap-2 shadow-soft-md mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk Sekarang</span>
            </Button>

          </form>

        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun pasien?{" "}
            <button
              onClick={() => {
                localStorage.setItem("bundasehat_auth", "true");
                router.visit("/beranda");
              }}
              className="font-bold text-rose-600 hover:underline"
            >
              Daftar / Coba Demo Instan
            </button>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
}
