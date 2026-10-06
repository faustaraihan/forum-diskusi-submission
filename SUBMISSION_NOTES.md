# Catatan submission Ruang Diskusi

Ruang Diskusi melanjutkan aplikasi forum dari submission sebelumnya. Kali ini ditambahkan pengujian otomatis, Storybook, serta CI/CD.

## Aplikasi dan repository

- Aplikasi: https://ruang-diskusi.vercel.app
- Repository: https://github.com/faustaraihan/forum-diskusi-submission
- Branch pengembangan: `develop`.
- Branch produksi: `master`.

Vercel terhubung ke GitHub dan otomatis deploy ketika perubahan masuk ke `master`. Deployment setelah PR #1 berhasil, dengan commit `048a0aa79f60b90b49c041fc545a30ab8eecdeab`.

Halaman utama, login, peringkat, dan detail thread sudah dicoba lewat URL langsung. Data diskusi dan peringkat berhasil dimuat dari API Dicoding. Pengguna yang belum login akan diarahkan ke halaman login saat membuka `/threads/new`.

## Pengujian

Ada 79 test Vitest di 13 berkas, terdiri dari 15 test reducer, 27 thunk/store, 16 komponen React, dan 21 API/selector/utilitas. Semua lulus. Sebelum penambahan ini, proyek memiliki 58 test.

Enam skenario login juga lulus di Cypress: form kosong, kredensial salah, login berhasil, reload sesi, logout, dan kembali ke halaman yang perlu login. Cypress memakai data akun uji dan respons API yang sudah disiapkan, jadi tidak perlu memakai akun pribadi.

Lint, build aplikasi, dan build Storybook berhasil. Storybook berisi tujuh stories untuk `CategoryFilter` dan `AsyncState`.

## CI dan proteksi branch

- PR implementasi: https://github.com/faustaraihan/forum-diskusi-submission/pull/1
- CI gagal: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37469129459
- CI berhasil: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37469820003

Untuk mengambil bukti CI gagal, satu assertion autentikasi sengaja dibuat salah. Run tersebut menghasilkan satu test gagal dan 78 test lulus. Assertion kemudian diperbaiki sebelum PR digabung.

Branch `master` mewajibkan PR dengan check `CI` yang lulus dan branch yang sudah up-to-date. Aturan ini juga berlaku untuk administrator. Force push dan penghapusan `master` dinonaktifkan; percakapan PR harus selesai sebelum merge. Persetujuan reviewer lain tidak diwajibkan.

Bukti screenshot ada di:

- `screenshots/1_ci_check_error.jpg`
- `screenshots/2_ci_check_pass.jpg`
- `screenshots/3_branch_protection.jpg`

Ketiganya sudah masuk ZIP. Ada juga screenshot halaman login, Storybook, dan aplikasi yang sudah deploy. Kriteria submission sebelumnya dicatat di `docs/previous-submission-audit.md`.

## Berkas pengumpulan

ZIP ada di `artifacts/forum-diskusi-submission.zip`. Isinya source React, test, konfigurasi, lockfile, dokumentasi, aset yang dipakai, dan screenshot bukti. Folder dependency, hasil build, metadata Git/Vercel, credential, dan gambar konsep yang tidak dipakai tidak disertakan.

Untuk membuat ulang ZIP:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-submission.ps1
```

Saat mengumpulkan di Dicoding, unggah ZIP dan cantumkan **https://ruang-diskusi.vercel.app** pada catatan submission.
