import React, { useState, useMemo } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs } from "@/Components/ui/tabs";
import { Dialog } from "@/Components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/Components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Video,
  PlayCircle,
  Clock,
  MoreHorizontal,
  ArrowUpDown,
  BookOpen,
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
import { cn } from "@/lib/utils";
import { PageProps } from "@/types";
import { RichTextEditor } from "@/Components/ui/rich-text-editor";

interface AdminArticle {
  id: number;
  type: string;
  letter: string;
  title: string;
  category: string;
  content?: string;
  summary: string;
  first_aid: string;
  is_published: boolean;
  created_at: string;
}

interface AdminVideo {
  id: number;
  type: string;
  title: string;
  category: string;
  video_badge: string;
  instructor: string;
  youtube_id: string;
  duration: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

interface StatsData {
  total_articles: number;
  total_videos: number;
  total_categories: number;
}

type AdminKamusPageProps = PageProps<{
  articles: AdminArticle[];
  videos: AdminVideo[];
  stats: StatsData;
}>;

interface ArticleFormData {
  type: "article";
  title: string;
  category: string;
  letter: string;
  content: string;
  summary?: string;
  first_aid?: string;
  is_published: boolean;
}

interface VideoFormData {
  type: "video";
  title: string;
  category: string;
  video_badge: string;
  instructor: string;
  youtube_id: string;
  duration: string;
  description: string;
  is_published: boolean;
}

export default function AdminKamusIndex() {
  const { articles = [], videos = [], flash } = usePage<AdminKamusPageProps>().props;

  const [activeTab, setActiveTab] = useState<string>("articles");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [articleSorting, setArticleSorting] = useState<SortingState>([]);
  const [videoSorting, setVideoSorting] = useState<SortingState>([]);

  // Modals state
  const [viewingArticle, setViewingArticle] = useState<AdminArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string; type: "article" | "video" } | null>(null);

  // Article Form (Menggunakan Single Rich Text Editor)
  const articleForm = useForm<ArticleFormData>({
    type: "article",
    title: "",
    category: "",
    letter: "",
    content: "",
    summary: "",
    first_aid: "",
    is_published: true,
  });

  // Video Form
  const videoForm = useForm<VideoFormData>({
    type: "video",
    title: "",
    category: "",
    video_badge: "TERAPI FISIK",
    instructor: "",
    youtube_id: "",
    duration: "",
    description: "",
    is_published: true,
  });

