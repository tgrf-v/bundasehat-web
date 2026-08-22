import React from "react";
import { Link, router } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { History, ArrowLeft, Inbox } from "lucide-react";
import { ScreeningResult } from "@/types/screening";

interface ProfilRiwayatTableProps {
  screenings: ScreeningResult[];
  onBack: () => void;
}

export function ProfilRiwayatTable({
  screenings,
  onBack,
}: ProfilRiwayatTableProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between relative py-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg flex-1 text-center pr-6">
          Riwayat Skrining Kesehatan
        </h2>
      </div>

      <Card className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-0">
        <CardHeader className="border-b border-slate-100 p-6">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-rose-600" />
            <span>Daftar Pemantauan Skoring Risiko</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Riwayat penentuan skor Poedji Rochjati pada kehamilan & persalinan Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {screenings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-bold">Tanggal</TableHead>
                  <TableHead className="text-xs font-bold">Jenis</TableHead>
                  <TableHead className="text-xs font-bold">Skor</TableHead>
                  <TableHead className="text-xs font-bold text-right">Status Risiko</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screenings.map((s: ScreeningResult) => (
                  <TableRow
                    key={s.kode_screening}
                    className="cursor-pointer hover:bg-slate-50/70 transition-colors"
                    onClick={() => {
                      if (s.id) {
                        router.visit(route("screening.show", { screening: s.id }));
                      }
                    }}
                  >
                    <TableCell className="text-xs font-semibold text-slate-800">
                      {s.created_at}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">
                      {s.input_summary?.tipe_screening === "kehamilan" ? "Kehamilan" : "Persalinan"}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
                      {s.skor_poedji_rochjati || s.total_skor} Poin
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={s.tingkat_risiko === "Berat" ? "berat" : s.tingkat_risiko === "Sedang" ? "sedang" : "ringan"}
                        className="text-[10px]"
                      >
                        {s.tingkat_risiko}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Belum Ada Riwayat</p>
                <p className="text-xs text-slate-500 mt-0.5">Anda belum pernah melakukan screening. Mulai screening pertama Anda sekarang.</p>
              </div>
              <Link href="/screening/kehamilan">
                <Button variant="default" size="sm" className="gap-1.5 text-xs font-bold mt-1">
                  Mulai Screening
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
