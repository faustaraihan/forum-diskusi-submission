# Ruang Diskusi

Ruang Diskusi adalah forum berbasis React yang dikembangkan dari submission sebelumnya. Pengguna bisa daftar dan login, membuat thread, menulis komentar, memberi vote, melihat peringkat, dan memfilter diskusi berdasarkan kategori.

Submission ini menambahkan pengujian otomatis, Storybook, serta CI/CD. Aplikasi bisa dibuka di [ruang-diskusi.vercel.app](https://ruang-diskusi.vercel.app).

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
- Cypress menjalankan alur login di aplikasi. Respons API diganti dengan data pengujian supaya hasilnya konsisten dan tidak perlu memakai akun pribadi.
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

Pengerjaan dilakukan di branch `develop`, lalu masuk ke `master` lewat PR. Branch `master` mewajibkan check `CI` yang lulus dan satu approval dari reviewer sebelum PR bisa digabung. Aturan ini juga berlaku untuk administrator.
