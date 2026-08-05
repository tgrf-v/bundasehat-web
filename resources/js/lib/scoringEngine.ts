import { ScreeningInput, ScreeningResult, RiskLevel } from "@/types/screening";

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

  // Age & Parity evaluation
  if (input.umur < 20) {
    score += 4;
    komplikasi.push("Usia Terlalu Muda (<20 Tahun)");
  } else if (input.umur >= 35) {
    score += 4;
    komplikasi.push("Usia Resti / Terlalu Tua (>=35 Tahun)");
  }

  if (input.paritas >= 4) {
    score += 4;
    komplikasi.push("Grande Multipara (Paritas >= 4)");
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
  } else if (isHipertensiRingan) {
    score += 4;
    komplikasi.push("Pre-Hipertensi Gestasional");
  }

  if (mapVal >= 90 && !komplikasi.includes("Indikator MAP Tinggi (>= 90 mmHg)")) {
    score += 4;
    komplikasi.push("Indikator MAP Tinggi (>= 90 mmHg)");
  }

  // Edema Evaluation
  if (input.edema_level === "ringan_kaki") {
    score += 4;
    komplikasi.push("Edema Ekstremitas Ringan (Kaki)");
  } else if (input.edema_level === "sedang_tungkai") {
    score += 4;
    komplikasi.push("Edema Ekstremitas Sedang (Tungkai/Betis)");
  } else if (input.edema_level === "berat_wajah_tangan") {
    score += 8;
    komplikasi.push("Edema Anasarka / Wajah & Tangan (Gejala Preeklamsia Berat)");
  }

  // Specific Symptoms
  if (input.keluhan_spesifik.includes("pusing_berat_kabur")) {
    score += 8;
    komplikasi.push("Nyeri Kepala Berat & Pandangan Kabur");
  }
  if (input.keluhan_spesifik.includes("nyeri_ulu_hati")) {
    score += 8;
    komplikasi.push("Nyeri Epigastrium / Ulu Hati (Tanda Impending Eklamsia)");
  }
  if (input.keluhan_spesifik.includes("anemia_pucat")) {
    score += 4;
    komplikasi.push("Anemia Dalam Kehamilan");
  }
  if (input.keluhan_spesifik.includes("perdarahan")) {
    score += 8;
    komplikasi.push("Perdarahan Antepartum / Postpartum");
  }
  if (input.keluhan_spesifik.includes("gerakan_janin_berkurang")) {
    score += 8;
    komplikasi.push("Gawat Janin / Fetal Distress");
  }
  if (input.keluhan_spesifik.includes("riwayat_sc")) {
    score += 4;
    komplikasi.push("Bekas Seksio Sesarea (Bekas SC)");
  }

  if (input.sudah_dapat_treatment && komplikasi.length === 0) {
    komplikasi.push("Dalam Terapi Penanganan Awal (Perlu Evaluasi Lanjutan)");
  }

  // Risk Classification
  let riskLevel: RiskLevel = "Ringan";
  const hasRedFlag =
    isHipertensiBerat &&
    (input.edema_level !== "none" ||
      input.keluhan_spesifik.includes("pusing_berat_kabur") ||
      input.keluhan_spesifik.includes("nyeri_ulu_hati"));

  if (score >= 12 || hasRedFlag) {
    riskLevel = "Berat";
  } else if (score >= 6) {
    riskLevel = "Sedang";
  } else {
    riskLevel = "Ringan";
  }

  let faskes = "";
  if (riskLevel === "Berat") {
    faskes = "Wajib Rujukan Segera ke Rumah Sakit (Faskes Rujukan Lanjutan) dan Didampingi Dokter Spesialis Kebidanan & Kandungan (Sp.OG).";
  } else if (riskLevel === "Sedang") {
    faskes = "Dapat Dilayani di Puskesmas / Rumah Sakit Type C dengan Pendampingan Bidan & Dokter Umum.";
  } else {
    faskes = "Boleh Bersalin di Bidan Praktik Mandiri (BPM) atau Puskesmas Rawat Inap dengan Pengawasan Bidan.";
  }

  const randomCode = `SCR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    kode_screening: randomCode,
    skor_poedji_rochjati: score,
    tingkat_risiko: riskLevel,
    map_value: mapVal,
    potensi_komplikasi: Array.from(new Set(komplikasi)),
    rekomendasi_faskes: faskes,
    saran_terapi_ids: riskLevel === "Berat" ? [3, 4] : riskLevel === "Sedang" ? [1, 2] : [2],
    input_summary: input,
    created_at: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
