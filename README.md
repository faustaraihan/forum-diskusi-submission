# Ruang Diskusi

Aplikasi forum React dari submission sebelumnya, dilanjutkan dengan automation testing, Storybook, dan CI/CD. Fitur aplikasi: registrasi/login, daftar dan detail thread, pembuatan thread, komentar, votes thread/komentar, leaderboard, serta filter kategori.

## Menjalankan proyek

Gunakan Node.js sesuai `engines` pada `package.json` (Node 24 terbaru direkomendasikan).

```sh
npm ci
npm run dev
```

## Pengujian

```sh
npm run lint
npm test
npm run e2e
npm run build
npm run build-storybook
```

- `npm test`: Vitest + React Testing Library, termasuk reducer, thunk/store, komponen, API, selector, sanitasi konten, dan redirect aman.
- `npm run e2e`: menyalakan Vite di `http://127.0.0.1:4173`, menjalankan Cypress, lalu mematikan server. Pastikan port itu tidak sedang dipakai.
- `npm run e2e:open`: menjalankan Cypress interaktif dengan server yang sama.
- E2E menguji aplikasi React penuh. Hanya API eksternal di-stub dengan fixture, sehingga tidak membutuhkan akun nyata, credential pribadi, atau perubahan data pada forum Dicoding.
- Enam skenario E2E: form kosong, kredensial salah, login berhasil, reload sesi, logout, dan redirect kembali ke halaman terproteksi.
- Skenario tertulis di bagian awal setiap berkas pengujian.
- Bila binary Cypress belum tersedia, jalankan `npx cypress install`. Pada Linux, Cypress memerlukan library sistem yang dijelaskan di [panduan instalasi resminya](https://docs.cypress.io/app/get-started/install-cypress). Runner Ubuntu GitHub Actions menyediakan lingkungan browser yang diperlukan.

## Storybook: ecosystem React

Storybook tercantum pada [daftar ecosystem Dicoding](https://github.com/dicodingacademy/awesome-react-ecosystem#react-tools).

```sh
npm run storybook
```

Buka `http://127.0.0.1:6006`. Komponen memakai CSS dan aset aplikasi yang sama:

- `Forum/CategoryFilter`: SemuaTopik, KategoriTerpilih, TanpaKategori. Klik kategori memperbarui pilihan melalui args Storybook.
- `Forum/AsyncState`: Memuat, Gagal, Kosong, Berhasil. Story Gagal menyediakan aksi retry yang dapat diperiksa.

`npm run build-storybook` membuat versi statis pada `storybook-static/`.

## CI/CD

Workflow `.github/workflows/ci.yml` berjalan untuk push `master` dan Pull Request ke `master`. Check bernama `CI` memeriksa lint, semua unit/component test, E2E login, build aplikasi, dan build Storybook. Screenshot Cypress dari kegagalan browser diunggah sebagai artifact diagnostik.

CD menggunakan integrasi Git Vercel dengan branch produksi `master`. `vercel.json` mengatur build Vite dan fallback SPA, sehingga akses langsung ke `/login`, `/leaderboards`, dan `/threads/:id` dapat dilayani.

Proteksi `master` harus mewajibkan PR dan status `CI` yang lulus. Dengan begitu, perubahan yang gagal pengujian tidak dapat masuk ke branch produksi melalui PR biasa. Konfigurasi eksternal dan bukti sebenarnya dicatat di `SUBMISSION_NOTES.md`.

## Pengumpulan

- Acuan lengkap: `SUBMISSION_GUIDE.md`.
- URL deployment dan bukti: `SUBMISSION_NOTES.md`.
- Sertakan `screenshots/1_ci_check_error.jpg`, `screenshots/2_ci_check_pass.jpg`, dan `screenshots/3_branch_protection.jpg` dari proyek ini.
- ZIP berisi source, konfigurasi, lockfile, aset yang digunakan, dan screenshot bukti.
- Jangan sertakan `node_modules/`, `.git/`, `.vercel/`, `dist/`, `storybook-static/`, secret, atau output JavaScript yang di-minify.
- Gambar contoh pada panduan Dicoding bukan bukti proyek ini.
