# Catatan submission Ruang Diskusi

Tanggal pengerjaan: 6 Oktober 2026.

## Repository dan deployment

- Repository: https://github.com/faustaraihan/forum-diskusi-submission
- Branch produksi yang ditargetkan: `master`.
- URL Vercel dan hasil konfigurasi eksternal akan dicatat setelah deployment benar-benar selesai diverifikasi.

## Implementasi lokal yang telah diperiksa

- Baseline sebelum perubahan: 58 test lulus.
- Setelah penambahan pengujian: 79 test Vitest lulus pada 13 berkas.
- Enam test E2E login Cypress lulus.
- Lint, build aplikasi, dan build Storybook berhasil.
- Storybook dipakai sebagai ecosystem React: dua komponen, tujuh stories.
- E2E menjalankan aplikasi penuh dengan stub API eksternal; tidak menggunakan akun nyata.

## Bukti eksternal

- PR implementasi: https://github.com/faustaraihan/forum-diskusi-submission/pull/1
- Run bukti CI gagal: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37469129459
- Run tersebut gagal di langkah Unit and component tests, dengan satu assertion auth gagal dan 78 test lain lulus. Assertion sengaja diubah untuk demonstrasi dan kemudian dipulihkan.
- Proteksi `master` telah diterapkan: wajib PR, required status `CI`, branch harus up-to-date, berlaku juga untuk administrator, force push dan penghapusan branch dilarang, serta percakapan PR harus diselesaikan. Review dari orang lain tidak diwajibkan karena proyek dikerjakan sendiri.
- Screenshot gagal: `screenshots/1_ci_check_error.jpg`.
- Run CI lolos dan URL deployment dicatat setelah diverifikasi.
- Rincian kriteria submission sebelumnya sudah dibaca ulang dan diaudit dalam `docs/previous-submission-audit.md`.
