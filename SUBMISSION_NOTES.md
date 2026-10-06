# Catatan submission Ruang Diskusi

Tanggal pengerjaan: 6 Oktober 2026.

## Repository dan deployment

- Repository: https://github.com/faustaraihan/forum-diskusi-submission
- Branch produksi: `master`.
- URL produksi: https://ruang-diskusi.vercel.app
- CD otomatis dari integrasi Git Vercel berhasil setelah PR #1 masuk ke `master`: deployment `dpl_4DyYxNSxY8ehArnVNouhmNsFaMnY`, status `READY`, commit `048a0aa79f60b90b49c041fc545a30ab8eecdeab`.
- Akses publik halaman utama, `/login`, `/leaderboards`, dan detail thread telah diperiksa. Guest yang membuka `/threads/new` diarahkan ke login. Halaman utama, detail, dan peringkat memuat data API Dicoding.

## Implementasi lokal yang telah diperiksa

- Baseline sebelum perubahan: 58 test lulus.
- Setelah penambahan pengujian: 79 test Vitest lulus pada 13 berkas.
- Cakupan: 15 pengujian reducer langsung, 27 thunk/store, 16 komponen React, serta 21 API/selector/utilitas. Jenis pengujian dibedakan berdasarkan perilaku yang diuji, bukan hanya nama berkas.
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
- Run CI lolos: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37469820003 (79 test Vitest, 6 E2E, lint, build aplikasi, dan build Storybook berhasil).
- Screenshot lolos: `screenshots/2_ci_check_pass.jpg`; proteksi PR: `screenshots/3_branch_protection.jpg`.
- Rincian kriteria submission sebelumnya sudah dibaca ulang dan diaudit dalam `docs/previous-submission-audit.md`.

## Pengumpulan

- ZIP: `artifacts/forum-diskusi-submission.zip`, dibuat ulang dengan `powershell -ExecutionPolicy Bypass -File scripts/package-submission.ps1`.
- ZIP mencakup source React DOM, test, konfigurasi CI/Storybook/Cypress/Vercel, lockfile, dokumentasi, font/logo yang digunakan, dan screenshot asli.
- Tidak menyertakan `node_modules`, `.git`, `.vercel`, `dist`, `storybook-static`, credential, atau artwork konsep yang tidak digunakan aplikasi.
- Ketiga screenshot wajib telah diperiksa dan masuk ke ZIP. Screenshot tambahan menunjukkan preview login, Storybook, dan deployment.
- Tempel URL **https://ruang-diskusi.vercel.app** ke catatan submission Dicoding.
- Pengujian E2E menggunakan akun sintetis dan stub API; pemeriksaan produksi bersifat baca saja tanpa membuat akun, thread, komentar, atau vote.
