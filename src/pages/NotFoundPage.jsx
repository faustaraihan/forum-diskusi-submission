import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="state-panel not-found">
      <h1>Halaman tidak ditemukan</h1>
      <p>Tautan ini tidak tersedia. Kamu bisa kembali ke daftar diskusi.</p>
      <Link className="button" to="/">
        Kembali ke diskusi
      </Link>
    </div>
  );
}
