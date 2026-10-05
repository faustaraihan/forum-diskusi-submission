import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="state-panel not-found"><p className="intro-note">Halaman tidak ditemukan</p><h1>Sepertinya kamu<br />salah ruang.</h1><p>Percakapan lainnya menunggumu di beranda.</p><Link className="button" to="/">Kembali ke diskusi</Link></div>;
}
