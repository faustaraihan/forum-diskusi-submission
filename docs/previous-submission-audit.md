# Audit kriteria submission sebelumnya

Sumber dibaca dari tab Chrome pada 6 Oktober 2026: [Proyek: Membangun Aplikasi React dengan Redux](https://www.dicoding.com/academies/418/tutorials/24493/submission-guidance), tab Kriteria.

## Fungsionalitas wajib yang dipertahankan

- Mendaftar akun: `RegisterPage` dan thunk `register`.
- Login akun: `LoginPage` dan thunk `login`; enam alur diuji E2E.
- Daftar thread: `ThreadsPage`, `ThreadCard`, dan thunk `loadForum`.
- Detail thread beserta komentar: `ThreadDetailPage`, `CommentItem`, dan thunk `loadThread`.
- Membuat thread: `NewThreadPage`, `RequireAuth`, dan thunk `createThread`.
- Membuat komentar: `CommentForm` dan thunk `addComment`.
- Loading indicator ketika memuat API: `ProgressBar` dan `AsyncState`.

Catatan resmi: membaca thread boleh dibatasi login atau dibuka publik; membuat thread/komentar wajib terautentikasi. Proyek ini membuka halaman baca untuk guest dan melindungi interaksi perubahan.

Informasi wajib daftar thread: judul, waktu pembuatan, jumlah komentar, nama pembuat. Potongan body dan avatar pembuat opsional. `ThreadCard` menampilkan seluruhnya, termasuk keduanya yang opsional.

Informasi wajib detail thread: judul, body, waktu pembuatan, nama dan avatar pembuat, komentar. Setiap komentar memuat konten, waktu pembuatan, dan nama pembuat; avatar komentar opsional. `ThreadDetailPage` dan `CommentItem` mempertahankan informasi tersebut.

## Bugs Highlighting

- ESLint terkonfigurasi di `eslint.config.mjs`.
- Style convention yang dipakai: `eslint-config-dicodingacademy` (salah satu pilihan resmi, bersama AirBnB, Google, atau StandardJS).
- `npm run lint` diperiksa dan lulus.
- React Strict Mode dipertahankan di `src/main.jsx`.

## Arsitektur

- State dari API dikelola Redux melalui `src/states/` dan `src/app/store.js`.
- Input form menggunakan local state, sesuai pengecualian resmi untuk controlled components.
- REST API dipanggil melalui thunk dan `src/services/api.js`; efek komponen men-dispatch thunk, bukan memanggil REST API langsung.
- UI dipisahkan dari state: `src/components/`, `src/pages/`, dan `src/states/`.
- Komponen reusable mencakup `FormField`, `Avatar`, `AsyncState`, `CategoryFilter`, `VoteButtons`, `CommentForm`, dan `SafeHtml`.

## Saran nilai tinggi yang dipertahankan

- Votes thread dan komentar: tombol up/down, status aktif, jumlah vote, dan optimistic update dengan rollback saat API gagal. Pengujian thunk voting mencakup race condition serta pergantian sesi.
- Leaderboard: halaman tersendiri, nama, avatar, dan score pengguna.
- Filter kategori: filter sisi frontend melalui Redux selector; API memang tidak menyediakan endpoint filter.
- Desain proyek tetap mengikuti Ruang Diskusi yang sudah ada. Contoh resmi aplikasi adalah `https://dicoding-forum-app.vercel.app/`; panduan melarang meniru persis contoh tersebut.

Audit ini didasarkan pada panduan, inspeksi source, dan pengujian lokal. Pengujian otomatis menggunakan stub API untuk determinisme; kondisi API eksternal saat penggunaan nyata tetap bergantung pada layanan Dicoding.
