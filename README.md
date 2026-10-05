# Ruang Diskusi

Forum diskusi berbahasa Indonesia untuk submission **Menjadi React Web Developer Expert: Membangun Aplikasi React dengan Redux**. Seluruh fitur wajib dan saran untuk target nilai 5 diimplementasikan; penilaian akhir mengikuti review Dicoding.

## Menjalankan proyek

Gunakan Node.js **22.22.2+ pada seri 22**, **24.15.0+ pada seri 24**, atau **26+**, sesuai engines dependencies pada lockfile. Pengembangan diverifikasi menggunakan Node **26.5.1** dan npm **11.17.0** di Windows.

```sh
npm ci
npm run dev
```

Buka URL yang dicetak Vite (default `http://127.0.0.1:5173`). Tidak perlu `.env`, API key, atau backend lokal. Koneksi internet diperlukan untuk data Forum API.

```sh
npm test          # Vitest: state, API boundary, form dan regresi
npm run lint     # ESLint + Dicoding Academy JavaScript Style Guide
npm run build    # Build produksi ke dist/
npm run preview  # Preview build produksi lokal
```

## Fitur

- Register, login, pemulihan sesi, dan logout. Password tidak disimpan.
- Daftar thread dengan judul, cuplikan isi, nama/avatar penulis, waktu, jumlah komentar dan votes.
- Detail thread, komentar, serta pembuatan thread dan komentar bagi pengguna login.
- Up-vote/down-vote thread dan komentar, neutral vote ketika pilihan aktif diklik lagi, optimistic update, rollback request gagal, serta indikator vote aktif.
- Leaderboard dengan nama, avatar dan score dari server.
- Filter kategori yang berjalan di frontend.
- Loading indicator, error/retry, empty state, sanitasi HTML, dan layout responsif.

## Teknologi dan struktur

React, Vite, Redux Toolkit, React Redux, React Router, DOMPurify, dan CSS sendiri. React Strict Mode aktif.

```text
src/app/          Redux Store, routing dan App
src/states/       slices, selectors dan async thunks
src/services/     API client dan token persistence
src/components/   komponen reusable
src/pages/        komposisi halaman
src/utils/        sanitasi, waktu dan redirect aman
src/styles/       tokens dan CSS
src/test/         setup dan fixtures tes
```

Komponen melakukan dispatch action; thunk memanggil `services/api.js`; hasil API disimpan dalam Redux. Request REST tidak dilakukan langsung dalam lifecycle/efek komponen. Input form memakai state lokal. Token berada pada localStorage, sementara profil aktif berada dalam Redux.

State vote menggunakan membership `upVotesBy`/`downVotesBy`. Request target yang sama dikunci selama pending; jika gagal, hanya vote pengguna yang dikembalikan. Daftar dan detail disinkronkan. Respons detail lama tidak dapat menggantikan detail yang lebih baru.

Sumber data: [Dicoding Forum API](https://forum-api.dicoding.dev/v1/#/). Base URL ditetapkan di API client. Gaya kode menggunakan [konfigurasi resmi Dicoding Academy](https://github.com/dicodingacademy/javascript-style-guide).

## Halaman

| URL | Halaman |
| --- | --- |
| `/` | Daftar diskusi dan filter |
| `/threads/:threadId` | Detail dan komentar |
| `/threads/new` | Buat diskusi, wajib login |
| `/leaderboards` | Peringkat pengguna |
| `/login` | Masuk akun |
| `/register` | Buat akun |

Untuk hosting produksi, arahkan URL aplikasi yang tidak menunjuk aset statis ke `index.html` (SPA fallback), sehingga membuka URL detail secara langsung tetap bekerja. Folder `dist` adalah hasil build untuk hosting; **submission mengirim source proyek**, bukan hanya dist.

## Membuat ZIP submission

Jalankan melalui PowerShell dari folder proyek:

```powershell
pwsh -File .\scripts\package-submission.ps1
```

Jika menggunakan Windows PowerShell bawaan:

```powershell
powershell -File .\scripts\package-submission.ps1
```

Hasil: `ruang-diskusi-submission.zip`. Script memakai allowlist, menyertakan source, konfigurasi, lockfile dan dokumentasi, serta mengecualikan node_modules, dist, .git, .env, log, dan artefak gambar verifikasi. Instalasi lokal tidak dihapus. Script memeriksa isi ZIP dan berhenti jika berkas penting hilang atau direktori terlarang muncul.

## Acuan dan verifikasi

- [Panduan resmi yang dicatat](SUBMISSION_GUIDANCE.md).
- [Rancangan aplikasi](docs/superpowers/specs/2026-10-05-forum-design.md).
- [Rencana implementasi](docs/superpowers/plans/2026-10-05-forum-implementation.md).
- [Hasil verifikasi dan batas pengujian](docs/verification.md).

Pengujian otomatis memakai mock pada batas jaringan untuk request mutasi. Browser memeriksa data publik dari API asli. Pendaftaran akun, posting thread/komentar, serta perubahan vote pada server publik tidak dilakukan otomatis dalam sesi ini; verifikasi mutasi server memerlukan akun uji dan penggunaan yang disetujui pengguna. Tidak ada deployment atau pengiriman submission otomatis.
