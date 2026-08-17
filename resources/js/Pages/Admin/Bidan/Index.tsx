import React, { useState } from "react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Dialog } from "@/Components/ui/dialog";
import {
  Stethoscope,
  Plus,
  Trash2,
  Search,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  FileCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  UserPlus,
  MapPin,
  Users,
} from "lucide-react";

import { PageProps } from "@/types";

interface BidanItem {
  id: number;
  name: string;
  email: string;
  no_telepon?: string | null;
  no_str?: string | null;
  puskesmas_wilayah?: string | null;
  created_at: string;
}

type AdminBidanPageProps = PageProps<{
  bidanList: BidanItem[];
}>;

export default function AdminBidanIndex() {
  const { bidanList = [], flash } = usePage<AdminBidanPageProps>().props;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [deletingBidan, setDeletingBidan] = useState<BidanItem | null>(null);

  // Form untuk Tambah Bidan
  const createForm = useForm({
    name: "",
    email: "",
    password: "",
    no_telepon: "",
    no_str: "",
    puskesmas_wilayah: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createForm.post(route("admin.bidan.store"), {
      preserveScroll: true,
      onSuccess: () => {
        setIsCreateModalOpen(false);
        createForm.reset();
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingBidan) return;

    router.delete(route("admin.bidan.destroy", { bidan: deletingBidan.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setDeletingBidan(null);
      },
    });
  };

  // Filter list berdasarkan pencarian
  const filteredBidan = bidanList.filter((b) => {
    const query = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      (b.no_str && b.no_str.toLowerCase().includes(query)) ||
      (b.puskesmas_wilayah && b.puskesmas_wilayah.toLowerCase().includes(query))
    );
  });

  // Statistik Cepat
  const totalBidan = bidanList.length;
  const uniquePuskesmas = new Set(
    bidanList.map((b) => b.puskesmas_wilayah).filter(Boolean)
  ).size;

  return (
    <BundaSehatLayout activeNav="admin-bidan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 animate-fadeIn">
        
        {/* FLASH NOTIFICATION */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn shadow-soft-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Manajemen Akun Bidan Wilayah
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl leading-relaxed">
              Kelola data akun tenaga kesehatan kebidanan, nomor STR resmi, dan penugasan fasilitas Puskesmas wilayah binaan.
            </p>
          </div>

          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-2 shadow-soft-sm shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Bidan Baru</span>
          </Button>
        </div>

        {/* STATS BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Bidan Aktif
              </span>
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Stethoscope className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalBidan}
              </span>
              <span className="text-xs text-slate-500 font-medium">Tenaga Nakes</span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Puskesmas Terdaftar
              </span>
              <div className="h-9 w-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {uniquePuskesmas}
              </span>
              <span className="text-xs text-slate-500 font-medium">Wilayah Faskes</span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status Verifikasi STR
              </span>
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
                100%
              </span>
              <span className="text-xs text-emerald-600 font-medium">Tervalidasi Resmi</span>
            </div>
          </Card>

        </div>

        {/* SEARCH & TABLE SECTION */}
        <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden space-y-0">
          
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Daftar Tenaga Bidan Wilayah
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Total {filteredBidan.length} data bidan terdaftar dalam sistem
              </CardDescription>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, STR, puskesmas..."
                className="pl-9 text-xs h-10 rounded-full border border-slate-200 bg-white"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <CardContent className="p-0">
            {filteredBidan.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/70">
                      <TableHead className="text-xs font-bold pl-6">Nama Bidan</TableHead>
                      <TableHead className="text-xs font-bold">No. STR</TableHead>
                      <TableHead className="text-xs font-bold">Wilayah Puskesmas</TableHead>
                      <TableHead className="text-xs font-bold">No. WhatsApp</TableHead>
                      <TableHead className="text-xs font-bold">Terdaftar</TableHead>
                      <TableHead className="text-xs font-bold text-right pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBidan.map((bidan) => (
                      <TableRow key={bidan.id} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Name & Email */}
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                              {bidan.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {bidan.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3 text-slate-400" />
                                <span>{bidan.email}</span>
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* STR Badge */}
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-[11px] font-mono font-bold bg-slate-50 border-slate-200">
                            {bidan.no_str || "-"}
                          </Badge>
                        </TableCell>

                        {/* Wilayah Puskesmas */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{bidan.puskesmas_wilayah || "Puskesmas Belum Diatur"}</span>
                          </div>
                        </TableCell>

                        {/* No. Telepon */}
                        <TableCell className="py-4 text-xs text-slate-600 font-medium">
                          {bidan.no_telepon ? (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{bidan.no_telepon}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>

                        {/* Tanggal */}
                        <TableCell className="py-4 text-xs text-slate-500">
                          {bidan.created_at}
                        </TableCell>

                        {/* Action */}
                        <TableCell className="py-4 text-right pr-6">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingBidan(bidan)}
                            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus Akun Bidan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Tidak Ada Data Bidan</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchTerm
                      ? `Tidak ditemukan akun bidan yang cocok dengan pencarian "${searchTerm}".`
                      : "Belum ada akun Bidan yang didaftarkan. Klik tombol di atas untuk menambah akun Bidan baru."}
                  </p>
                </div>
                {searchTerm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="rounded-full text-xs font-bold"
                  >
                    Reset Pencarian
                  </Button>
                )}
              </div>
            )}
          </CardContent>

        </Card>

      </div>

      {/* MODAL / DIALOG: TAMBAH BIDAN BARU */}
      <Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Akun Bidan Baru"
        description="Registrasikan Nakes Bidan untuk wilayah binaan"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1">
          
          {/* Field 1: Nama Lengkap */}
          <div>
            <Label htmlFor="bidan_name" className="text-xs font-bold text-slate-700">
              Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bidan_name"
              type="text"
              placeholder="Contoh: Bidan Siti Rahayu, S.Tr.Keb"
              value={createForm.data.name}
              onChange={(e) => createForm.setData("name", e.target.value)}
              className="mt-1"
              required
            />
            {createForm.errors.name && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.name}</p>
            )}
          </div>

          {/* Field 2: Email Login */}
          <div>
            <Label htmlFor="bidan_email" className="text-xs font-bold text-slate-700">
              Alamat Email Akun <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bidan_email"
              type="email"
              placeholder="bidan.siti@puskesmas.go.id"
              value={createForm.data.email}
              onChange={(e) => createForm.setData("email", e.target.value)}
              className="mt-1"
              required
            />
            {createForm.errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.email}</p>
            )}
          </div>

          {/* Field 3: Password Akun */}
          <div>
            <Label htmlFor="bidan_password" className="text-xs font-bold text-slate-700">
              Password Login <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bidan_password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={createForm.data.password}
              onChange={(e) => createForm.setData("password", e.target.value)}
              className="mt-1"
              required
            />
            {createForm.errors.password && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.password}</p>
            )}
          </div>

          {/* Field 4: No. STR Bidan */}
          <div>
            <Label htmlFor="bidan_str" className="text-xs font-bold text-slate-700">
              Nomor STR Bidan <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bidan_str"
              type="text"
              placeholder="Contoh: STR-BDN-2026-0912"
              value={createForm.data.no_str}
              onChange={(e) => createForm.setData("no_str", e.target.value)}
              className="mt-1"
              required
            />
            {createForm.errors.no_str && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.no_str}</p>
            )}
          </div>

          {/* Field 5: Wilayah Puskesmas */}
          <div>
            <Label htmlFor="bidan_puskesmas" className="text-xs font-bold text-slate-700">
              Wilayah Penugasan Puskesmas <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="bidan_puskesmas"
              type="text"
              placeholder="Contoh: Puskesmas Kecamatan Cilandak"
              value={createForm.data.puskesmas_wilayah}
              onChange={(e) => createForm.setData("puskesmas_wilayah", e.target.value)}
              className="mt-1"
              required
            />
            {createForm.errors.puskesmas_wilayah && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.puskesmas_wilayah}</p>
            )}
          </div>

          {/* Field 6: No. WhatsApp / Telepon */}
          <div>
            <Label htmlFor="bidan_phone" className="text-xs font-bold text-slate-700">
              Nomor WhatsApp / Kontak
            </Label>
            <Input
              id="bidan_phone"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={createForm.data.no_telepon}
              onChange={(e) => createForm.setData("no_telepon", e.target.value)}
              className="mt-1"
            />
            {createForm.errors.no_telepon && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{createForm.errors.no_telepon}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-full font-bold text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              size="default"
              isLoading={createForm.processing}
              disabled={createForm.processing}
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Simpan Akun Bidan</span>
            </Button>
          </div>

        </form>
      </Dialog>

      {/* MODAL DIALOG: KONFIRMASI HAPUS BIDAN */}
      <Dialog
        isOpen={Boolean(deletingBidan)}
        onClose={() => setDeletingBidan(null)}
        showCloseButton={false}
        className="max-w-md text-center p-6 sm:p-7"
      >
        <div className="space-y-5">
          <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              Hapus Akun Bidan?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun Bidan <strong className="text-slate-800 font-bold">{deletingBidan?.name}</strong> ({deletingBidan?.email})? Akun ini tidak akan dapat login lagi.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setDeletingBidan(null)}
              className="rounded-full font-bold text-xs px-5"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="default"
              onClick={handleDeleteConfirm}
              className="rounded-full font-bold text-xs px-5"
            >
              Ya, Hapus Akun
            </Button>
          </div>
        </div>
      </Dialog>

    </BundaSehatLayout>
  );
}
