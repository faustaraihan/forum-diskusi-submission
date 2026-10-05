# Ruang Diskusi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun forum React dari nol yang memenuhi seluruh kriteria wajib dan saran submission untuk target nilai 5.

**Architecture:** Komponen merender state Redux dan dispatch thunk. Thunk memanggil API services; Redux menangani autentikasi, data forum, status operasi, filter, dan optimistic votes. CSS sendiri membentuk antarmuka berbahasa Indonesia yang responsif.

**Tech Stack:** JavaScript, React, Vite, Redux Toolkit, React Redux, React Router, DOMPurify, ESLint dengan eslint-config-dicodingacademy, Vitest, jsdom, React Testing Library.

**Spec:** [Rancangan yang disetujui](../specs/2026-10-05-forum-design.md).

**Status:** Siap direview; belum dieksekusi. Pengguna menyetujui rancangan pada 5 Oktober 2026; belum memilih metode eksekusi.

## Global Constraints

- Pengguna telah memilih target nilai maksimal (5).
- Hampir seluruh state aplikasi, terutama data API, disimpan pada Redux Store.
- Request REST hanya dilakukan services yang dipanggil thunk, bukan di lifecycle/efek komponen.
- State lokal hanya untuk input form dan interaksi UI sesaat.
- React Strict Mode diaktifkan.
- ESLint mengikuti **Dicoding Academy JavaScript Style Guide** dan tidak melaporkan error.
- Pengunjung boleh membaca daftar, detail, dan leaderboard tanpa login.
- Menulis thread, komentar, dan voting memerlukan autentikasi.
- Filter kategori dihitung di frontend karena tidak ada endpoint filter.
- Body thread dan konten komentar ditampilkan dengan sanitasi HTML menggunakan DOMPurify sebelum dirender.
- Source tidak di-minify dalam ZIP; arsip menyertakan proyek dan konfigurasi, mengecualikan node_modules.
- Semua antarmuka berbahasa Indonesia, tema terang dengan aksen hijau, CSS sendiri.

Node lokal yang telah diperiksa: v26.5.1; npm 11.17.0; Git tersedia. Resolve dependency dari registry resmi ketika eksekusi, periksa engines/peer dependencies, dan simpan lockfile. Jangan menjalankan scaffold yang menghapus dokumen yang sudah ada. Tidak membuat remote, push, atau deployment otomatis.

## Review Focus

1. Respons detail A datang setelah pengguna membuka B: hanya B yang tampil (Task 3).
2. Startup gagal karena jaringan, bukan token invalid: sesi tidak dihapus secara keliru dan retry tersedia (Task 2).
3. Vote gagal sementara data lain berubah: rollback hanya membership vote pengguna pada target tersebut (Task 5).
4. Body/komentar membawa HTML berbahaya atau teks sangat panjang: sanitasi menjaga konten aman dan layout tidak melebar (Task 4 dan 8).
5. URL tujuan login berasal dari input tak tepercaya: redirect hanya ke path aplikasi sendiri (Task 6).

## Peta file dan kontrak bersama

```text
index.html, package.json, package-lock.json, vite.config.js, eslint.config.mjs
.gitignore, README.md, scripts/package-submission.ps1
src/main.jsx
src/app/{App.jsx,store.js}
src/services/{api.js,token.js}
src/states/auth/{slice.js,thunks.js}
src/states/forum/{slice.js,thunks.js,selectors.js}
src/states/votes/{thunks.js,model.js}
src/states/leaderboards/{slice.js,thunks.js}
src/components/{AppLayout,Avatar,AsyncState,ProgressBar,ThreadCard,
  CategoryFilter,VoteButtons,CommentItem,FormField,RequireAuth,SafeHtml}.jsx
src/pages/{ThreadsPage,ThreadDetailPage,NewThreadPage,LoginPage,
  RegisterPage,LeaderboardsPage,NotFoundPage}.jsx
src/utils/{content.js,date.js,redirect.js}
src/styles/{tokens.css,global.css,layout.css,forum.css,forms.css}
src/test/setup.js
```

Tests berada dekat modul: `api.test.js`, `auth/thunks.test.js`, `forum/slice.test.js`, `forum/selectors.test.js`, `votes/thunks.test.js`, `utils/content.test.js`, `utils/redirect.test.js`, dan `pages/forms.test.jsx`.

Kontrak store:

