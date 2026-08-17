import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { BundaSehatLayout } from "@/Layouts/BundaSehatLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Tabs } from "@/Components/ui/tabs";
import { Dialog } from "@/Components/ui/dialog";
import {
  BookOpen,
  Video,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  PlayCircle,
  Clock,
  UserCheck,
  Tag,
  Eye,
} from "lucide-react";

interface AdminArticle {
  id: number;
  type: string;
  letter: string;
  title: string;
  category: string;
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

interface Props {
  articles: AdminArticle[];
  videos: AdminVideo[];
  stats: StatsData;
  flash?: {
    success?: string;
    error?: string;
  };
}

interface ArticleFormData {
  type: "article";
  title: string;
  category: string;
  letter: string;
  summary: string;
  first_aid: string;
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

export default function AdminKamusIndex({ articles, videos, stats, flash }: Props) {
  const [activeTab, setActiveTab] = useState<string>("articles");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string; type: "article" | "video" } | null>(null);

  // Article Form
  const articleForm = useForm<ArticleFormData>({
    type: "article",
    title: "",
    category: "",
    letter: "",
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
    articleForm.clearErrors();
    setIsArticleModalOpen(true);
  };

  // Open Edit Article Modal
  const handleOpenEditArticle = (art: AdminArticle) => {
    setEditingArticle(art);
    articleForm.setData({
      type: "article",
      title: art.title,
      category: art.category,
      letter: art.letter,
      summary: art.summary,
      first_aid: art.first_aid,
      is_published: art.is_published,
    });
    articleForm.clearErrors();
    setIsArticleModalOpen(true);
  };

  // Submit Article Form
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      articleForm.put(`/admin/kamus/${editingArticle.id}`, {
        onSuccess: () => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        },
      });
    } else {
      articleForm.post("/admin/kamus", {
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
        onSuccess: () => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        },
      });
    } else {
      videoForm.post("/admin/kamus", {
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
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  // Filtered lists
  const filteredArticles = articles.filter((art) => {
    return (
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredVideos = videos.filter((vid) => {
    return (
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <BundaSehatLayout activeNav="kamus">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
        
        {/* Flash Message Notification */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-soft-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Manajemen Kamus Kesehatan &amp; Video Terapi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl leading-relaxed">
              Kelola daftar istilah komplikasi kebidanan A-Z, panduan pertolongan pertama, serta katalog video terapi komplementer non-obat.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "articles" ? (
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleOpenCreateArticle}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-2 shadow-soft-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Artikel A-Z</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleOpenCreateVideo}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-2 shadow-soft-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Video Terapi</span>
              </Button>
            )}
          </div>
        </div>

        {/* BENTO STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Artikel Istilah</span>
              <div className="text-2xl font-bold text-slate-900">{stats.total_articles}</div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-soft-xs">
              <FileText className="h-6 w-6" />
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Video Terapi</span>
              <div className="text-2xl font-bold text-slate-900">{stats.total_videos}</div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-soft-xs">
              <Video className="h-6 w-6" />
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kategori Medis</span>
              <div className="text-2xl font-bold text-slate-900">{stats.total_categories}</div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-soft-xs">
              <Tag className="h-6 w-6" />
            </div>
          </Card>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Tabs
            items={[
              { id: "articles", label: `Kamus Artikel (${articles.length})`, icon: <FileText className="h-4 w-4" /> },
              { id: "videos", label: `Video Terapi (${videos.length})`, icon: <Video className="h-4 w-4" /> },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId)}
          />

          <div className="w-full sm:w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari judul, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-slate-200 bg-white text-xs shadow-soft-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* TAB 1: ARTIKEL A-Z */}
        {activeTab === "articles" && (
          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Tidak ada artikel ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada artikel istilah medis yang cocok dengan pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCreateArticle}
                  className="rounded-full mt-2 font-bold text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Artikel Sekarang
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">Huruf</th>
                      <th className="py-3.5 px-4">Judul Istilah &amp; Komplikasi</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Pertolongan Pertama Mandiri</th>
                      <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-rose-50 text-rose-700 font-bold text-xs">
                            {art.letter}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">{art.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{art.summary}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="rounded-full bg-slate-50 border-slate-200 text-[10px] font-bold">
                            {art.category}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-slate-600 line-clamp-1">{art.first_aid || "-"}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditArticle(art)}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                              title="Edit Artikel"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget({ id: art.id, title: art.title, type: "article" })}
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* TAB 2: VIDEO TERAPI */}
        {activeTab === "videos" && (
          <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <Video className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Tidak ada video ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Belum ada video terapi komplementer yang cocok dengan pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCreateVideo}
                  className="rounded-full mt-2 font-bold text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Video Sekarang
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4 w-28">Preview</th>
                      <th className="py-3.5 px-4">Judul Video Terapi</th>
                      <th className="py-3.5 px-4">Badge / Kategori</th>
                      <th className="py-3.5 px-4">Instruktur &amp; Durasi</th>
                      <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredVideos.map((vid) => (
                      <tr key={vid.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-slate-900 shadow-soft-xs shrink-0">
                            <img
                              src={`https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                              <PlayCircle className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">{vid.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{vid.description}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold tracking-wider uppercase">
                              {vid.video_badge}
                            </span>
                            <div className="text-[10px] text-rose-600 font-semibold">{vid.category}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{vid.instructor}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{vid.duration}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditVideo(vid)}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                              title="Edit Video"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget({ id: vid.id, title: vid.title, type: "video" })}
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              title="Hapus Video"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* MODAL 1: FORM TAMBAH / EDIT ARTIKEL */}
        <Dialog
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          title={editingArticle ? "Edit Artikel Istilah Medis" : "Tambah Artikel Istilah Medis"}
          className="max-w-lg"
        >
          <form onSubmit={handleArticleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Istilah / Komplikasi *</label>
              <Input
                type="text"
                placeholder="Contoh: Anemia pada Ibu Hamil"
                value={articleForm.data.title}
                onChange={(e) => articleForm.setData("title", e.target.value)}
                className="h-10 rounded-full border-slate-200 text-xs"
                required
              />
              {articleForm.errors.title && (
                <p className="text-[11px] text-red-600 font-medium">{articleForm.errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori Medis *</label>
                <Input
                  type="text"
                  placeholder="Contoh: Komplikasi Umum"
                  value={articleForm.data.category}
                  onChange={(e) => articleForm.setData("category", e.target.value)}
                  className="h-10 rounded-full border-slate-200 text-xs"
                  required
                />
                {articleForm.errors.category && (
                  <p className="text-[11px] text-red-600 font-medium">{articleForm.errors.category}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Huruf Alfabet (Otomatis)</label>
                <Input
                  type="text"
                  maxLength={1}
                  placeholder="A"
                  value={articleForm.data.letter}
                  onChange={(e) => articleForm.setData("letter", e.target.value.toUpperCase())}
                  className="h-10 rounded-full border-slate-200 text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pengertian &amp; Gejala Medis *</label>
              <textarea
                rows={3}
                placeholder="Jelaskan kondisi klinis, batas parameter (misal: Hb < 11 g/dL), serta gejala yang dirasakan..."
                value={articleForm.data.summary}
                onChange={(e) => articleForm.setData("summary", e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                required
              />
              {articleForm.errors.summary && (
                <p className="text-[11px] text-red-600 font-medium">{articleForm.errors.summary}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pertolongan Pertama Mandiri *</label>
              <textarea
                rows={3}
                placeholder="Langkah edukasi mandiri (misal: posisi tidur miring kiri, suplemen TTD + vit C, dll)..."
                value={articleForm.data.first_aid}
                onChange={(e) => articleForm.setData("first_aid", e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                required
              />
              {articleForm.errors.first_aid && (
                <p className="text-[11px] text-red-600 font-medium">{articleForm.errors.first_aid}</p>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsArticleModalOpen(false)}
                className="rounded-full text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={articleForm.processing}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                {editingArticle ? "Simpan Perubahan" : "Tambahkan Artikel"}
              </Button>
            </div>
          </form>
        </Dialog>

        {/* MODAL 2: FORM TAMBAH / EDIT VIDEO TERAPI */}
        <Dialog
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title={editingVideo ? "Edit Video Terapi Komplementer" : "Tambah Video Terapi Komplementer"}
          className="max-w-lg"
        >
          <form onSubmit={handleVideoSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Video Terapi *</label>
              <Input
                type="text"
                placeholder="Contoh: Teknik Pijat Oxytocin Ibu Hamil & Pelancar ASI"
                value={videoForm.data.title}
                onChange={(e) => videoForm.setData("title", e.target.value)}
                className="h-10 rounded-full border-slate-200 text-xs"
                required
              />
              {videoForm.errors.title && (
                <p className="text-[11px] text-red-600 font-medium">{videoForm.errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Badge Label *</label>
                <Input
                  type="text"
                  placeholder="TERAPI FISIK / SENAM HAMIL"
                  value={videoForm.data.video_badge}
                  onChange={(e) => videoForm.setData("video_badge", e.target.value.toUpperCase())}
                  className="h-10 rounded-full border-slate-200 text-xs uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori / Fase *</label>
                <Input
                  type="text"
                  placeholder="Trimester 3 · Laktasi"
                  value={videoForm.data.category}
                  onChange={(e) => videoForm.setData("category", e.target.value)}
                  className="h-10 rounded-full border-slate-200 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Link YouTube / Video ID *</label>
                <Input
                  type="text"
                  placeholder="https://youtu.be/xxx atau ID"
                  value={videoForm.data.youtube_id}
                  onChange={(e) => videoForm.setData("youtube_id", e.target.value)}
                  className="h-10 rounded-full border-slate-200 text-xs"
                  required
                />
                {videoForm.errors.youtube_id && (
                  <p className="text-[11px] text-red-600 font-medium">{videoForm.errors.youtube_id}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Durasi Video *</label>
                <Input
                  type="text"
                  placeholder="08:34"
                  value={videoForm.data.duration}
                  onChange={(e) => videoForm.setData("duration", e.target.value)}
                  className="h-10 rounded-full border-slate-200 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Bidan / Instruktur *</label>
              <Input
                type="text"
                placeholder="Bidan Asih, S.ST., M.Keb"
                value={videoForm.data.instructor}
                onChange={(e) => videoForm.setData("instructor", e.target.value)}
                className="h-10 rounded-full border-slate-200 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Deskripsi &amp; Manfaat Terapi</label>
              <textarea
                rows={3}
                placeholder="Jelaskan gerakan yang diajarkan, persiapan yang diperlukan, serta manfaat terapeutik untuk ibu hamil..."
                value={videoForm.data.description}
                onChange={(e) => videoForm.setData("description", e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsVideoModalOpen(false)}
                className="rounded-full text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                isLoading={videoForm.processing}
                className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
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
          title="Konfirmasi Hapus Data"
          className="max-w-md"
        >
          <div className="space-y-4 pt-1 text-xs text-slate-700">
            <p className="leading-relaxed">
              Apakah Anda yakin ingin menghapus {deleteTarget?.type === "article" ? "artikel" : "video"}{" "}
              <strong className="text-slate-900 font-bold">"{deleteTarget?.title}"</strong>?
            </p>
            <p className="text-[11px] text-slate-500">
              Data yang sudah dihapus tidak dapat dipulihkan kembali.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="rounded-full text-xs font-bold"
              >
                Ya, Hapus Data
              </Button>
            </div>
          </div>
        </Dialog>

      </div>
    </BundaSehatLayout>
  );
}
