# Panduan Submission: Aplikasi Forum Diskusi dengan React dan Redux

> Acuan proyek untuk course **Menjadi React Web Developer Expert** — **Proyek: Membangun Aplikasi React dengan Redux**.
>
> Sumber: [Instruksi Submission Dicoding](https://www.dicoding.com/academies/418/tutorials/24493/submission-guidance).
>
> Dicatat pada **5 Oktober 2026 (Asia/Jakarta)** dari tab Chrome pengguna yang sudah terbuka. Seluruh lima tab panduan dibaca: Pengantar, Kriteria, Instruksi Pengerjaan, Penilaian, dan Lainnya.
>
> Bagian 1–5 menyusun ulang seluruh isi panduan menjadi Markdown, dengan mempertahankan ketentuan, status wajib/opsional, dan tautannya. Bagian 6–7 adalah acuan kerja dan checklist turunan untuk agent; bukan persyaratan tambahan dari Dicoding. Dokumen ini tidak berarti proyek sudah memenuhi kriteria.

## 1. Pengantar

Materi yang telah dipelajari sebelum submission ini:

- Mengikuti Style Guide dalam menulis kode.
- Menggunakan ESLint sebagai JavaScript linter.
- Menggunakan Strict Mode untuk memperbaiki bugs yang disorot.
- Mengelola state dengan perubahan yang terprediksi.
- Membangun aplikasi nyata dengan React dan Redux.

Asesmen dilakukan dengan membangun aplikasi React dan Redux bertema **Aplikasi Forum Diskusi**. Reviewer akan memeriksa pekerjaan dan memberikan review pada proyek tersebut.

## 2. Kriteria

### 2.1. Tujuan akhir

Bangun aplikasi React bertema **Aplikasi Forum Diskusi** yang memanfaatkan [Dicoding Forum API](https://forum-api.dicoding.dev/v1/).

Dicoding mengedepankan kreativitas dalam membangun aplikasi, dengan tetap memenuhi seluruh kriteria utama di bawah ini.

### 2.2. Kriteria Utama 1 — Fungsionalitas aplikasi (wajib)

1. Terdapat cara untuk mendaftar akun.
2. Terdapat cara untuk login akun.
3. Menampilkan daftar thread.
4. Saat item thread dipilih, tampilkan detail thread beserta komentarnya.
5. Pengguna dapat membuat thread.
6. Pengguna dapat membuat komentar di dalam sebuah thread.
7. Menampilkan **loading indicator** saat memuat data dari API.

#### Ketentuan autentikasi

- Melihat resource threads boleh mewajibkan login ataupun tidak; pilihannya dibebaskan.
- Interaksi yang mengubah data, seperti membuat thread atau komentar, **wajib dilakukan oleh pengguna yang terautentikasi**.

#### Informasi pada item daftar thread

| Informasi | Status |
| --- | --- |
| Judul thread | Wajib |
| Potongan body thread | Opsional |
| Waktu pembuatan thread | Wajib |
| Jumlah komentar | Wajib |
| Nama pembuat thread | Wajib |
| Avatar pembuat thread | Opsional |

#### Informasi pada halaman detail thread

| Informasi | Status |
| --- | --- |
| Judul thread | Wajib |
| Body thread | Wajib |
| Waktu pembuatan thread | Wajib |
| Nama pembuat thread | Wajib |
| Avatar pembuat thread | Wajib |
| Komentar pada thread tersebut | Wajib |

Minimal informasi pada setiap komentar:

| Informasi | Status |
| --- | --- |
| Konten komentar | Wajib |
| Waktu pembuatan komentar | Wajib |
| Nama pembuat komentar | Wajib |
| Avatar pembuat komentar | Opsional |

### 2.3. Kriteria Utama 2 — Bugs Highlighting (wajib)

1. Gunakan **ESLint** pada source code aplikasi. Proyek harus memiliki berkas konfigurasi ESLint sebagai indikasinya.
2. Terapkan salah satu Code Convention berikut:
   - [Dicoding Academy JavaScript Style Guide](https://github.com/dicodingacademy/javascript-style-guide).
   - [AirBnB JavaScript Style Guide](https://github.com/airbnb/javascript).
   - [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).
   - [StandardJS Style Guide](https://standardjs.com/).
3. Tidak ada indikasi **error** yang ditampilkan ESLint.
4. Gunakan **React Strict Mode**.

### 2.4. Kriteria Utama 3 — Arsitektur aplikasi (wajib)

1. Hampir seluruh state aplikasi, terutama yang bersumber dari API, disimpan di **Redux Store**. Form input atau controlled component boleh mengelola state sendiri.
2. **Tidak ada pemanggilan REST API di dalam lifecycle atau efek pada komponen.**
3. Pisahkan kode **UI** dan **state** di folder yang berbeda.
4. Komponen React bersifat **modular dan reusable**.

### 2.5. Saran 1 — Votes pada thread dan komentar (opsional)

Untuk membuat proyek lebih unggul:

1. Sediakan tombol untuk melakukan votes pada **thread dan komentar**.
2. Tampilkan indikasi pada tombol ketika pengguna sudah melakukan vote. Contoh: warna tombol berubah dari abu-abu menjadi merah setelah up-vote/down-vote.
3. Utamakan User Experience dengan **Optimistically Apply Actions**.
4. Tampilkan jumlah votes pada **thread dan komentar**.

### 2.6. Saran 2 — Leaderboard (opsional)

1. Sediakan halaman untuk menampilkan leaderboard.
2. Setiap item leaderboard harus menampilkan:
   - Nama pengguna.
   - Avatar pengguna.
   - Score.

### 2.7. Saran 3 — Filter daftar thread berdasarkan kategori (opsional)

Sediakan fitur untuk memfilter item thread yang ditampilkan di halaman daftar threads.

**Catatan:** API tidak menyediakan endpoint untuk filter daftar threads. Fitur ini dibangun sepenuhnya di frontend dengan memanipulasi state aplikasi.

### 2.8. Contoh aplikasi dan kreativitas

Contoh gambaran besar aplikasi: [Dicoding Forum App](https://dicoding-forum-app.vercel.app/).

Dicoding mendorong peserta untuk berkreasi, menambah atau menetapkan gaya secara mandiri. **Hindari meniru persis contoh aplikasi**, dan gunakan proyek ini untuk mengasah kemampuan serta kreativitas.

## 3. Instruksi pengerjaan

### 3.1. Buat rencana yang matang

1. **Buat sketsa aplikasi.** Tentukan visual berdasarkan fungsionalitasnya. Menggambar setiap halaman memakai kertas dan pensil membantu menentukan informasi yang perlu ada pada halaman. Alternatifnya, gunakan aplikasi mock-up gratis seperti [Figma](https://www.figma.com/).
2. **Pecah view menjadi hierarki komponen.** Setelah menggambar halaman, tandai bagian yang bisa menjadi komponen terpisah dengan garis kotak. Ini membantu menentukan hierarki komponen.
3. **Tentukan action yang dapat terjadi.** Analisis tindakan terhadap data, misalnya menetapkan state dari API, menambah state, dan memodifikasi state. Ini membantu menentukan state serta action yang perlu dibuat.

### 3.2. Fase coding

Urutan yang disarankan oleh panduan:

1. Buat folder baru untuk memulai proyek React. Panduan menyarankan [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) supaya tidak perlu menyiapkan module bundler dan hal terkait secara manual.
2. Pasang dependencies yang sudah pasti dibutuhkan, seperti `redux` atau Redux Toolkit, `react-redux`, dan lainnya. Jangan pasang dependencies yang belum dibutuhkan.
3. Buat kode yang berkaitan dengan state terlebih dahulu, seperti action dan reducer. Lalu buat Redux Store dan daftarkan seluruh reducer.
4. Uji Redux Store dan pastikan bekerja dengan baik; dapat dicek melalui console terlebih dahulu.
5. Buat komponen dan pastikan store berfungsi dengan baik saat digunakan oleh komponen.
6. Tambahkan `react-router` ketika dibutuhkan.
7. Selesaikan aplikasi berdasarkan kriteria.

Peserta yang sudah berpengalaman membangun aplikasi boleh menyesuaikan alur dengan kebutuhan sendiri. Penyebutan create-react-app di atas merupakan **saran dalam sumber**, bukan kriteria wajib penggunaan tooling tertentu.

### 3.3. Estimasi dan istirahat

- Ambil jeda untuk beristirahat supaya kondisi badan dan pikiran tetap segar dan hasil kerja lebih berkualitas.
- Estimasi pengerjaan: **20 jam**.
- Contoh pembagian: **2 jam per hari selama 10 hari**.
- Submission ini tidak dirancang untuk dikerjakan secara maraton.

## 4. Penilaian

Reviewer memberi nilai dalam skala **1–5** untuk submission yang diterima.

### 4.1. Saran untuk nilai tinggi

- Terapkan Saran 1: votes pada thread dan komentar.
- Terapkan Saran 2: leaderboard.
- Terapkan Saran 3: filter daftar thread berdasarkan kategori.
- Buat aplikasi mudah digunakan: alurnya tidak membingungkan dan pilihan warna memudahkan membaca teks.
- Buat tampilan aplikasi menarik.

### 4.2. Rubrik nilai

| Nilai | Ketentuan dalam panduan |
| --- | --- |
| 1 | Semua ketentuan wajib terpenuhi, tetapi terdapat indikasi kecurangan saat mengerjakan submission. |
| 2 | Semua ketentuan wajib terpenuhi, tetapi ada kekurangan penulisan kode, misalnya tidak menerapkan modularization atau gaya penulisan tidak konsisten. |
| 3 | Semua ketentuan wajib terpenuhi, tetapi tidak ada improvisasi atau persyaratan opsional yang dipenuhi. |
| 4 | Semua ketentuan wajib terpenuhi dan menerapkan minimal dua poin saran di atas. |
| 5 | Semua ketentuan wajib terpenuhi dan menerapkan seluruh saran di atas. |

**Catatan:** Submission yang ditolak tidak mendapatkan penilaian. Rubrik ini hanya berlaku pada submission yang diterima. Aturan penolakan pada bagian 5 juga menyebut kecurangan/plagiasi; jangan menganggap baris nilai 1 sebagai izin melakukan kecurangan.

### 4.3. Tips pembagian workload

Saran pada submission ini juga berlaku pada submission berikutnya. Peserta boleh membagi workload dengan menerapkan sebagian saran pada submission kedua, alih-alih menyelesaikan semua saran pada submission pertama.

## 5. Lainnya

### 5.1. Ketentuan berkas submission

- Kirim folder proyek Aplikasi Forum Diskusi dalam bentuk **ZIP**.
- Proyek harus berupa React yang dirender menggunakan **react-dom**, bukan react-native.
- **Jangan sertakan folder `node_modules` dalam ZIP**, karena membuat ukuran besar dan fitur code review tidak dapat berfungsi.
- Berkas aset, seperti gambar, boleh disertakan apabila digunakan pada proyek.

Catatan pencatatan: sumber menulis “Hapus folder node_modules ke dalam berkas ZIP”; ketentuan di atas menyatakan maksudnya berdasarkan penjelasan ukuran berkas dan code review. Yang perlu dikecualikan adalah `node_modules` dari arsip kiriman, tanpa perlu menghapus instalasi lokal.

### 5.2. Submission akan ditolak bila

1. Kriteria utama tidak terpenuhi.
2. Ketentuan berkas submission tidak terpenuhi.
3. Menggunakan framework atau UI library selain React.
4. Mengirim kode JavaScript yang telah di-minify.
5. Melakukan kecurangan, seperti plagiasi.

### 5.3. Ketentuan proses review

- Reviewer mengulas submission paling lambat **3 hari kerja**, tidak termasuk Sabtu, Minggu, dan hari libur nasional.
- Tidak disarankan melakukan submit berkali-kali karena dapat memperlama penilaian.
- Notifikasi hasil review dikirim melalui email.
- Status juga dapat dicek pada halaman submission.

## 6. Acuan kerja untuk agent coding (turunan, bukan aturan tambahan Dicoding)

1. Baca dokumen ini sebelum merencanakan implementasi atau mengaudit submission. Gunakan bagian 2 dan 5 sebagai batas kelulusan; bagian 4 sebagai rubrik peningkatan kualitas.
2. Periksa kondisi proyek dan instruksi repository yang sudah ada sebelum mengubah kode. Jangan menganggap checklist yang belum dicentang sebagai bukti fitur belum ada; audit implementasinya terlebih dahulu.
3. Tentukan target saran opsional bersama pengguna. Untuk mengejar nilai 5, rencanakan ketiga fitur opsional beserta kemudahan penggunaan dan tampilan menarik.
4. Baca dokumentasi API resmi sebelum menentukan endpoint, payload, autentikasi, dan struktur respons. Halaman panduan yang dicatat di sini tidak merinci kontrak endpoint; jangan menebaknya.
5. Tempatkan request API pada lapisan API dan action async/thunk yang sesuai, lalu simpan hasilnya di Redux. Komponen dapat melakukan dispatch action; jangan menaruh request REST langsung di lifecycle atau `useEffect` komponen.
6. State lokal untuk form diperbolehkan. Pisahkan folder UI dari folder pengelolaan state, dan pecah UI menjadi komponen yang dapat digunakan kembali.
7. Bila menerapkan optimistic voting, pertimbangkan penanganan kegagalan request agar tampilan kembali konsisten dengan server. Penanganan kegagalan ini adalah arahan implementasi, bukan rincian eksplisit dalam rubrik.
8. Filter kategori di frontend berdasarkan data threads/state yang tersedia, bukan dengan mengasumsikan adanya endpoint filter.
9. Gunakan gaya visual sendiri. Jadikan aplikasi contoh sebagai referensi fungsional, dan hindari menyalin proyek atau tampilannya secara persis.
10. Sebelum menyatakan siap dikirim, verifikasi perilaku aplikasi, hasil ESLint, dan isi arsip. Dokumentasikan hasil pemeriksaan nyata; jangan mengklaim lulus review Dicoding sebelum hasil reviewer diterima.

## 7. Checklist verifikasi submission

Checklist awal belum diisi karena pekerjaan ini hanya mencatat panduan, bukan mengaudit atau mengimplementasikan aplikasi.

### 7.1. Fungsionalitas wajib

- [ ] Pengguna dapat mendaftar akun.
- [ ] Pengguna dapat login.
- [ ] Daftar thread ditampilkan.
- [ ] Memilih thread membuka detail beserta komentar.
- [ ] Pengguna terautentikasi dapat membuat thread.
- [ ] Pengguna terautentikasi dapat menambahkan komentar.
- [ ] Interaksi perubahan data mensyaratkan autentikasi.
- [ ] Loading indicator terlihat selama pemuatan data API.
- [ ] Item daftar memiliki judul, waktu pembuatan, jumlah komentar, dan nama pembuat.
- [ ] Detail memiliki judul, body, waktu pembuatan, nama dan avatar pembuat, serta komentar.
- [ ] Komentar memiliki konten, waktu pembuatan, dan nama pembuat.

### 7.2. Bugs Highlighting dan arsitektur wajib

- [ ] Konfigurasi ESLint tersedia dan digunakan.
- [ ] Salah satu dari empat Code Convention yang diizinkan diterapkan.
- [ ] ESLint tidak melaporkan error.
- [ ] React Strict Mode digunakan.
- [ ] Hampir seluruh state aplikasi, khususnya data API, disimpan di Redux Store.
- [ ] Tidak ada request REST API langsung di lifecycle atau efek komponen.
- [ ] Folder UI dan state terpisah.
- [ ] Komponen modular dan reusable.

### 7.3. Saran opsional dan kualitas

- [ ] Tombol vote tersedia pada thread dan komentar.
- [ ] Tombol mengindikasikan vote pengguna saat ini.
- [ ] Votes menggunakan Optimistically Apply Actions.
- [ ] Jumlah votes pada thread dan komentar ditampilkan.
- [ ] Halaman leaderboard tersedia.
- [ ] Item leaderboard menampilkan nama, avatar, dan score.
- [ ] Filter kategori tersedia pada daftar threads.
- [ ] Filter kategori bekerja di frontend dengan state aplikasi.
- [ ] Aplikasi mudah digunakan dan teks mudah dibaca.
- [ ] Tampilan aplikasi menarik dan memiliki gaya sendiri.

### 7.4. Berkas dan pengiriman

- [ ] Folder proyek React disiapkan dalam ZIP.
- [ ] Aplikasi menggunakan react-dom.
- [ ] ZIP tidak berisi node_modules.
- [ ] Aset yang disertakan digunakan oleh proyek.
- [ ] Source JavaScript yang dikirim tidak di-minify.
- [ ] Tidak menggunakan framework atau UI library selain React sesuai ketentuan sumber.
- [ ] Tidak ada plagiasi atau kecurangan.
- [ ] Seluruh kriteria utama dan ketentuan berkas diperiksa sebelum dikirim.
