# Rencana implementasi submission automation testing dan CI/CD

Tanggal: 6 Oktober 2026. Acuan: `SUBMISSION_GUIDE.md`. Pengguna telah meminta implementasi dan memilih repository public `faustaraihan/forum-diskusi-submission`.

Tujuan: melanjutkan Ruang Diskusi dengan pengujian yang dapat direproduksi, Storybook, CI GitHub Actions, dan CD Vercel tanpa mengubah desain produk.

## Urutan pengerjaan

- [x] Jalankan test dan lint baseline sebelum mengubah perilaku aplikasi.
- [x] Tambahkan komentar skenario ke seluruh berkas pengujian lama.
- [x] Tambahkan pengujian reducer autentikasi dan forum secara langsung, termasuk respons lama, votes, error, dan logout.
- [x] Tambahkan pengujian interaksi CategoryFilter dan AsyncState; pertahankan pengujian VoteButtons dengan komponen/store nyata yang sudah ada.
- [x] Pasang Cypress dan tambahkan E2E login kosong, kredensial salah, login berhasil, pemulihan sesi, logout, dan kembali ke halaman yang dilindungi. Stub hanya API eksternal agar tidak membutuhkan akun pribadi atau jaringan API dalam CI.
- [x] Pisahkan pola test Vitest dari stories dan Cypress.
- [x] Pasang Storybook dari daftar ecosystem Dicoding; dokumentasikan CategoryFilter dan AsyncState dengan beberapa stories interaktif memakai CSS aplikasi.
- [x] Jalankan lint, seluruh test, E2E, build aplikasi, dan build Storybook.
- [x] Tambahkan workflow CI dengan status wajib `CI`, konfigurasi SPA Vercel, dan panduan deployment/proteksi branch.
- [x] Buat repository public yang dipilih; kirim hanya berkas proyek yang dimaksud, tanpa dependency, secret, atau artefak build.
- [x] Jalankan CI gagal secara nyata pada PR bukti, kemudian perbaiki dan jalankan CI lolos; proteksi `master` dan ambil bukti pada halaman PR.
- [x] Hubungkan proyek Vercel ke repository dan branch produksi `master`, verifikasi deployment serta deep link.
- [x] Perbarui checklist dengan bukti sebenarnya dan siapkan ZIP tanpa `node_modules`, `.git`, output minify, atau secret.

## Batasan dan pemeriksaan

- Pertahankan fitur forum, votes thread/komentar, leaderboard, filter, serta arsitektur Redux/React yang ada.
- Penghapusan `.gitignore` dan `dist/` sudah ada sebelum tugas ini; jangan menganggapnya bagian perubahan baru.
- Test reducer harus memanggil reducer langsung. Test selector dan thunk tidak dihitung sebagai test reducer.
- E2E harus menjalankan aplikasi penuh di browser; fixture hanya menggantikan layanan jaringan eksternal.
- Jangan membuat bukti CI palsu. Bukti error berasal dari assertion test yang benar-benar gagal pada GitHub Actions.
- URL produksi, branch protection, dan screenshot hanya dinyatakan selesai setelah pemeriksaan layanan eksternal.
- Review khusus: request lama, auth belum pulih, kegagalan API, perubahan sesi, dan redirect setelah login.
