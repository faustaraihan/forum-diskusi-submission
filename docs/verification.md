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
| `npm test` | 48 tes lulus pada 9 berkas; exit 0. |
| `npm run lint` | Tidak ada error/warning; exit 0. |
| `npm run build` | Berhasil; exit 0. |
| Dependency audit | 0 vulnerabilities saat install dan refresh lockfile. |
| Browser desktop 1440 x 1000 | Daftar, detail, komentar, filter dan leaderboard memakai data asli; tidak ada horizontal overflow. |
| Browser mobile 390 x 844 | Daftar, login, register dan leaderboard terbaca; tidak ada horizontal overflow pada halaman yang diperiksa. |
| Guest actions | Vote dan buat diskusi mengarah ke login dengan konteks tujuan. |
| Validasi register di browser | Password 3 karakter ditolak sebelum request; tidak membuat akun server. |
| Console dev | Tidak ada log error/warning React pada sesi pemeriksaan. |
| ZIP | Script berhasil; memeriksa source/config wajib serta absennya node_modules, dist, .git dan .env. |

Review independen dilakukan setelah baseline verifikasi ini; temuan dan hasil regresi dicatat pada pembaruan berikutnya. Checklist submission menunjukkan implementasi yang diperiksa (tes/mock untuk mutasi), bukan bukti semua operasi sudah dijalankan pada server publik.
