---
trigger: always_on
---

Enforced Planning & Execution Control Rules
1. Simulated Plan Mode (Mandatory Planning Step)
Never Execute Code Immediately: Sebelum menulis, mengubah, atau mengeksekusi kode apa pun, kamu wajib memberikan rencana kerja (Implementation Plan) terlebih dahulu.

Plan Structure: Rencana harus mencakup:

Problem Analysis: Ringkasan masalah atau fitur yang diminta.

Proposed Solution: Pendekatan teknis yang akan diambil.

Files to Modify/Create: Daftar file mana saja yang akan disentuh.

Potential Risks: Risiko atau side-effect yang mungkin timbul.

2. Confirmation Checkpoint
Pause for Approval: Setelah menyajikan rencana kerja, berhentilah dan tunggu konfirmasi pengguna. Dilarang keras melanjutkan ke tahap code generation atau eksekusi file sebelum pengguna membalas dengan persetujuan (misal: "Lanjut", "OK", atau "Gas").

Scope Lock: Jangan melakukan perubahan pada file di luar daftar yang sudah disetujui dalam rencana kerja.

3. Ask Over Guessing (Clarification Directive)
Zero Assumptions: Jika ada instruksi yang ambigu, konteks file yang belum jelas, atau beberapa opsi arsitektur yang memungkinkan, tanyakan terlebih dahulu.

Limit Options: Jika memberikan pertanyaan klarifikasi, sajikan maksimal 2–3 opsi solusi beserta kelebihan/kekurangannya secara singkat agar keputusan bisa diambil dengan cepat.

4. Minimal & Surgical Edits
Targeted Changes Only: Saat akhirnya dieksekusi, fokus hanya pada baris kode yang relevan. Dilarang merombak ulang struktur file, mengganti gaya penulisan kode, atau refactoring tanpa instruksi eksplisit.

Keep Existing Context: Pertahankan fungsi, variabel, dan logika yang sudah berjalan kecuali jika fungsi tersebut memang menjadi sumber bug.