  // Open Create Article Modal
  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    articleForm.reset();
    articleForm.setData({
      type: "article",
      title: "",
      category: "",
      letter: "",
      content: "",
      summary: "",
      first_aid: "",
      is_published: true,
    });
    articleForm.clearErrors();
    setIsArticleModalOpen(true);
  };

  // Open Edit Article Modal
  const handleOpenEditArticle = (art: AdminArticle) => {
    setEditingArticle(art);
    // Backward compatibility: jika artikel lama belum punya field content, generate dari summary + first_aid
    let initialContent = art.content || "";
    if (!initialContent && (art.summary || art.first_aid)) {
      initialContent = `<h2>Pengertian &amp; Gejala Medis</h2><p>${art.summary || ""}</p><h2>Pertolongan Pertama Mandiri</h2><p>${art.first_aid || ""}</p>`;
    }

    articleForm.setData({
      type: "article",
      title: art.title,
      category: art.category,
      letter: art.letter || art.title.trim().charAt(0).toUpperCase(),
      content: initialContent,
      summary: art.summary || "",
      first_aid: art.first_aid || "",
      is_published: art.is_published,
    });
    articleForm.clearErrors();
    setIsArticleModalOpen(true);
  };

  // Submit Article Form (Otomatis ambil letter dari huruf pertama judul)
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const computedLetter = articleForm.data.title.trim().charAt(0).toUpperCase() || "A";
    articleForm.transform((data) => ({
      ...data,
      letter: computedLetter,
    }));

    if (editingArticle) {
      articleForm.put(`/admin/kamus/${editingArticle.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        },
      });
    } else {
      articleForm.post("/admin/kamus", {
        preserveScroll: true,
        onSuccess: () => {
          setIsArticleModalOpen(false);
          articleForm.reset();
        },
      });
    }
  };

  // Open Create Video Modal
  const handleOpenCreateVideo = () => {
    setEditingVideo(null);
    videoForm.reset();
    videoForm.clearErrors();
    setIsVideoModalOpen(true);
  };

  // Open Edit Video Modal
  const handleOpenEditVideo = (vid: AdminVideo) => {
    setEditingVideo(vid);
    videoForm.setData({
      type: "video",
      title: vid.title,
      category: vid.category,
      video_badge: vid.video_badge,
      instructor: vid.instructor,
      youtube_id: vid.youtube_id,
      duration: vid.duration,
      description: vid.description,
      is_published: vid.is_published,
    });
    videoForm.clearErrors();
    setIsVideoModalOpen(true);
  };

  // Submit Video Form
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      videoForm.put(`/admin/kamus/${editingVideo.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        },
      });
    } else {
      videoForm.post("/admin/kamus", {
        preserveScroll: true,
        onSuccess: () => {
          setIsVideoModalOpen(false);
          videoForm.reset();
        },
      });
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/kamus/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  // Definisi Kolom Tabel Artikel: Judul Istilah & Komplikasi | Kategori Medis | Aksi
  const articleColumns = useMemo<ColumnDef<AdminArticle>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Judul Istilah &amp; Komplikasi</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const art = row.original;
          return (
            <div className="min-w-0 pr-2 space-y-0.5">
              <div
                className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={art.title}
              >
                {art.title}
              </div>
              <div
                className="text-[11px] text-slate-500 whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={art.summary}
              >
                {art.summary}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Kategori Medis</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {row.original.category}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const art = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px] p-1.5 rounded-2xl shadow-soft-md border-slate-100 bg-white">
                  <DropdownMenuItem
                    onClick={() => setViewingArticle(art)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleOpenEditArticle(art)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Edit Artikel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget({ id: art.id, title: art.title, type: "article" })}
                    className="text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Hapus Artikel
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

  // Definisi Kolom Tabel Video
  const videoColumns = useMemo<ColumnDef<AdminVideo>[]>(
    () => [
      {
        accessorKey: "youtube_id",
        header: () => <span>Preview</span>,
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shadow-soft-xs shrink-0">
              <img
                src={`https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`}
                alt={vid.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                <PlayCircle className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Judul Video Terapi</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="min-w-0 pr-2 space-y-0.5">
              <div
                className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={vid.title}
              >
                {vid.title}
              </div>
              <div
                className="text-[11px] text-slate-500 whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent_100%)]"
                title={vid.description}
              >
                {vid.description}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Badge &amp; Kategori</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold tracking-wider uppercase">
                {vid.video_badge}
              </span>
              <div className="text-[11px] text-slate-600 font-medium">{vid.category}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "instructor",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 text-slate-900 font-semibold text-xs sm:text-sm hover:text-slate-700 focus:outline-none transition-colors group"
          >
            <span>Instruktur &amp; Durasi</span>
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        ),
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div>
              <div className="font-semibold text-slate-800 text-xs">{vid.instructor}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" />
                <span>{vid.duration}</span>
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row }) => {
          const vid = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px] p-1.5 rounded-2xl shadow-soft-md border-slate-100 bg-white">
                  <DropdownMenuItem
                    onClick={() => handleOpenEditVideo(vid)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Edit Video
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget({ id: vid.id, title: vid.title, type: "video" })}
                    className="text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer rounded-xl px-3 py-2"
                  >
                    Hapus Video
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

  const articleTable = useReactTable({
    data: articles,
    columns: articleColumns,
    state: {
      globalFilter,
      sorting: articleSorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setArticleSorting,
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

  const videoTable = useReactTable({
    data: videos,
    columns: videoColumns,
    state: {
      globalFilter,
      sorting: videoSorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setVideoSorting,
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

  const getArticleColumnWidthClass = (id: string) => {
    switch (id) {
      case "title":
        return "w-[68%]";
      case "category":
        return "w-[24%]";
      case "actions":
        return "w-[8%] text-right";
      default:
        return "";
    }
  };

  const getVideoColumnWidthClass = (id: string) => {
    switch (id) {
      case "youtube_id":
        return "w-[12%]";
      case "title":
        return "w-[38%]";
      case "category":
        return "w-[22%]";
      case "instructor":
        return "w-[20%]";
      case "actions":
        return "w-[8%] text-right";
      default:
        return "";
    }
  };

  return (
    <BundaSehatLayout activeNav="kamus">
      <Head title="Kelola Kamus Kesehatan - BundaSehat" />

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
              Kelola Kamus Kesehatan
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="default"
              size="default"
              onClick={activeTab === "articles" ? handleOpenCreateArticle : handleOpenCreateVideo}
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5 shadow-soft-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </Button>
          </div>
        </div>

        {/* TABS & SEARCH BAR TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <Tabs
            items={[
              { id: "articles", label: `Kamus Artikel (${articles.length})`, icon: <FileText className="h-4 w-4" /> },
              { id: "videos", label: `Video Terapi (${videos.length})`, icon: <Video className="h-4 w-4" /> },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setGlobalFilter("");
            }}
          />

          <Input
            placeholder={activeTab === "articles" ? "Filter artikel..." : "Filter video..."}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm h-9 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>

        {/* TAB 1: ARTIKEL A-Z */}
        {activeTab === "articles" && (
          <div className="w-full space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative w-full overflow-x-auto">
                <Table className="table-fixed w-full caption-bottom text-sm">
                  <TableHeader className="bg-white [&_tr]:border-b">
                    {articleTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="bg-white border-b border-slate-200 hover:bg-white">
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "h-10 px-4 text-left align-middle font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap bg-white",
                              getArticleColumnWidthClass(header.column.id)
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
                    {articleTable.getRowModel().rows?.length ? (
                      articleTable.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "p-4 align-middle whitespace-nowrap text-slate-700",
                                getArticleColumnWidthClass(cell.column.id)
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
                          colSpan={articleColumns.length}
                          className="h-24 text-center text-xs text-slate-500 font-medium"
                        >
                          {globalFilter
                            ? `Tidak ditemukan artikel yang cocok dengan pencarian "${globalFilter}".`
                            : "Belum ada artikel kamus istilah medis yang ditambahkan."}
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
                Total {articleTable.getFilteredRowModel().rows.length} artikel terdaftar.
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => articleTable.previousPage()}
                  disabled={!articleTable.getCanPreviousPage()}
                  className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Sebelumnya
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => articleTable.nextPage()}
                  disabled={!articleTable.getCanNextPage()}
                  className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEO TERAPI */}
        {activeTab === "videos" && (
          <div className="w-full space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative w-full overflow-x-auto">
                <Table className="table-fixed w-full caption-bottom text-sm">
                  <TableHeader className="bg-white [&_tr]:border-b">
                    {videoTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="bg-white border-b border-slate-200 hover:bg-white">
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className={cn(
                              "h-10 px-4 text-left align-middle font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap bg-white",
                              getVideoColumnWidthClass(header.column.id)
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
                    {videoTable.getRowModel().rows?.length ? (
                      videoTable.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "p-4 align-middle whitespace-nowrap text-slate-700",
                                getVideoColumnWidthClass(cell.column.id)
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
                          colSpan={videoColumns.length}
                          className="h-24 text-center text-xs text-slate-500 font-medium"
                        >
                          {globalFilter
                            ? `Tidak ditemukan video yang cocok dengan pencarian "${globalFilter}".`
                            : "Belum ada video terapi komplementer yang ditambahkan."}
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
                Total {videoTable.getFilteredRowModel().rows.length} video terdaftar.
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => videoTable.previousPage()}
                  disabled={!videoTable.getCanPreviousPage()}
                  className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Sebelumnya
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => videoTable.nextPage()}
                  disabled={!videoTable.getCanNextPage()}
                  className="rounded-full font-bold text-xs h-8 px-3.5 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DRAWER 1: LIVE PREVIEW DETAIL ARTIKEL (IDENTIK 1:1 DENGAN HALAMAN /kamus) */}
      <Drawer
        open={Boolean(viewingArticle)}
        onOpenChange={(open) => {
          if (!open) setViewingArticle(null);
        }}
        modal={false}
        disablePointerDismissal
        swipeDirection="right"
      >
        <DrawerContent>
          {viewingArticle && (
            <div className="flex flex-col h-full">
              
              {/* Header Drawer (Official Shadcn p-4 pb-0) */}
              <DrawerHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {viewingArticle.category}
                  </span>
                </div>
                <DrawerTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-2">
                  {viewingArticle.title}
                </DrawerTitle>
              </DrawerHeader>

              {/* Body Drawer (Official Shadcn p-4 flex-1 overflow-y-auto) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {viewingArticle.content && viewingArticle.content.trim() !== "" ? (
                  <div
                    className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-3.5 [&_h2]:mb-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-slate-600 [&_hr]:my-3 [&_hr]:border-slate-200"
                    dangerouslySetInnerHTML={{ __html: viewingArticle.content }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">Konten artikel belum ditambahkan.</p>
                  </div>
                )}
              </div>

              {/* Footer Drawer (Official Shadcn p-4 pt-0 mt-auto) */}
              <DrawerFooter className="pt-2 border-t border-slate-100 flex-row justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setViewingArticle(null)}
                  className="rounded-full font-bold text-xs px-5"
                >
                  Tutup
                </Button>
              </DrawerFooter>

            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* DRAWER 2: FORM TAMBAH / EDIT ARTIKEL (RICH TEXT WRITING SURFACE) */}
      <Drawer
        open={isArticleModalOpen}
        onOpenChange={setIsArticleModalOpen}
        swipeDirection="right"
      >
        <DrawerContent>
          <form onSubmit={handleArticleSubmit} className="flex flex-col h-full">
            {/* Header Drawer (Official Shadcn p-4 pb-0) */}
            <DrawerHeader className="pb-3 border-b border-slate-100">
              <DrawerTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {editingArticle ? "Edit Artikel Istilah Medis" : "Tambah Artikel Istilah Medis"}
              </DrawerTitle>
              <DrawerDescription className="text-xs text-slate-500 mt-0.5">
                Lengkapi metadata dan susun konten artikel komplikasi klinis
              </DrawerDescription>
            </DrawerHeader>

            {/* Body Form (Official Shadcn p-4 flex-1 overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Baris Metadata: Judul Istilah & Kategori Medis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="article_title" className="text-xs font-bold text-slate-700">
                    Judul Istilah / Komplikasi <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="article_title"
                    type="text"
                    placeholder="Contoh: Abortus Imminens"
                    value={articleForm.data.title}
                    onChange={(e) => articleForm.setData("title", e.target.value)}
                    className="mt-1"
                    required
                  />
                  {articleForm.errors.title && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{articleForm.errors.title}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="article_category" className="text-xs font-bold text-slate-700">
                    Kategori Medis <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="article_category"
                    type="text"
                    placeholder="Contoh: Komplikasi Umum / Gawat Darurat T1"
                    value={articleForm.data.category}
                    onChange={(e) => articleForm.setData("category", e.target.value)}
                    className="mt-1"
                    required
                  />
                  {articleForm.errors.category && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{articleForm.errors.category}</p>
                  )}
                </div>
              </div>

              {/* Konten: Single Rich Text Editor Besar */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Isi Artikel &amp; Panduan Klinis <span className="text-rose-500">*</span>
                </Label>
                <RichTextEditor
                  content={articleForm.data.content}
                  onChange={(html) => articleForm.setData("content", html)}
                  minHeight="min-h-[280px]"
                  placeholder="Tuliskan pengertian medis, gejala klinis yang perlu diperhatikan, serta langkah pertolongan pertama mandiri..."
                />
                {articleForm.errors.content && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{articleForm.errors.content}</p>
                )}
              </div>
            </div>

            {/* Footer Drawer (Official Shadcn p-4 pt-0 mt-auto) */}
            <DrawerFooter className="pt-3 border-t border-slate-100 flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setIsArticleModalOpen(false)}
                className="rounded-full text-xs font-bold px-5"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="default"
                size="default"
                isLoading={articleForm.processing}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6"
              >
                {editingArticle ? "Simpan Perubahan" : "Tambahkan Artikel"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      {/* MODAL 2: FORM TAMBAH / EDIT VIDEO TERAPI */}
      <Dialog
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={editingVideo ? "Edit Video Terapi Komplementer" : "Tambah Video Terapi Komplementer"}
        description="Katalog video panduan terapi non-obat untuk ibu hamil"
        className="max-w-lg"
      >
        <form onSubmit={handleVideoSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="video_title" className="text-xs font-bold text-slate-700">
              Judul Video Terapi <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="video_title"
              type="text"
              placeholder="Contoh: Teknik Pijat Oxytocin Ibu Hamil &amp; Pelancar ASI"
              value={videoForm.data.title}
              onChange={(e) => videoForm.setData("title", e.target.value)}
              className="mt-1"
              required
            />
            {videoForm.errors.title && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">{videoForm.errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="video_badge" className="text-xs font-bold text-slate-700">
                Badge Label <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="video_badge"
                type="text"
                placeholder="TERAPI FISIK / SENAM HAMIL"
                value={videoForm.data.video_badge}
                onChange={(e) => videoForm.setData("video_badge", e.target.value.toUpperCase())}
                className="mt-1 uppercase"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_category" className="text-xs font-bold text-slate-700">
                Kategori / Fase <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="video_category"
                type="text"
                placeholder="Trimester 3 · Laktasi"
                value={videoForm.data.category}
                onChange={(e) => videoForm.setData("category", e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="video_youtube_id" className="text-xs font-bold text-slate-700">
                Link YouTube / Video ID <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="video_youtube_id"
                type="text"
                placeholder="https://youtu.be/xxx atau ID"
                value={videoForm.data.youtube_id}
                onChange={(e) => videoForm.setData("youtube_id", e.target.value)}
                className="mt-1"
                required
              />
              {videoForm.errors.youtube_id && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{videoForm.errors.youtube_id}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_duration" className="text-xs font-bold text-slate-700">
                Durasi Video <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="video_duration"
                type="text"
                placeholder="08:34"
                value={videoForm.data.duration}
                onChange={(e) => videoForm.setData("duration", e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="video_instructor" className="text-xs font-bold text-slate-700">
              Nama Bidan / Instruktur <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="video_instructor"
              type="text"
              placeholder="Bidan Asih, S.ST., M.Keb"
              value={videoForm.data.instructor}
              onChange={(e) => videoForm.setData("instructor", e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="video_description" className="text-xs font-bold text-slate-700">
              Deskripsi &amp; Manfaat Terapi
            </Label>
            <textarea
              id="video_description"
              rows={3}
              placeholder="Jelaskan gerakan yang diajarkan, persiapan yang diperlukan, serta manfaat terapeutik untuk ibu hamil..."
              value={videoForm.data.description}
              onChange={(e) => videoForm.setData("description", e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setIsVideoModalOpen(false)}
              className="rounded-full text-xs font-bold px-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              size="default"
              isLoading={videoForm.processing}
              className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5"
            >
              {editingVideo ? "Simpan Perubahan" : "Tambahkan Video"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL 3: KONFIRMASI HAPUS */}
      <Dialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        showCloseButton={false}
        className="max-w-md text-center p-6 sm:p-7"
      >
        <div className="space-y-5">
          <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">
              Hapus {deleteTarget?.type === "article" ? "Artikel Istilah" : "Video Terapi"}?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-800 font-bold">"{deleteTarget?.title}"</strong>? Data yang telah dihapus tidak dapat dipulihkan kembali.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setDeleteTarget(null)}
              className="rounded-full font-bold text-xs px-5"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="default"
              onClick={handleConfirmDelete}
              className="rounded-full font-bold text-xs px-5"
            >
              Ya, Hapus Data
            </Button>
          </div>
        </div>
      </Dialog>

    </BundaSehatLayout>
  );
}
