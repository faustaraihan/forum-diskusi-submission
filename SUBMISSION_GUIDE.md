# Submission: Menerapkan Automation Testing dan CI/CD pada Aplikasi Forum Diskusi

> Acuan untuk melanjutkan codebase **ruang-diskusi** dari submission sebelumnya.
> Dibaca langsung dari tab Chrome pengguna pada **6 Oktober 2026 (Asia/Jakarta)**.
> Dokumen ini merangkum seluruh ketentuan teks pada empat tab panduan, menyertakan gambar contoh asli, lalu menambahkan catatan lokal untuk pengerjaan berikutnya.

- Kelas: **Menjadi React Web Developer Expert**.
- [Sumber resmi panduan submission](https://www.dicoding.com/academies/418/tutorials/24523/submission-guidance).
- [Daftar React Ecosystem yang dirujuk panduan](https://github.com/dicodingacademy/awesome-react-ecosystem#react-tools).
- Bagian 1–4 merupakan catatan dari panduan Dicoding. Bagian 5–7 merupakan pengamatan dan acuan kerja lokal, bukan persyaratan tambahan dari Dicoding.
- Bila panduan resmi berubah, periksa kembali sumber dan perbarui dokumen ini.

## 1. Pengantar

Submission ini merupakan asesmen akhir kelas. Materi yang telah dipelajari mencakup:

1. Pengujian otomatis aplikasi React pada tingkat Unit, Integration atau Component, dan End-to-End.
2. Penggunaan Jest, React Testing Library, dan Cypress untuk pengujian otomatis.
3. Kultur TDD.
4. Pengelolaan source code menggunakan Git.
5. Deployment yang efisien, cepat, dan aman melalui CI/CD.
6. Ecosystem atau library untuk mempercepat dan mengefisienkan pengembangan.

Tugasnya adalah menerapkan **Automation Testing dan CI/CD pada Aplikasi Forum Diskusi yang sudah dibuat pada submission sebelumnya**. Reviewer akan memeriksa pekerjaan tersebut untuk menentukan kelulusan kelas.

## 2. Kriteria

### Tujuan akhir

1. Membuat pengujian Unit, Integration, dan End-to-End pada aplikasi forum diskusi.
2. Deploy aplikasi forum diskusi dengan teknik CI/CD.
3. Memanfaatkan salah satu React Ecosystem pada aplikasi forum diskusi.

### Kriteria utama 1: Automation Testing

1. Minimal **dua pengujian fungsi reducer**.
2. Minimal **dua pengujian thunk function**.
3. Minimal **dua pengujian React components**.
4. Minimal **satu pengujian End-to-End untuk alur login aplikasi**.
5. **Skenario pengujian wajib ditulis pada setiap berkas pengujian**.
6. Pengujian dapat dijalankan menggunakan:

   ```sh
   npm test
   npm run e2e
   ```

Catatan resmi: fungsi reducer, thunk, dan komponen yang diuji boleh dipilih sendiri. Dicoding menyarankan unit yang kompleks, misalnya reducer dengan banyak kondisi atau thunk yang men-dispatch banyak action.

### Kriteria utama 2: Deployment aplikasi

1. Deploy aplikasi menggunakan teknik **CI/CD**.
2. Continuous Integration menggunakan **GitHub Actions**.
3. Continuous Deployment menggunakan **Vercel**.
4. **Proteksi branch `master`**.
5. Sertakan **URL aplikasi Vercel pada catatan submission**.
6. Lampirkan screenshot bukti konfigurasi CI/CD dan branch protection berikut:

| Nama bukti pada panduan | Isi screenshot yang wajib ditunjukkan |
| --- | --- |
| `1_ci_check_error` | CI check error karena pengujian gagal. |
| `2_ci_check_pass` | CI check pass karena pengujian lolos. |
| `3_branch_protection` | Proteksi branch pada halaman Pull Request. |

#### Gambar contoh resmi: CI gagal

![Contoh resmi 1_ci_check_error](https://assets.cdn.dicoding.com/original/academy/dos:9ad5ec697da017001967f5a230f0c0f020221111102335.jpeg)

#### Gambar contoh resmi: CI berhasil

![Contoh resmi 2_ci_check_pass](https://assets.cdn.dicoding.com/original/academy/dos:d5d5fc9ae2eb95f6682dbd4266f2ef5d20221111102422.jpeg)

#### Gambar contoh resmi: proteksi branch

![Contoh resmi 3_branch_protection](https://assets.cdn.dicoding.com/original/academy/dos:7b70f73cc59019697967ec26f092c8eb20221111102459.jpeg)

#### Catatan penting deployment

- Screenshot harus berada **di dalam ZIP proyek**.
- Panduan menyatakan bahwa branch protection hanya bisa dilakukan di repository public. Ini dicatat sebagai ketentuan/keterangan panduan; kondisi layanan GitHub pada akun pengguna belum diperiksa.
- Untuk meminimalkan plagiarisme di kemudian hari, Dicoding menyarankan mengubah repository menjadi **private setelah penilaian submission selesai**.
- Gambar di dokumen ini merupakan contoh dari Dicoding, bukan bukti penerapan CI/CD pada repository ini. Submission membutuhkan screenshot hasil proyek sendiri.

![Contoh resmi struktur folder ZIP proyek](https://assets.cdn.dicoding.com/original/academy/dos:41cb311286c38353c5030f2d9dc7fb0120221111102537.jpeg)

### Kriteria utama 3: Memanfaatkan salah satu Ecosystem React

Gunakan minimal **satu React Ecosystem** dari [daftar yang dirujuk Dicoding](https://github.com/dicodingacademy/awesome-react-ecosystem#react-tools).

Penggunaan ecosystem berikut **tidak diperhitungkan untuk memenuhi kriteria ini**:

- Create React Apps.
- Vite.
- React Router.
- React Icons.
- Redux.
- Redux Thunk.
- Redux Toolkit.
- Jest.
- Vitest.
- React Testing Library.

Jadi, keberadaan Redux Toolkit, Vite, Vitest, React Router, atau React Testing Library saja belum membuktikan bahwa kriteria ecosystem terpenuhi.

### Kriteria utama 4: Mempertahankan kriteria submission sebelumnya

Aplikasi harus mempertahankan seluruh kriteria utama submission sebelumnya:

1. Fungsionalitas Aplikasi.
2. Bugs Highlighting.
3. Arsitektur Aplikasi.

Halaman panduan submission ini hanya menyebut tiga nama kriteria tersebut, tanpa mengulang rincian panduan sebelumnya. Rincian itu perlu dibaca dari panduan submission sebelumnya saat melakukan audit lengkap; jangan mengarang atau menganggap semua rincian sudah tercakup di dokumen ini.

## 3. Penilaian

Reviewer memberi nilai dalam skala **1–5**. Saran untuk mendapatkan nilai tinggi:

1. Lebih dari tiga pengujian fungsi reducer, yaitu **minimal empat**.
2. Lebih dari tiga pengujian fungsi thunk, yaitu **minimal empat**.
3. Lebih dari tiga pengujian React components, yaitu **minimal empat**.
4. Memiliki **minimal dua stories komponen**.
5. Menerapkan saran dari submission sebelumnya:
   - Votes pada thread dan komentar.
   - Menampilkan leaderboard.
   - Filter daftar thread berdasarkan kategori.
6. Saran lainnya:
   - Aplikasi mudah digunakan, tidak membingungkan, dan menggunakan warna yang membuat teks mudah dibaca.
   - Tampilan aplikasi menarik.

| Nilai | Ketentuan yang dijelaskan panduan |
| --- | --- |
| 1 | Semua ketentuan wajib terpenuhi, tetapi ditemukan indikasi kecurangan dalam pengerjaan. |
| 2 | Semua ketentuan wajib terpenuhi, tetapi penulisan kode memiliki kekurangan, misalnya tidak modular atau gaya penulisan tidak konsisten. |
| 3 | Semua ketentuan wajib terpenuhi, tetapi tidak ada improvisasi atau persyaratan opsional yang dipenuhi. |
| 4 | Semua ketentuan wajib terpenuhi dan minimal tiga poin saran diterapkan. |
| 5 | Semua ketentuan wajib terpenuhi dan seluruh saran diterapkan. |

**Catatan resmi:** submission yang ditolak tidak mendapatkan penilaian.

## 4. Lainnya

### Ketentuan berkas submission

- Kirim folder proyek aplikasi forum diskusi dalam bentuk **ZIP**.
- Proyek menggunakan **React yang di-render dengan `react-dom`**, bukan `react-native`.
- **Jangan sertakan `node_modules` dalam ZIP** karena memperbesar ukuran berkas dan membuat fitur code review tidak berfungsi.
- Boleh menyertakan aset seperti gambar selama aset tersebut digunakan pada proyek.

### Penyebab penolakan

- Kriteria utama tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Menggunakan framework atau UI library selain React.
- Mengirim kode JavaScript yang sudah di-minify.
- Melakukan kecurangan seperti plagiasi.

### Ketentuan proses review

- Review dilakukan selambatnya **tiga hari kerja**, tidak termasuk Sabtu, Minggu, dan hari libur nasional.
- Submit berulang kali tidak disarankan karena dapat memperlama proses penilaian.
- Hasil review diberitahukan melalui email.
- Status submission juga dapat dilihat pada halaman submission.

## 5. Kondisi awal codebase lokal

Pengamatan pada 6 Oktober 2026. Ini adalah inspeksi berkas, **bukan hasil menjalankan pengujian atau verifikasi layanan eksternal**.

- Nama package: `ruang-diskusi`.
- Branch aktif saat pencatatan: `feat/ruang-diskusi`.
- Commit terakhir saat pencatatan: `3d44653` — `feat: completed the whole project`.
- Stack pada `package.json`: React, React DOM, Vite, Redux Toolkit, React Redux, React Router, DOMPurify, Vitest, dan React Testing Library.
- `npm test` sudah tersedia dan menjalankan `vitest run`.
- Script `npm run e2e` belum tersedia.
- Konfigurasi Vitest di `vite.config.js` menggunakan `jsdom` dan `src/test/setup.js`.
- Tidak ditemukan folder `.github`, konfigurasi Storybook, atau berkas E2E pada inventaris awal proyek.
- Konfigurasi GitHub Actions, deployment Vercel, dan branch protection di layanan eksternal belum diperiksa.
- Keberadaan DOMPurify belum divalidasi terhadap daftar ecosystem yang dirujuk; jangan langsung menandai kriteria ecosystem sebagai selesai.

### Pengujian yang sudah ada

| Berkas | Fokus dari inspeksi kode |
| --- | --- |
| `src/states/forum/slice.test.js` | Dua kasus langsung memanggil reducer terkait respons/error lama, serta beberapa kasus thunk/store mengenai daftar, thread baru, dan komentar. |
| `src/states/auth/thunks.test.js` | Bootstrap autentikasi, pemulihan token, login, register, logout, dan respons sesi lama. |
| `src/states/votes/thunks.test.js` | Optimistic voting, respons lama, toggle vote, rollback, komentar, guest, request ganda, dan pergantian sesi. |
| `src/states/forum/selectors.test.js` | Pengujian selector; jangan otomatis dihitung sebagai pengujian reducer. |
| `src/pages/forms.test.jsx` | Pengujian form register, login gagal, thread baru, dan komentar. |
| `src/components/AppLayout.test.jsx` | Navigasi/fokus serta retry sesi dengan interaksi voting dan komentar. |
| `src/services/api.test.js` | Pengujian lapisan API. |
| `src/utils/content.test.js` | Pengujian utilitas konten. |
| `src/utils/redirect.test.js` | Pengujian utilitas redirect. |

Nama kasus `it(...)` sudah menjelaskan perilaku dalam berkas yang dibaca. Kelengkapan penulisan skenario untuk **setiap berkas** masih perlu diaudit. Sebagai konvensi pengerjaan, tulis daftar skenario pada komentar awal setiap berkas agar mudah diperiksa reviewer; ini merupakan pilihan dokumentasi lokal.

### Fitur lanjutan dari submission sebelumnya

Kode yang mendukung fitur berikut sudah ditemukan dan perlu dipertahankan serta diuji kembali:

- Voting thread dan komentar: `src/states/votes/thunks.js`, `src/components/VoteButtons.jsx`, dan endpoint vote di `src/services/api.js`.
- Leaderboard: `src/pages/LeaderboardsPage.jsx` dan `src/states/leaderboards/`.
- Filter kategori: `src/pages/ThreadsPage.jsx`, `src/components/CategoryFilter.jsx`, dan selector forum.
- Halaman login, register, daftar thread, detail thread, dan pembuatan thread sudah ada.
- API yang digunakan: `https://forum-api.dicoding.dev/v1`.

Saat pencatatan, working tree juga sudah memiliki penghapusan `.gitignore` dan sejumlah berkas `dist/`. Perubahan tersebut telah ada sebelum tugas dokumentasi ini. Periksa ulang status Git sebelum melanjutkan; jangan memulihkan atau menghapus perubahan pengguna tanpa memahami konteksnya.

## 6. Checklist pengerjaan dan bukti

Checklist diperbarui setelah pengujian lokal, CI GitHub, proteksi branch, deployment produksi, dan audit ZIP pada 6 Oktober 2026. Rincian bukti ada di `SUBMISSION_NOTES.md`; penilaian akhir tetap dilakukan reviewer Dicoding.

### Wajib

- [x] Minimal dua pengujian reducer yang benar-benar menguji reducer.
- [x] Minimal dua pengujian thunk function.
- [x] Minimal dua pengujian React components.
- [x] Minimal satu pengujian E2E alur login.
- [x] Skenario tertulis pada setiap berkas pengujian.
- [x] `npm test` dapat dijalankan dan lulus.
- [x] `npm run e2e` dapat dijalankan dan lulus.
- [x] CI melalui GitHub Actions telah dijalankan.
- [x] CD melalui Vercel telah diterapkan.
- [x] Branch `master` diproteksi.
- [x] Screenshot `1_ci_check_error` berasal dari kegagalan pengujian CI proyek sendiri.
- [x] Screenshot `2_ci_check_pass` berasal dari kelulusan pengujian CI proyek sendiri.
- [x] Screenshot `3_branch_protection` menunjukkan proteksi pada halaman PR.
- [x] Ketiga screenshot masuk ke ZIP proyek.
- [x] URL aplikasi Vercel dicantumkan pada catatan submission.
- [x] Minimal satu ecosystem yang memenuhi daftar Dicoding digunakan secara nyata.
- [x] Fungsionalitas, Bugs Highlighting, dan Arsitektur submission sebelumnya dipertahankan setelah rincian lama diaudit.
- [x] ZIP memuat source proyek React DOM, tanpa `node_modules` dan tanpa source yang di-minify.
- [x] Aset yang disertakan digunakan oleh proyek.

### Saran untuk nilai tinggi

- [x] Minimal empat pengujian reducer.
- [x] Minimal empat pengujian thunk.
- [x] Minimal empat pengujian React components.
- [x] Minimal dua stories komponen.
- [x] Votes thread dan komentar tetap bekerja.
- [x] Leaderboard tetap bekerja.
- [x] Filter kategori tetap bekerja.
- [x] Aplikasi mudah digunakan dan teks terbaca jelas.
- [x] Tampilan aplikasi menarik.
- [x] Kode modular dan gaya penulisan konsisten.

## 7. Catatan untuk pengembangan berikutnya

1. Lanjutkan aplikasi yang ada; gunakan fitur dan test sebelumnya sebagai baseline.
2. Baca dokumen ini dan status Git terbaru sebelum mengubah codebase.
3. Audit test yang ada berdasarkan jenis pengujian. Jangan menghitung test selector atau thunk/store sebagai test reducer hanya berdasarkan nama berkas.
4. Lengkapi skenario tertulis, cakupan reducer, serta E2E login. Tentukan runner E2E saat implementasi; pengantar menyebut Cypress, tetapi kriteria tidak mewajibkan runner tertentu.
5. Validasi pilihan ecosystem terhadap daftar resmi. Storybook layak dipertimbangkan karena panduan juga menyarankan dua stories, tetapi pilihan dan pemenuhannya harus diverifikasi saat implementasi.
6. Siapkan CI, CD, dan branch protection berdasarkan branch serta repository yang benar. Panduan secara eksplisit menyebut `master`; branch aktif lokal saat pencatatan berbeda, sehingga jangan menganggap proteksi branch lain otomatis memenuhi ketentuan tersebut.
7. Dokumentasikan URL deployment serta bukti CI gagal, CI lolos, dan proteksi PR yang benar-benar terjadi. Jangan menggunakan gambar contoh Dicoding sebagai bukti proyek.
8. Sebelum pengumpulan, jalankan pemeriksaan yang relevan dan audit ZIP terhadap seluruh checklist.

Contoh penempatan bukti berikut merupakan usulan lokal, bukan nama folder wajib dari panduan:

```text
forum-diskusi-submission/
├── src/
├── public/
├── .github/workflows/
├── screenshots/
│   ├── 1_ci_check_error.png
│   ├── 2_ci_check_pass.png
│   └── 3_branch_protection.png
├── package.json
├── package-lock.json
└── SUBMISSION_GUIDE.md
```

URL produksi telah diverifikasi: https://ruang-diskusi.vercel.app. URL dan hasil pemeriksaan dicatat di `SUBMISSION_NOTES.md`.

## Revisi bukti proteksi — 7 Oktober 2026

Reviewer menolak bukti proteksi sebelumnya karena screenshot belum menunjukkan implementasi dengan jelas. Latihan proteksi branch pada tutorial 29015 telah dibaca; konfigurasi PR dan required CI sudah aktif. Proteksi kini juga mewajibkan satu approval dan tetap berlaku untuk administrator. Screenshot 3 diperbarui dari PR #5: checks lulus tetapi merge terblokir karena approval belum ada. Bukti teknis ini sudah diverifikasi; penerimaan submission ulang masih menunggu penilaian reviewer.