```js
{
  auth: { user: null, initialized: false, status: 'idle', error: null },
  forum: {
    threads: [], users: [], detail: null, category: '',
    list: { status: 'idle', error: null, requestId: null },
    detailLoad: { status: 'idle', error: null, requestId: null, threadId: null },
    create: { status: 'idle', error: null },
    comment: { status: 'idle', error: null },
    votePending: {}, voteErrors: {},
  },
  leaderboards: { items: [], status: 'idle', error: null },
}
```

Status operasi: `idle | loading | succeeded | failed`. `ApiError` memiliki `status` HTTP dan `message`. Semua thunk menerima hasil API yang sudah di-unpack, bukan envelope `{status,message,data}`. Dispatch thunk dari komponen memakai `.unwrap()` bila navigasi bergantung pada sukses.

## Task 1: Fondasi aplikasi dan toolchain

**Create:** `package.json`, `index.html`, `.gitignore`, `vite.config.js`, `eslint.config.mjs`, `src/main.jsx`, `src/app/App.jsx`, `src/app/store.js`, `src/test/setup.js`, `src/styles/tokens.css`, `src/styles/global.css`.

**Produces:** script `dev`, `build`, `preview`, `lint`, `test`; `createAppStore(preloadedState)` dan store default; aplikasi minimal berjalan dalam StrictMode dan Provider.

- [ ] Buat manifest tanpa scaffold destruktif. Scripts yang harus tersedia:

```json
{
  "name": "ruang-diskusi",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run"
  }
}
```

- [ ] Resolve dan install dependency; sebelum instalasi periksa `npm view vite engines` dan peer dependencies konfigurasi ESLint. Pin versi terpilih di manifest/lockfile:

