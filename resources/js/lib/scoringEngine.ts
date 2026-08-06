import { ScreeningInput, ScreeningResult, RiskLevel, DetailSkorFactor } from "@/types/screening";

export function calculateGestationalAge(hphtString?: string): {
  weeks: number;
  dueDate?: string;
} {
  if (!hphtString) return { weeks: 0 };
  try {
    const hpht = new Date(hphtString);
    if (isNaN(hpht.getTime())) return { weeks: 0 };

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - hpht.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);

    // Naegele's rule: HPHT + 7 days - 3 months + 1 year
    const hpl = new Date(hpht);
    hpl.setDate(hpl.getDate() + 7);
    hpl.setMonth(hpl.getMonth() - 3);
    hpl.setFullYear(hpl.getFullYear() + 1);

    const formattedDate = hpl.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return { weeks: Math.max(0, weeks), dueDate: formattedDate };
  } catch (error) {
    return { weeks: 0 };
  }
}

export function calculateMAP(sistolik: number, diastolik: number): number {
  if (sistolik <= 0 || diastolik <= 0) return 0;
  return Number(((sistolik + 2 * diastolik) / 3).toFixed(2));
}

export function evaluateScreening(input: ScreeningInput): ScreeningResult {
  let score = 2; // Initial score for pregnant mothers
  const komplikasi: string[] = [];
  const detailSkorList: DetailSkorFactor[] = [
    { deskripsi: "Skor Awal Ibu Hamil (KSPR)", skor: 2 }
  ];

  // Age & Parity evaluation
  if (input.umur < 20) {
    score += 4;
    komplikasi.push("Usia Terlalu Muda (<20 Tahun)");
    detailSkorList.push({ deskripsi: "Usia Terlalu Muda (<20 Tahun)", skor: 4 });
  } else if (input.umur >= 35) {
    score += 4;
    komplikasi.push("Usia Resti / Terlalu Tua (>=35 Tahun)");
    detailSkorList.push({ deskripsi: "Usia Primi Tua / Terlalu Tua (>=35 Tahun)", skor: 4 });
  }

  if (input.paritas >= 4) {
    score += 4;
    komplikasi.push("Grande Multipara (Paritas >= 4)");
    detailSkorList.push({ deskripsi: "Grande Multipara (Paritas >= 4)", skor: 4 });
  }

  // Blood Pressure & MAP
  const mapVal = calculateMAP(input.sistolik, input.diastolik);
  const isHipertensiBerat = input.sistolik >= 140 || input.diastolik >= 90;
  const isHipertensiRingan =
    (input.sistolik >= 120 && input.sistolik < 140) ||
    (input.diastolik >= 80 && input.diastolik < 90);

  if (isHipertensiBerat) {
    score += 8;
    komplikasi.push("Hipertensi Dalam Kehamilan (HDK) / Preeklamsia");
    detailSkorList.push({ deskripsi: "Hipertensi Dalam Kehamilan (Sistolik >=140 / Diastolik >=90)", skor: 8 });
  } else if (isHipertensiRingan) {
    score += 4;
    komplikasi.push("Pre-Hipertensi Gestasional");
    detailSkorList.push({ deskripsi: "Pre-Hipertensi Gestasional", skor: 4 });
  }

  if (mapVal >= 90 && !komplikasi.includes("Indikator MAP Tinggi (>= 90 mmHg)")) {
    score += 4;
    komplikasi.push("Indikator MAP Tinggi (>= 90 mmHg)");
    detailSkorList.push({ deskripsi: "Mean Arterial Pressure (MAP) >= 90 mmHg", skor: 4 });
  }

  // Edema Evaluation
  if (input.edema_level === "ringan_kaki") {
    score += 4;
    komplikasi.push("Edema Ekstremitas Ringan (Kaki)");
    detailSkorList.push({ deskripsi: "Edema Ekstremitas Ringan (Kaki)", skor: 4 });
  } else if (input.edema_level === "sedang_tungkai") {
    score += 4;
    komplikasi.push("Edema Ekstremitas Sedang (Tungkai/Betis)");
    detailSkorList.push({ deskripsi: "Edema Ekstremitas Sedang (Tungkai/Betis)", skor: 4 });
  } else if (input.edema_level === "berat_wajah_tangan") {
    score += 8;
    komplikasi.push("Edema Anasarka / Wajah & Tangan (Gejala Preeklamsia Berat)");
    detailSkorList.push({ deskripsi: "Edema Anasarka (Wajah & Kelopak Tangan)", skor: 8 });
  }

  // Specific Symptoms
  if (input.keluhan_spesifik.includes("pusing_berat_kabur")) {
    score += 8;
    komplikasi.push("Nyeri Kepala Berat & Pandangan Kabur");
    detailSkorList.push({ deskripsi: "Nyeri Kepala Berat & Pandangan Kabur", skor: 8 });
  }
  if (input.keluhan_spesifik.includes("nyeri_ulu_hati")) {
    score += 8;
    komplikasi.push("Nyeri Epigastrium / Ulu Hati (Tanda Impending Eklamsia)");
    detailSkorList.push({ deskripsi: "Nyeri Ulu Hati Epigastrium", skor: 8 });
  }
  if (input.keluhan_spesifik.includes("anemia_pucat")) {
    score += 4;
    komplikasi.push("Anemia Dalam Kehamilan");
    detailSkorList.push({ deskripsi: "Anemia / Pucat & Cepat Lelah", skor: 4 });
  }
  if (input.keluhan_spesifik.includes("perdarahan")) {
    score += 8;
    komplikasi.push("Perdarahan Antepartum / Postpartum");
    detailSkorList.push({ deskripsi: "Perdarahan Jalan Lahir / Flek", skor: 8 });
  }
  if (input.keluhan_spesifik.includes("gerakan_janin_berkurang")) {
    score += 8;
    komplikasi.push("Gawat Janin / Fetal Distress");
    detailSkorList.push({ deskripsi: "Gerakan Janin Berkurang", skor: 8 });
  }
  if (input.keluhan_spesifik.includes("riwayat_sc")) {
    score += 4;
    komplikasi.push("Bekas Seksio Sesarea (Bekas SC)");
    detailSkorList.push({ deskripsi: "Riwayat Operasi SC Sebelumnya", skor: 4 });
  }

  if (input.sudah_dapat_treatment && komplikasi.length === 0) {
    komplikasi.push("Dalam Terapi Penanganan Awal (Perlu Evaluasi Lanjutan)");
  }

  // Risk Classification
  let riskLevel: RiskLevel = "Ringan";
  let katRisiko: "KRR" | "KRT" | "KRST" = "KRR";
  let statusLabel = "🟩 Risiko Ringan (KRR)";

  const hasRedFlag =
    isHipertensiBerat &&
    (input.edema_level !== "none" ||
      input.keluhan_spesifik.includes("pusing_berat_kabur") ||
      input.keluhan_spesifik.includes("nyeri_ulu_hati"));

  if (score >= 12 || hasRedFlag) {
    riskLevel = "Berat";
    katRisiko = "KRST";
    statusLabel = "Risiko Sangat Tinggi / Berat";
  } else if (score >= 6) {
    riskLevel = "Sedang";
    katRisiko = "KRT";
    statusLabel = "Risiko Tinggi / Sedang";
  } else {
    riskLevel = "Ringan";
    katRisiko = "KRR";
    statusLabel = "Risiko Ringan / Rendah";
  }

  let faskes = "";
  let tempat = "";
  let penolong = "";

  if (riskLevel === "Berat") {
    tempat = "Wajib Rujukan Rumah Sakit (RS Facilitas SC)";
    penolong = "Dokter Spesialis Kebidanan (Sp.OG)";
    faskes = "Wajib Rujukan Segera ke Rumah Sakit (Faskes Rujukan Lanjutan) dan Didampingi Dokter Spesialis Kebidanan & Kandungan (Sp.OG).";
  } else if (riskLevel === "Sedang") {
    tempat = "Puskesmas Rawat Inap / PONED";
    penolong = "Bidan & Dokter Umum";
    faskes = "Dapat Dilayani di Puskesmas / Rumah Sakit Type C dengan Pendampingan Bidan & Dokter Umum.";
  } else {
    tempat = "Bidan Praktik Mandiri (BPM) / Puskesmas";
    penolong = "Bidan Wilayah";
    faskes = "Boleh Bersalin di Bidan Praktik Mandiri (BPM) atau Puskesmas Rawat Inap dengan Pengawasan Bidan.";
  }

  const saranTerapiList: string[] = [];
  if (isHipertensiBerat || input.keluhan_spesifik.includes("pusing_berat_kabur")) {
    saranTerapiList.push("Kompres Warm Compress pada leher & pundak");
    saranTerapiList.push("Teknik Pernapasan Deep Breathing Relaksasi");
    saranTerapiList.push("Aromaterapi Lavender Meredakan Kecemasan");
  } else if (input.edema_level !== "none") {
    saranTerapiList.push("Elevasi Kaki (Posisikan Kaki Lebih Tinggi saat Istirahat)");
    saranTerapiList.push("Kompres Lengkung Pergelangan Kaki");
    saranTerapiList.push("Pijat Ringan Efusi Ekstremitas");
  } else {
    saranTerapiList.push("Pijat Oxytocin Tulang Belakang (Bantuan Suami)");
    saranTerapiList.push("Senam Pelenturan Panggul Trimester 3");
    saranTerapiList.push("Minum Air Putih Cukup (8-10 Gelas/Hari)");
  }

  const gestational = calculateGestationalAge(input.hpht);
  const randomCode = `SCR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    kode_screening: randomCode,
    skor_poedji_rochjati: score,
    total_skor: score,
    tingkat_risiko: riskLevel,
    kategori_risiko: katRisiko,
    status_label: statusLabel,
    map_value: mapVal,
    potensi_komplikasi: Array.from(new Set(komplikasi)),
    rekomendasi_faskes: faskes,
    rekomendasi_tempat: tempat,
    penolong_persalinan: penolong,
    taksiran_hpl: gestational.dueDate,
    saran_terapi_ids: riskLevel === "Berat" ? [3, 4] : riskLevel === "Sedang" ? [1, 2] : [2],
    saran_terapi: saranTerapiList,
    detail_skor: detailSkorList,
    input_summary: input,
    nama_pasien: input.nama_pasien,
    created_at: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
