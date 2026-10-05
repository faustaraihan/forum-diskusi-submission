# Rancangan Forum Diskusi — Target Nilai 5

Status: **Rancangan dan rencana disetujui pengguna pada 5 Oktober 2026; implementasi serta pemeriksaan lokal selesai. Lihat docs/verification.md untuk bukti dan batas pengujian.**

## Tujuan dan batas pekerjaan

Bangun aplikasi forum dari nol untuk submission Menjadi React Web Developer Expert. Pengguna telah memilih target nilai maksimal (5). Aplikasi harus memenuhi seluruh kriteria wajib dan seluruh saran: votes pada thread dan komentar dengan optimistic updates, leaderboard, filter kategori, kemudahan penggunaan, dan tampilan menarik.

Acuan rubrik: [SUBMISSION_GUIDANCE.md](../../../SUBMISSION_GUIDANCE.md). Kontrak API telah dibaca dari [dokumentasi resmi](https://forum-api.dicoding.dev/v1/#/) pada 5 Oktober 2026. Nilai akhir tetap ditentukan reviewer Dicoding.

Pilihan rancangan yang disetujui: JavaScript, React + Vite, Redux Toolkit, React Redux, React Router, CSS sendiri, bahasa antarmuka Indonesia, tema terang, dan akses baca publik. Nama aplikasi: **Ruang Diskusi**.

## Pendekatan yang dipertimbangkan

1. **Redux Toolkit dan CSS sendiri — rekomendasi.** Mengurangi boilerplate state tanpa menyembunyikan alur action/reducer. CSS sendiri memberi kendali tampilan dan menghindari ketergantungan UI library tambahan.
2. **Redux manual dan CSS sendiri.** Alur Redux lebih eksplisit untuk belajar, tetapi memerlukan lebih banyak kode action dan reducer untuk perilaku yang sama.
3. **Fitur wajib terlebih dahulu, fitur opsional dirancang belakangan.** Memberi milestone awal kecil, tetapi menambah risiko mengubah struktur state untuk voting dan filter. Karena target pengguna adalah nilai 5, seluruh fitur dirancang sejak awal dan tetap diimplementasikan bertahap.

## Pengalaman pengguna dan tampilan

Forum memakai latar putih hangat, teks gelap, dan hijau sebagai aksen tombol utama, kategori aktif, serta up-vote terpilih. Down-vote terpilih memiliki warna dan bentuk penanda yang berbeda. State terpilih juga memakai `aria-pressed` agar tidak hanya bergantung pada warna.

Desktop menampilkan header dengan nama aplikasi, navigasi Diskusi dan Peringkat, serta tindakan akun. Area utama berisi daftar diskusi; panel samping menampilkan kategori dan ajakan membuat thread. Mobile memakai satu kolom, filter kategori yang mudah disentuh, dan navigasi yang tetap terlihat jelas. Tidak ada animasi dekoratif berat atau fitur tambahan yang tidak mendukung rubrik.

Setiap item thread menampilkan kategori, judul, cuplikan body yang diubah menjadi teks aman, nama dan avatar penulis, waktu pembuatan, jumlah komentar, serta jumlah up-votes dan down-votes. Judul menjadi tautan detail; tombol vote tidak berada di dalam tautan tersebut.

## Halaman dan alur

| Route | Perilaku |
| --- | --- |
| `/` | Daftar threads, filter kategori, tombol buat diskusi, votes. |
| `/threads/:threadId` | Judul, body, kategori, waktu, nama/avatar penulis, votes, komentar dan formulir komentar. |
| `/threads/new` | Form judul, kategori opsional, dan body; hanya pengguna login. |
| `/leaderboards` | Peringkat berisi nama, avatar, dan score dari server. |
| `/login` | Form email dan password; menuju tujuan sebelumnya setelah berhasil. |
| `/register` | Form nama, email, password; setelah berhasil menuju login dengan pesan sukses. |
| Route lain | Halaman tidak ditemukan dengan tautan kembali. |

Pengunjung boleh membaca daftar, detail, dan leaderboard tanpa login. Menulis thread, komentar, dan voting memerlukan autentikasi. Ajakan login membawa informasi tujuan agar pengguna dapat kembali ke halaman relevan. Logout menghapus token dan state pengguna; konten publik tetap dapat dibaca.

Form menampilkan label, validasi, dan pesan error yang jelas. Password register minimal 6 karakter sesuai dokumentasi API. Isi form dipertahankan saat request gagal. Tombol submit dinonaktifkan ketika request berlangsung untuk mencegah pengiriman ganda.

## Arsitektur dan batas tanggung jawab

```text
src/
  app/          store, router, entry aplikasi
  pages/        komposisi halaman dan dispatch action
  components/   UI reusable, form, vote controls, loading/error/empty state
  states/       slices, thunks, selectors
  services/     API client dan penyimpanan token
  utils/        format waktu, sanitasi HTML, transformasi data
  styles/       tokens visual, layout dan styles komponen
```

Redux menyimpan pengguna aktif, daftar pengguna, threads, detail aktif, leaderboard, kategori terpilih, serta status loading/error tiap operasi. State lokal hanya untuk input form dan interaksi UI sesaat. Selector memadukan `ownerId` thread dengan users dan menghitung kategori unik serta daftar hasil filter tanpa menggandakan data.

Komponen melakukan dispatch thunk, termasuk dari efek pemuatan halaman. Request REST hanya dilakukan services yang dipanggil thunk, bukan di lifecycle/efek komponen. Services menangani HTTP, header token, dan respons API; slices menangani perubahan state; komponen merender hasilnya.

Token login disimpan di localStorage dan dibaca API client untuk header Bearer. Password tidak disimpan. Saat startup, thunk mengambil profil jika token tersedia; token tidak valid dibersihkan dan pengguna menjadi pengunjung. Kegagalan jaringan sementara menyediakan retry tanpa langsung menganggap sesi tidak valid. React Strict Mode diaktifkan; thunk pemuatan memakai status/request identity agar respons lama dan pemanggilan ganda tidak merusak state.

## Integrasi API

Base URL: `https://forum-api.dicoding.dev/v1`.

| Operasi | Endpoint | Data request |
| --- | --- | --- |
| Register | `POST /register` | `name`, `email`, `password` |
| Login | `POST /login` | `email`, `password` |
| Users | `GET /users` | — |
| Profil aktif | `GET /users/me` | Bearer token |
| Daftar/detail | `GET /threads`, `GET /threads/:id` | — |
| Thread baru | `POST /threads` | `title`, `body`, `category` opsional; Bearer token |
| Komentar baru | `POST /threads/:id/comments` | `content`; Bearer token |
| Thread vote | `POST /threads/:id/up-vote`, `down-vote`, `neutral-vote` | Bearer token |
| Komentar vote | `POST /threads/:id/comments/:commentId/up-vote`, `down-vote`, `neutral-vote` | Bearer token |
| Leaderboard | `GET /leaderboards` | — |

Daftar threads memakai `ownerId` dan `totalComments`. Detail memakai `owner` dan `comments`. Daftar vote berbentuk `upVotesBy` dan `downVotesBy`. Respons vote berisi `voteType`: 1, -1, atau 0. Filter kategori dihitung di frontend karena tidak ada endpoint filter.

Body thread dan konten komentar ditampilkan dengan sanitasi HTML menggunakan DOMPurify sebelum dirender. Cuplikan daftar berupa teks, bukan HTML mentah. Sesudah membuat komentar, respons dapat tidak memuat avatar owner; gunakan profil pengguna aktif sebagai fallback dan sinkronkan ulang detail bila diperlukan. Jangan membuat asumsi struktur tambahan di luar dokumentasi tanpa memeriksa respons.

## Optimistic voting dan konsistensi

Saat pengguna memilih vote, Redux langsung memperbarui membership pengguna pada dua array vote. Vote yang sama ditekan lagi mengirim neutral vote; vote berlawanan menghapus pilihan lama dan menerapkan pilihan baru. Jumlah vote serta indikator aktif berubah segera.

Thunk menyimpan pilihan pengguna sebelum perubahan. Jika request gagal, pulihkan pilihan tersebut dan tampilkan pesan yang dapat dibaca. Selama request berjalan, kunci kontrol vote untuk target yang sama; target lain tetap bisa dipakai. Update vote thread disinkronkan ke daftar dan detail bila keduanya tersedia. Rollback hanya mengembalikan vote pengguna untuk target terkait, bukan seluruh daftar atau state yang mungkin telah berubah.

Pembuatan komentar berhasil menambah komentar pada detail dan memperbarui jumlah komentar di daftar. Pembuatan thread berhasil memasukkan data server ke store dan membuka detail thread baru. Navigasi detail memakai request identity agar respons thread sebelumnya tidak mengganti thread yang sedang dibaca.

## Loading, error dan aksesibilitas

Pemuatan API menampilkan progress/loading indicator, dengan status khusus pada form dan target vote. Daftar/detail memakai skeleton atau indikator konten awal. Bedakan daftar kosong, kategori tanpa hasil, thread tidak ditemukan, dan request gagal. Error pemuatan menyediakan retry; error submit tampil di form; optimistic vote gagal memberi pesan dan rollback.

Gunakan HTML semantik, label form, focus indicator, navigasi keyboard, kontras teks yang jelas, alt avatar yang sesuai, dan live region untuk pesan operasi. Layout tetap nyaman pada layar sempit; teks panjang tidak membuat horizontal overflow.

## Verifikasi dan definisi selesai

- ESLint mengikuti **Dicoding Academy JavaScript Style Guide** dan tidak melaporkan error. React Strict Mode aktif.
- Build produksi berhasil dan semua halaman bekerja, termasuk direct navigation dan route fallback pada lingkungan hosting yang dipilih nanti.
- Uji reducer/thunk yang berisiko: perpindahan vote, neutral vote, rollback, sinkronisasi daftar/detail, serta respons detail yang datang terlambat. Uji selector filter kategori.
- Verifikasi browser: baca publik, register/login/logout, membuat thread dan komentar, voting pada keduanya, filter, leaderboard, loading, error/retry, dan mobile.
- Pemeriksaan nyata perubahan data di API memakai akun pengujian dan konten yang jelas untuk pengujian, sesuai izin pengguna saat tahap pengujian tersebut.
- Source tidak di-minify dalam ZIP; arsip menyertakan proyek dan konfigurasi, mengecualikan node_modules. Checklist panduan dicentang hanya berdasarkan verifikasi.

## Tahap berikutnya

Seluruh fitur sudah diimplementasikan pada branch lokal `feat/ruang-diskusi`. Dokumentasi, test, dan source disimpan di repository Git yang diinisialisasi pada tahap fondasi. Tidak ada remote atau push otomatis. Pengujian mutasi pada server publik menggunakan akun asli serta pengiriman ke Dicoding menjadi langkah pengguna berikutnya; lihat [hasil verifikasi](../../verification.md).
