import React, { useState, useMemo } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Dialog } from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  MoreHorizontal,
  Pencil,
  User,
  ArrowUpDown,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { PageProps } from "@/types";

interface BidanItem {
  id: number;
  name: string;
  email: string;
  is_active?: boolean;
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

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [viewingBidan, setViewingBidan] = useState<BidanItem | null>(null);
  const [editingBidan, setEditingBidan] = useState<BidanItem | null>(null);
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

  // Form untuk Edit Bidan
  const editForm = useForm({
    name: "",
    email: "",
    password: "",
    no_telepon: "",
    no_str: "",
    puskesmas_wilayah: "",
  });

  const handleOpenEditModal = (bidan: BidanItem) => {
    setEditingBidan(bidan);
    editForm.setData({
      name: bidan.name || "",
      email: bidan.email || "",
      password: "",
      no_telepon: bidan.no_telepon || "",
      no_str: bidan.no_str || "",
      puskesmas_wilayah: bidan.puskesmas_wilayah || "",
    });
    editForm.clearErrors();
  };

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBidan) return;

    editForm.put(route("admin.bidan.update", { bidan: editingBidan.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setEditingBidan(null);
        editForm.reset();
      },
    });
  };

  const handleToggleStatus = (bidan: BidanItem) => {
    router.patch(route("admin.bidan.toggle-status", { bidan: bidan.id }), {}, {
      preserveScroll: true,
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

  // Definisi Kolom TanStack Table: Nama Bidan | No. STR | No. WhatsApp | Status | Aksi
  const columns = useMemo<ColumnDef<BidanItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Nama Bidan</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const bidan = row.original;
          return (
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 shadow-soft-xs">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div
                className="font-semibold text-slate-900 text-xs sm:text-sm truncate min-w-0 flex-1"
                title={bidan.name}
              >
                {bidan.name}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "no_str",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>No. STR</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-700 font-medium">
            {row.original.no_str || "-"}
          </span>
        ),
      },
      {
        accessorKey: "no_telepon",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>No. WhatsApp</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-xs text-slate-700 font-medium">
            {row.original.no_telepon || "-"}
          </span>
        ),
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Status</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const isActive = row.original.is_active !== false;
          return (
            <span
              className={`inline-flex items-center justify-center gap-1.5 w-[76px] py-0.5 rounded-full text-[11px] font-semibold ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-emerald-600" : "bg-slate-400"
                }`}
              />
              <span>{isActive ? "Aktif" : "Nonaktif"}</span>
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const bidan = row.original;
          const isActive = bidan.is_active !== false;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[150px] p-1.5 rounded-2xl shadow-soft-md border-slate-100 bg-white">
                  <DropdownMenuItem
                    onClick={() => setViewingBidan(bidan)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Lihat Detail
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleOpenEditModal(bidan)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Edit Bidan
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleToggleStatus(bidan)}
                    className={`text-xs font-medium cursor-pointer rounded-xl px-3 py-2 ${
                      isActive
                        ? "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                        : "text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    {isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: bidanList,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const getColumnWidthClass = (id: string) => {
    switch (id) {
      case "name":
        return "w-[32%]";
      case "no_str":
        return "w-[22%]";
      case "no_telepon":
        return "w-[22%]";
      case "is_active":
        return "w-[16%]";
      case "actions":
        return "w-[8%] text-right";
      default:
        return "";
    }
  };

  return (
    <BundaSehatLayout activeNav="admin-bidan">
      <Head title="Manajemen Akun Bidan - BundaSehat" />

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fadeIn">
        
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

        {/* OFFICIAL SHADCN UI DATA TABLE ARCHITECTURE */}
        <div className="w-full space-y-4">
          
          {/* Toolbar: Minimal Search Filter */}
          <div className="flex items-center py-1">
            <Input
              placeholder="Filter data bidan..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm h-9 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
            />
          </div>

          {/* Table Container (Clean Rounded-xl Border) */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="relative w-full overflow-x-auto">
              <Table className="table-fixed w-full caption-bottom text-sm">
                <TableHeader className="bg-white [&_tr]:border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-white border-b border-slate-200 hover:bg-white">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "h-10 px-4 text-left align-middle font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap bg-white",
                            getColumnWidthClass(header.column.id)
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="[&_tr:last-child]:border-0 divide-y divide-slate-100">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "p-4 align-middle whitespace-nowrap text-slate-700",
                              getColumnWidthClass(cell.column.id)
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-xs text-slate-500 font-medium"
                      >
                        {globalFilter
                          ? `Tidak ditemukan akun bidan yang cocok dengan pencarian "${globalFilter}".`
                          : "Belum ada akun Bidan yang didaftarkan."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination / Count Footer */}
          <div className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-500">
            <div>
              Total {table.getFilteredRowModel().rows.length} akun bidan terdaftar.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Berikutnya
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL / DIALOG: LIHAT DETAIL BIDAN */}
      <Dialog
        isOpen={Boolean(viewingBidan)}
        onClose={() => setViewingBidan(null)}
        title="Detail Akun Bidan"
        description="Informasi profil dan penugasan Bidan Wilayah"
      >
        {viewingBidan && (
          <div className="space-y-4 pt-2">
            
            {/* Header Profil Rata Tengah */}
            <div className="flex flex-col items-center text-center py-2 space-y-2">
              <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shadow-soft-xs">
                <User className="h-8 w-8 text-slate-600" />
              </div>
              <div className="space-y-0.5 max-w-sm">
                <h3 className="text-base font-bold text-slate-900 break-words">
                  {viewingBidan.name}
                </h3>
                <p className="text-xs text-slate-500 break-words">
                  {viewingBidan.email}
                </p>
              </div>
            </div>

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Nomor STR</span>
                <p className="font-mono font-semibold text-slate-800">
                  {viewingBidan.no_str || "-"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Status Akun</span>
                <div>
                  {viewingBidan.is_active !== false ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>Nonaktif</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Nomor WhatsApp</span>
                <p className="font-medium text-slate-800">
                  {viewingBidan.no_telepon || "-"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Wilayah Puskesmas</span>
                <p className="font-medium text-slate-800">
                  {viewingBidan.puskesmas_wilayah || "-"}
                </p>
              </div>
            </div>

            {/* Footer Dialog */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setViewingBidan(null)}
                className="rounded-full font-bold text-xs px-5"
              >
                Tutup
              </Button>
            </div>

          </div>
        )}
      </Dialog>

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
            <Label htmlFor="create_name" className="text-xs font-bold text-slate-700">
              Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="create_name"
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
            <Label htmlFor="create_email" className="text-xs font-bold text-slate-700">
              Alamat Email Akun <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="create_email"
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
            <Label htmlFor="create_password" className="text-xs font-bold text-slate-700">
              Password Login <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="create_password"
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
            <Label htmlFor="create_str" className="text-xs font-bold text-slate-700">
              Nomor STR Bidan <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="create_str"
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
            <Label htmlFor="create_puskesmas" className="text-xs font-bold text-slate-700">
              Wilayah Penugasan Puskesmas <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="create_puskesmas"
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
            <Label htmlFor="create_phone" className="text-xs font-bold text-slate-700">
              Nomor WhatsApp / Kontak
            </Label>
            <Input
              id="create_phone"
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

      {/* MODAL / DIALOG: EDIT DATA BIDAN */}
      <Dialog
        isOpen={Boolean(editingBidan)}
        onClose={() => setEditingBidan(null)}
        title="Edit Data Bidan"
        description="Perbarui informasi akun dan data STR Bidan"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-1">
          
          {/* Field 1: Nama Lengkap */}
          <div>
            <Label htmlFor="edit_name" className="text-xs font-bold text-slate-700">
              Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="edit_name"
              type="text"
              placeholder="Contoh: Bidan Siti Rahayu, S.Tr.Keb"
              value={editForm.data.name}
              onChange={(e) => editForm.setData("name", e.target.value)}
              className="mt-1"
              required
            />
            {editForm.errors.name && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.name}</p>
            )}
          </div>

          {/* Field 2: Email Login */}
          <div>
            <Label htmlFor="edit_email" className="text-xs font-bold text-slate-700">
              Alamat Email Akun <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="edit_email"
              type="email"
              placeholder="bidan.siti@puskesmas.go.id"
              value={editForm.data.email}
              onChange={(e) => editForm.setData("email", e.target.value)}
              className="mt-1"
              required
            />
            {editForm.errors.email && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.email}</p>
            )}
          </div>

          {/* Field 3: Password Akun (Opsional) */}
          <div>
            <Label htmlFor="edit_password" className="text-xs font-bold text-slate-700">
              Password Baru <span className="text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>
            </Label>
            <Input
              id="edit_password"
              type="password"
              placeholder="Minimal 8 karakter baru"
              value={editForm.data.password}
              onChange={(e) => editForm.setData("password", e.target.value)}
              className="mt-1"
            />
            {editForm.errors.password && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.password}</p>
            )}
          </div>

          {/* Field 4: No. STR Bidan */}
          <div>
            <Label htmlFor="edit_str" className="text-xs font-bold text-slate-700">
              Nomor STR Bidan <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="edit_str"
              type="text"
              placeholder="Contoh: STR-BDN-2026-0912"
              value={editForm.data.no_str}
              onChange={(e) => editForm.setData("no_str", e.target.value)}
              className="mt-1"
              required
            />
            {editForm.errors.no_str && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.no_str}</p>
            )}
          </div>

          {/* Field 5: Wilayah Puskesmas */}
          <div>
            <Label htmlFor="edit_puskesmas" className="text-xs font-bold text-slate-700">
              Wilayah Penugasan Puskesmas
            </Label>
            <Input
              id="edit_puskesmas"
              type="text"
              placeholder="Contoh: Puskesmas Kecamatan Cilandak"
              value={editForm.data.puskesmas_wilayah}
              onChange={(e) => editForm.setData("puskesmas_wilayah", e.target.value)}
              className="mt-1"
            />
            {editForm.errors.puskesmas_wilayah && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.puskesmas_wilayah}</p>
            )}
          </div>

          {/* Field 6: No. WhatsApp / Telepon */}
          <div>
            <Label htmlFor="edit_phone" className="text-xs font-bold text-slate-700">
              Nomor WhatsApp / Kontak
            </Label>
            <Input
              id="edit_phone"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={editForm.data.no_telepon}
              onChange={(e) => editForm.setData("no_telepon", e.target.value)}
              className="mt-1"
            />
            {editForm.errors.no_telepon && (
              <p className="text-[11px] text-rose-500 mt-1 pl-3">{editForm.errors.no_telepon}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setEditingBidan(null)}
              className="rounded-full font-bold text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              size="default"
              isLoading={editForm.processing}
              disabled={editForm.processing}
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm"
            >
              <Pencil className="h-4 w-4" />
              <span>Simpan Perubahan</span>
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