```powershell
npm install --save-exact react react-dom @reduxjs/toolkit react-redux react-router-dom dompurify
npm install --save-dev --save-exact vite @vitejs/plugin-react eslint @eslint/js eslint-config-dicodingacademy eslint-plugin-react-hooks eslint-plugin-react-refresh globals vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] Buat entry HTML `lang="id"`, judul `Ruang Diskusi`, viewport mobile, dan mount `#root`. Entry React:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}><App /></Provider>
  </StrictMode>,
);
```

- [ ] Konfigurasi Vite React dan Vitest jsdom; `src/test/setup.js` mengimpor `@testing-library/jest-dom/vitest` dan membersihkan mock sesudah test. ESLint memakai `eslint-config-dicodingacademy`, JSX parser options, globals browser untuk source dan globals Node untuk config; aktifkan rules hooks, abaikan `dist` dan arsip. Ikuti bentuk export konfigurasi yang dipasang, jangan mematikan style guide seluruhnya demi meloloskan lint.
- [ ] Terapkan tokens awal, reset, focus ring, dan overflow wrapping:

```css
:root {
  --surface: #ffffff;
  --canvas: #f7f8f4;
  --ink: #17251c;
  --muted: #526357;
  --accent: #216342;
  --danger: #a92f39;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--canvas); color: var(--ink); }
button, input, textarea { font: inherit; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
```

- [ ] Jalankan `npm run lint` dan `npm run build`; keduanya exit 0. Tidak membuat test yang hanya memeriksa teks placeholder.
- [ ] Inisialisasi Git lokal bila belum ada; `.gitignore` mencakup `node_modules/`, `dist/`, `.env*` kecuali `.env.example`, dan arsip ZIP. Commit fondasi beserta spec/plan yang telah disetujui dengan `chore: initialize forum application` setelah check sukses.

## Task 2: API client dan sesi autentikasi

**Create:** `src/services/api.js`, `src/services/token.js`, `src/services/api.test.js`, `src/states/auth/slice.js`, `src/states/auth/thunks.js`, `src/states/auth/thunks.test.js`.
**Modify:** `src/app/store.js`.

**Interfaces:** `getToken(): string|null`, `setToken(token): void`, `clearToken(): void`; `api.register({name,email,password})`, `api.login({email,password})`, `api.getMe()`, `api.getUsers()`, `api.getThreads()`, `api.getThread(id)`, `api.createThread({title,body,category})`, `api.createComment({threadId,content})`, `api.vote({threadId,commentId,kind})`, `api.getLeaderboards()`. Hasil Promise berupa objek/array yang sesuai, `login` mengembalikan token string. `kind` adalah `up | down | neutral`.

**Produces:** `bootstrapAuth()`, `login(credentials)`, `register(values)` dan `logout()`; store auth sesuai kontrak bersama.

- [ ] Tulis tes client untuk Bearer header, JSON body, envelope gagal, HTTP 401, dan network rejection. Fixture kegagalan berbeda:

```js
const unauthorized = new ApiError('Sesi berakhir', 401);
const offline = new TypeError('Failed to fetch');
expect(unauthorized.status).toBe(401);
expect(offline.status).toBeUndefined();
```

- [ ] Tulis tes thunk: bootstrap tanpa token tidak request; token valid mengisi user; 401 membersihkan token; network failure mempertahankan token dan menyediakan error; login gagal tidak menyimpan token/password; login sukses mengambil profil dan menyimpan token; bootstrap dobel saat loading tidak menggandakan request.
- [ ] Jalankan `npm test -- src/services/api.test.js src/states/auth/thunks.test.js`; konfirmasi FAIL karena modul belum diimplementasikan.
- [ ] Implementasi client dengan base resmi, `Content-Type: application/json` untuk body, Authorization untuk operasi terautentikasi, dan pemeriksaan HTTP serta `payload.status`. Unpack nama field berdasarkan endpoint. Bentuk URL vote:

```js
const suffix = { up: 'up-vote', down: 'down-vote', neutral: 'neutral-vote' };
const target = commentId
  ? `/threads/${encodeURIComponent(threadId)}/comments/${encodeURIComponent(commentId)}`
  : `/threads/${encodeURIComponent(threadId)}`;
const path = `${target}/${suffix[kind]}`;
```

- [ ] Buat auth slice/thunks. Thunk bootstrap menggunakan `condition` saat operasi pending dan membedakan 401/403 dari gangguan koneksi. Login menyimpan token sebelum getMe; bila getMe menolak autentikasi, token dibersihkan. Register tidak login otomatis. Logout reset user dan token tanpa menghapus konten publik.
- [ ] Jalankan tes target dan lint, lalu commit `feat: add api client and authentication state`.

## Task 3: State forum, filter dan penanganan respons terlambat

**Create:** `src/states/forum/slice.js`, `thunks.js`, `selectors.js`, `slice.test.js`, `selectors.test.js`.
**Modify:** `src/app/store.js`.

**Consumes:** methods API Task 2.
**Produces:** `loadForum()`, `loadThread(threadId)`, `createThread(values)`, `addComment({threadId,content})`; `setCategory(category)`, `clearDetail()`; selectors `selectVisibleThreads(state)`, `selectCategories(state)`; state forum sesuai kontrak bersama. Thread selector menambahkan `owner` dari users dengan fallback nama `Pengguna`.

- [ ] Tulis tes selector untuk semua kategori, kategori terpilih, kategori kosong/tidak ditemukan, serta ownerId tanpa user. Tulis tes reducer stale request:

```js
let state = reducer(undefined, loadThread.pending('request-a', 'a'));
state = reducer(state, loadThread.pending('request-b', 'b'));
state = reducer(state, loadThread.fulfilled({ id: 'a', comments: [] }, 'request-a', 'a'));
expect(state.detail).toBeNull();
state = reducer(state, loadThread.fulfilled({ id: 'b', comments: [] }, 'request-b', 'b'));
expect(state.detail.id).toBe('b');
```

- [ ] Uji komentar sukses hanya mengubah detail target yang cocok, memperbarui `totalComments`, dan memakai avatar auth user bila response owner tidak memuat avatar. Uji thread baru diambil dari respons server, bukan id buatan lokal.
- [ ] Jalankan tes target untuk memastikan FAIL. Implementasi loadForum dengan `Promise.all([api.getThreads(), api.getUsers()])`; condition mencegah pemuatan identik bersamaan. loadThread menyimpan requestId dan threadId; fulfilled/rejected lama diabaikan.
- [ ] Buat selector memoized melalui `createSelector`; kategori unik dihitung dari threads, filter mempertahankan data sumber. `setCategory('')` berarti semua kategori. Request dan status create/comment terpisah dari pemuatan daftar.
- [ ] Jalankan tes forum dan lint, commit `feat: manage forum data and category filters`.

## Task 4: Antarmuka baca publik dan sanitasi konten

**Create:** `src/utils/content.js`, `content.test.js`, `date.js`; komponen `AppLayout`, `Avatar`, `AsyncState`, `ProgressBar`, `ThreadCard`, `CategoryFilter`, `CommentItem`, `SafeHtml`; pages `ThreadsPage`, `ThreadDetailPage`, `NotFoundPage`; `src/styles/layout.css`, `forum.css`.
**Modify:** `src/app/App.jsx`, `src/styles/global.css`.

**Produces:** `sanitizeHtml(raw): string`, `toExcerpt(raw, maxLength=180): string`, `formatDate(iso): string`; `SafeHtml({html})`, `Avatar({name,src})`, `AsyncState({status,error,onRetry,isEmpty,children})`, `CategoryFilter({categories,value,onChange})`. VoteButtons ditambahkan Task 5.

- [ ] Tulis tes sanitasi payload aktif, atribut event, `javascript:` URL, HTML biasa, dan teks panjang:

```js
const clean = sanitizeHtml('<p>Halo</p><img src=x onerror="alert(1)"><script>alert(1)</script>');
expect(clean).toContain('<p>Halo</p>');
expect(clean).not.toMatch(/onerror|<script/i);
expect(toExcerpt('<p>' + 'a'.repeat(300) + '</p>', 80).length).toBeLessThanOrEqual(81);
```

- [ ] Konfirmasi FAIL, implementasi DOMPurify dengan allowlist sederhana (paragraf, emphasis, list, link aman, code, quote, line break). Cuplikan dari DOM yang telah disanitasi melalui textContent; tidak memakai HTML mentah. formatDate locale `id-ID` dengan fallback untuk tanggal tidak valid.
- [ ] Buat router BrowserRouter untuk `/`, `/threads/:threadId`, fallback. AppLayout membentuk header dan outlet; pages dispatch pemuatan melalui efek, tanpa import api services. AsyncState membedakan loading, error/retry, kosong, dan konten tersedia. ProgressBar mencerminkan operasi pending di Redux.
- [ ] Bentuk tampilan desktop dua kolom dan mobile satu kolom, thread card dengan semua informasi wajib, detail lengkap, dan daftar komentar. Heading berupa tautan, action terpisah. Avatar memakai fallback inisial; error gambar tidak berulang. SafeHtml satu-satunya titik render HTML hasil sanitasi.
- [ ] Jalankan tes konten, lint, build, lalu buka dev server untuk memeriksa data publik asli, navigasi daftar/detail, retry serta route tidak ditemukan. Pada localhost, gunakan browser tool yang didukung; jangan membuat request mutasi pada tahap ini.
- [ ] Commit `feat: build public forum pages`.

## Task 5: Optimistic votes untuk thread dan komentar

**Create:** `src/states/votes/model.js`, `thunks.js`, `thunks.test.js`, `src/components/VoteButtons.jsx`.
**Modify:** `src/states/forum/slice.js`, `src/components/ThreadCard.jsx`, `CommentItem.jsx`, `src/pages/ThreadDetailPage.jsx`.

**Interfaces:** `getUserVote(target,userId): 'up'|'down'|'neutral'`; `applyUserVote(target,userId,kind): target`; `vote({threadId,commentId?,kind})` thunk; `VoteButtons({threadId,commentId,upVotesBy,downVotesBy})`. Redux actions `voteStarted`, `voteApplied`, `voteFinished`, `voteFailed` memakai payload `{threadId,commentId,userId,kind,error?}`. Pending key thread `thread:<id>`, comment `comment:<threadId>:<commentId>`.

- [ ] Tulis tes klik sama menjadi neutral, beralih up ke down, tanpa membership ganda, sinkronisasi thread daftar/detail, komentar target saja, guest tidak request, dan pending target yang sama tidak request ganda.
- [ ] Tulis tes rollback yang membuktikan state lain tidak terhapus. API vote memakai deferred promise agar state diubah saat request pending:

```js
let rejectVote;
vi.spyOn(api, 'vote').mockImplementation(() => new Promise((resolve, reject) => {
  rejectVote = reject;
}));
const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
expect(store.getState().forum.threads[0].upVotesBy).toContain('me');
store.dispatch(voteApplied({ threadId: 't1', userId: 'other', kind: 'up' }));
rejectVote(new Error('Jaringan gagal'));
await request;
expect(store.getState().forum.threads[0].upVotesBy).not.toContain('me');
expect(store.getState().forum.threads[0].upVotesBy).toContain('other');
```

- [ ] Jalankan tes untuk FAIL. Implementasi thunk: baca user/target terbaru, hitung pilihan sebelumnya, lock target, apply optimistic, await API, clear lock; bila gagal apply pilihan sebelumnya untuk user itu saja dan simpan error. Abaikan response untuk sesi yang sudah logout/berganti agar rollback tidak mengubah state milik sesi baru.
- [ ] Implementasi VoteButtons: up/down counts terpisah, nama aksesibel, aria-pressed, indikator warna + bentuk, disabled saat pending. Guest melihat ajakan login dengan return path. Thread controls tampil di daftar/detail dan comment controls di setiap komentar. Error vote diumumkan di live region.
- [ ] Jalankan tes votes beserta tes forum dan lint. Fixture test memakai `createAppStore` dengan user `me`, thread `t1`, array vote kosong, dan detail thread yang sama; import `voteApplied` dari forum slice. Browser memverifikasi render/guest gating; pengujian request mutasi memakai mock terlebih dahulu. Commit `feat: add optimistic thread and comment voting`.

## Task 6: Form akun, thread baru dan komentar

**Create:** `src/utils/redirect.js`, `redirect.test.js`, `src/components/FormField.jsx`, `RequireAuth.jsx`, pages `LoginPage`, `RegisterPage`, `NewThreadPage`, `forms.test.jsx`, `src/styles/forms.css`.
**Modify:** `src/app/App.jsx`, `src/components/AppLayout.jsx`, `src/pages/ThreadDetailPage.jsx`.

**Interfaces:** `getSafeReturnPath(value,fallback='/'): string`; hanya nilai diawali `/` yang bukan `//`, backslash, scheme, atau `/login`/`/register` loop yang diterima. `FormField({id,label,error,...inputProps})`; `RequireAuth({children})` menyimpan return pathname aplikasi.

- [ ] Tulis tes return path:

```js
expect(getSafeReturnPath('/threads/t1')).toBe('/threads/t1');
expect(getSafeReturnPath('https://example.com')).toBe('/');
expect(getSafeReturnPath('//example.com')).toBe('/');
expect(getSafeReturnPath('/\\example.com')).toBe('/');
```

- [ ] Tulis tes form dengan store/API mock: register password pendek tidak request; login gagal mempertahankan email; submit pending tidak terkirim ganda; thread/komentar kosong setelah trim tidak request; submit gagal mempertahankan body; create berhasil navigasi memakai id server. Konfirmasi FAIL sebelum implementasi.
- [ ] Hubungkan route login/register/new dan guard. Register memvalidasi name, email dan password >=6, dispatch register, navigasi login dengan pesan sukses. Login dispatch login dan kembali ke path aman. Header menampilkan avatar/nama dan logout untuk pengguna aktif.
- [ ] Form thread menampung title/body wajib dan category opsional; whitespace saja ditolak. Komentar menyediakan textarea berlabel dan error inline; guest melihat login link. Gunakan status Redux untuk disabled/loading; input lokal dipertahankan saat gagal dan dibersihkan setelah sukses.
- [ ] Bootstrap auth dijalankan dari App melalui dispatch. Guard menunggu initialized dan status sesi; network error pada startup menyediakan retry, bukan redirect login prematur. Setelah logout, protected route kembali ke login, publik tetap terbaca.
- [ ] Jalankan tes redirect/form, lint dan build; verifikasi form via mocks, keyboard dan return path. Commit `feat: add account and discussion forms`.

## Task 7: Leaderboard dan kelengkapan UI

**Create:** `src/states/leaderboards/slice.js`, `thunks.js`, `src/pages/LeaderboardsPage.jsx`.
**Modify:** `src/app/store.js`, `src/app/App.jsx`, `src/components/AppLayout.jsx`, `src/styles/forum.css`.

**Produces:** `loadLeaderboards()` thunk dan route `/leaderboards`; items `{user:{id,name,avatar},score}` dari server, tidak menghitung score sendiri.

- [ ] Implementasi thunk, pending/error/retry/empty state dan condition untuk mencegah fetch duplikat; gunakan API getLeaderboards. Tampilkan nomor peringkat sesuai urutan API, nama, avatar dan score, tanpa memperlihatkan email pengguna.
- [ ] Hubungkan navigasi Diskusi/Peringkat dengan active state, tautan buat thread, kategori sidebar, serta ajakan login. Jangan menambahkan data leaderboard fiktif ketika request gagal.
- [ ] Jalankan lint dan build. Verifikasi halaman leaderboard publik dengan API asli, filter kategori frontend tanpa request baru, reset filter dan kategori tanpa hasil. Tidak perlu test yang hanya mencerminkan render baris statis.
- [ ] Commit `feat: add leaderboard and complete navigation`.

## Task 8: Verifikasi menyeluruh, dokumentasi dan ZIP

**Create:** `README.md`, `scripts/package-submission.ps1`, `docs/verification.md`.
**Modify:** styles sesuai temuan, `SUBMISSION_GUIDANCE.md` checklist berdasarkan bukti aktual; plan ini untuk status langkah.

- [ ] Jalankan seluruh check yang diwajibkan dan catat jumlah tes serta exit code:

```powershell
npm test
npm run lint
npm run build
```

- [ ] Browser check desktop 1440px dan mobile 390px: daftar/detail/leaderboard publik, filter, route fallback, layout teks panjang, focus keyboard, label form, warna/aria vote aktif, indikator loading, error/retry. Periksa tidak ada horizontal overflow dan warning/error React. Verifikasi direct navigation pada dev dan preview; aturan SPA fallback hosting ditulis di README, tidak mengklaim hosting terverifikasi sebelum deployment.
- [ ] Uji login/register/logout/create/comment/votes dengan mocked network untuk kegagalan dan concurrency. Uji server nyata hanya memakai akun serta konten uji yang diizinkan; jika belum ada izin mutasi, nyatakan cakupan verifikasi yang belum dilakukan secara eksplisit tanpa membuat akun/post otomatis.
- [ ] Jalankan review kode terhadap seluruh kriteria: request REST di services saja, state API Redux, UI/state folder terpisah, modularitas, StrictMode, lint style guide, optimistic rollback, dan filter lokal. Perbaiki temuan lalu jalankan ulang hanya check yang terdampak sebelum final keseluruhan check.
- [ ] README mencakup Node yang dipakai, `npm ci`, dev/test/lint/build/preview, struktur folder, Redux/thunk data flow, fitur, URL API, kebutuhan SPA fallback, dan cara membuat ZIP. Jangan menyimpan password/token akun uji.
- [ ] Buat script ZIP dengan allowlist sehingga tidak perlu menghapus instalasi lokal. Implementasi inti:

```powershell
$workspacePath = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $workspacePath 'ruang-diskusi-submission.zip'
$entries = @('src', 'public', 'docs', 'scripts', 'index.html', 'package.json',
  'package-lock.json', 'vite.config.js', 'eslint.config.mjs', 'README.md',
  'SUBMISSION_GUIDANCE.md', '.gitignore')
$sourcePaths = $entries | ForEach-Object { Join-Path $workspacePath $_ } |
  Where-Object { Test-Path -LiteralPath $_ }
Compress-Archive -LiteralPath $sourcePaths -DestinationPath $zipPath -Force
```

- [ ] Periksa daftar ZIP memakai `System.IO.Compression.ZipFile.OpenRead`; pastikan `src`, manifest, lockfile dan ESLint config ada serta `node_modules`, `.git`, `.env`, dan `dist` tidak ada. Catat hasil di verification.md; jangan mencentang checklist fitur yang belum diverifikasi.
- [ ] Review akhir dilakukan sesuai metode pilihan pengguna. Commit `docs: document verification and submission packaging` setelah temuan selesai. Berikan link ZIP, README, ringkasan check, dan batas pengujian; tidak mengirim submission atau menjanjikan nilai 5 otomatis.

## Self-review rencana

- Seluruh bagian spec memiliki task: fondasi (1), API/auth (2,6), forum/filter/race (3), read UI/sanitasi (4), optimistic votes (5), form/guard (6), leaderboard (7), aksesibilitas/responsif/checks/arsip (8).
- Lima Review Focus dipetakan ke tes atau verifikasi eksplisit pada task pemiliknya.
- Kontrak nama thunk, field state, API methods dan route konsisten di seluruh task.
- Tidak ada remote, push, deployment atau submit Dicoding di dalam rencana.
- Rekomendasi eksekusi: **Native**, karena aplikasi satu repository dengan dependensi task yang berurutan dan interfaces saling berkaitan. Opsi subagent tersedia bila pengguna memilih review independen per task.
