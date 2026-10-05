# Verifikasi Ruang Diskusi

Tanggal: 5 Oktober 2026 (Asia/Jakarta). Branch lokal: `feat/ruang-diskusi`.

## Cakupan pengujian

- Vitest menguji API boundary, siklus autentikasi, bootstrap deduplication, filter kategori, author lookup, stale detail responses, comment count/avatar, optimistic vote/neutral/switch/rollback, pending gating, logout races, sanitasi, redirect aman, form validation/error/retry, dan scroll/focus navigasi.
- Request jaringan mutasi pada tes digantikan mock. State Redux, thunks, reducers, selectors dan form React yang diuji tetap implementasi sebenarnya.
- Browser memeriksa API asli untuk daftar, detail, komentar dan leaderboard tanpa login; filter kategori lokal; guest vote mengarahkan ke login.
- Mobile 390 x 844 diperiksa secara visual dan melalui ukuran DOM. Ditemukan route navigation mempertahankan scroll lama; diperbaiki dengan regresi RED → GREEN.

## Batas yang harus diketahui

- Belum menguji pendaftaran/login sukses serta posting/votes pada server publik dengan akun asli. Perilaku sukses dan gagal sudah diuji otomatis menggunakan mock jaringan.
- Aplikasi belum di-deploy dan belum dikirim ke Dicoding. SPA fallback hosting perlu diterapkan saat deployment.
- Skor 5 adalah target rancangan, bukan hasil review yang sudah diperoleh.

## Bukti akhir

| Pemeriksaan | Hasil |
| --- | --- |
| `npm test` | 54 tes lulus pada 9 berkas; exit 0. |
| `npm run lint` | Tidak ada error/warning; exit 0. |
| `npm run build` | Berhasil; exit 0. |
| Dependency audit | 0 vulnerabilities saat install dan refresh lockfile. |
| Browser desktop 1440 x 1000 | Daftar, detail, komentar, filter dan leaderboard memakai data asli; tidak ada horizontal overflow. |
| Browser mobile 390 x 844 | Daftar, login, register dan leaderboard terbaca; tidak ada horizontal overflow pada halaman yang diperiksa. |
| Guest actions | Vote dan buat diskusi mengarah ke login dengan konteks tujuan. |
| Validasi register di browser | Password 3 karakter ditolak sebelum request; tidak membuat akun server. |
| Console dev | Tidak ada log error/warning React pada sesi pemeriksaan. |
| Preview produksi | URL detail dibuka langsung dan route tidak valid menampilkan fallback; console preview tanpa error/warning. |
| ZIP | Script berhasil; memeriksa source/config wajib serta absennya node_modules, dist, .git dan .env. |

Checklist submission menunjukkan implementasi yang diperiksa (tes/mock untuk mutasi), bukan bukti semua operasi sudah dijalankan pada server publik.

## Review independen dan perbaikan

Satu reviewer independen memeriksa seluruh aplikasi setelah baseline 48 tes. Tidak ada temuan Critical atau Minor; tiga temuan Important direproduksi dan diperbaiki dalam satu pass:

1. **GET yang overlap dapat menghapus optimistic vote yang sukses.** Snapshot request sekarang menyimpan revision dan target vote yang pending pada awal pemuatan. Data yang datang direkonsiliasi dengan perubahan pengguna yang lebih baru, termasuk ketika POST selesai sebelum GET. Regresi thread diuji untuk dua urutan penyelesaian, ditambah komentar dan daftar.
2. **Detail cache dapat berbeda dari daftar saat menghitung toggle.** Pemuatan daftar menyinkronkan membership votes pada detail cache yang cocok. Regresi membuktikan klik up-vote terpilih pada daftar mengirim neutral vote, bukan up-vote ulang.
3. **Pemulihan sesi yang gagal pada halaman publik tidak menyediakan retry.** Shared layout sekarang memberi pesan dan tombol retry; vote dinonaktifkan dan komentar menunggu pemulihan sesi, bukan menganggap pengguna sebagai guest. Regresi membuktikan retry memulihkan akun tersimpan tanpa login ulang.

Enam tes baru diamati gagal terhadap kode lama, kemudian lulus setelah perbaikan. Seluruh 54 tes, lint, dan build kembali lulus. Tidak ada temuan minor yang ditunda.

Keputusan eksekusi: proyek dibuat langsung dalam folder kosong pengguna, pada branch baru (tanpa linked worktree); ledger dikelola menggunakan PowerShell karena lingkungan Windows. Risiko keputusan tersebut adalah kebutuhan memindahkan checkout atau menelusuri bookkeeping manual bila alur kerja berubah. Tidak ada merge, push, remote, deployment, atau submit otomatis.

Review tidak menilai keberhasilan mutasi pada server publik atau konfigurasi hosting yang belum dibuat. Keputusan: pertahankan batas tersebut secara eksplisit; risiko tersisa adalah perbedaan integrasi akun asli dan kebutuhan SPA fallback di hosting nantinya.
