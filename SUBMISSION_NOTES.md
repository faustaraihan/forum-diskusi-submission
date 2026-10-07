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
- PR bukti screenshot: https://github.com/faustaraihan/forum-diskusi-submission/pull/4
- CI gagal pada PR bukti: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37482506512
- CI berhasil pada PR bukti: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37482895631

Untuk mengambil bukti CI gagal, satu assertion autentikasi sengaja dibuat salah. Run tersebut menghasilkan satu test gagal dan 78 test lulus. Assertion kemudian diperbaiki sebelum PR digabung.

Branch `master` mewajibkan PR dengan check `CI` yang lulus dan branch yang sudah up-to-date. Aturan ini juga berlaku untuk administrator. Force push dan penghapusan `master` dinonaktifkan; percakapan PR harus selesai sebelum merge. Mulai revisi 7 Oktober 2026, satu approval dari reviewer dengan write access diwajibkan. PR tidak dapat digabung sendiri oleh pembuat PR.

Bukti screenshot ada di:

- `screenshots/1_ci_check_error.jpg`
- `screenshots/2_ci_check_pass.jpg`
- `screenshots/3_branch_protection.jpg`

Screenshot CI gagal dan lolos berasal dari PR #4. Screenshot proteksi diperbarui dari PR #5 setelah feedback reviewer: Review required, All checks have passed, CI Required, Merging is blocked, serta tombol merge nonaktif. Screenshot ini menunjukkan merge tetap diblokir setelah CI lulus karena belum ada satu approval. PR #5: https://github.com/faustaraihan/forum-diskusi-submission/pull/5. CI pada saat pengambilan bukti: https://github.com/faustaraihan/forum-diskusi-submission/actions/runs/37573806893.

Ketiganya sudah masuk ZIP. Ada juga screenshot halaman login, Storybook, dan aplikasi yang sudah deploy. Kriteria submission sebelumnya dicatat di `docs/previous-submission-audit.md`.

## Berkas pengumpulan

ZIP ada di `artifacts/forum-diskusi-submission.zip`. Isinya source React, test, konfigurasi, lockfile, dokumentasi, aset yang dipakai, dan screenshot bukti. Folder dependency, hasil build, metadata Git/Vercel, credential, dan gambar konsep yang tidak dipakai tidak disertakan.

Untuk membuat ulang ZIP:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-submission.ps1
```

Saat mengumpulkan di Dicoding, unggah ZIP dan cantumkan **https://ruang-diskusi.vercel.app** pada catatan submission.

## Revisi setelah feedback reviewer — 7 Oktober 2026

Latihan https://www.dicoding.com/academies/418/tutorials/29015 telah dibaca. Aturan master mewajibkan PR dan CI lulus; satu approval ditambahkan untuk memperjelas bukti blokir merge. Aturan berlaku untuk administrator dan tetap aktif setelah screenshot. Bukti lama yang hanya menunjukkan CI berjalan tidak diterima reviewer.

ZIP ringkas untuk pengiriman ulang: artifacts/forum-diskusi-submission-revisi.zip, berisi tepat tiga screenshot. Dokumen internal, scripts, dependency, dan output build tidak disertakan. PR #5 tetap terbuka menunggu approval; tidak ada bypass proteksi.
