import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
  LogIn,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
} from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("rahma.pasien@email.com");
  const [password, setPassword] = useState<string>("password123");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    localStorage.setItem("bundasehat_auth", "true");

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

      {/* Login / Register Card */}
      <Card className="w-full max-w-md rounded-3xl border-pink-100 shadow-soft-lg bg-white/95 backdrop-blur-md overflow-hidden">
        
        {/* Header Branding */}
        <CardHeader className="text-center pt-6 pb-2 px-6 space-y-2">
          <div className="mx-auto flex justify-center mb-1">
            <ApplicationLogo className="h-12 w-auto object-contain" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>{mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500 mt-0.5">
              Pendamping Ibu Hamil &amp; Persalinan
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nama Field (Hanya di mode Register) */}
            {mode === "register" && (
              <div className="animate-fadeIn">
                <Label htmlFor="nama_register" className="text-xs font-bold text-slate-700">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="nama_register"
                    type="text"
                    placeholder="Contoh: Ibu Rahma Rahayu"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email_input" className="text-xs font-bold text-slate-700">
                Alamat Email <span className="text-rose-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="email_input"
                  type="email"
                  placeholder="nama@email.com"
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
                <Label htmlFor="password_input" className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </Label>
                {mode === "login" && (
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Gunakan password demo yang tersedia.'); }}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Lupa password?
                  </a>
                )}
              </div>

              <div className="relative mt-1.5">
                <Input
                  id="password_input"
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

            {/* Confirm Password (Hanya di mode Register) */}
            {mode === "register" && (
              <div className="animate-fadeIn">
                <Label htmlFor="confirm_password_input" className="text-xs font-bold text-slate-700">
                  Konfirmasi Password <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm_password_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Remember Me (Hanya di mode Login) */}
            {mode === "login" && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember_me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  />
                  <Label htmlFor="remember_me" className="text-xs text-slate-600 cursor-pointer font-medium">
                    Ingat saya
                  </Label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="rose"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold text-sm gap-2 shadow-soft-md mt-2"
            >
              {mode === "login" ? (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Sekarang</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </Button>

          </form>
        </CardContent>

        {/* Dynamic Footer Toggle */}
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
          {mode === "login" ? (
            <p className="text-xs text-slate-500">
              Belum memiliki akun?{" "}
              <button
                onClick={() => setMode("register")}
                className="font-bold text-rose-600 hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-bold text-rose-600 hover:underline"
              >
                Masuk sekarang
              </button>
            </p>
          )}
        </CardFooter>

      </Card>
    </div>
  );
}
