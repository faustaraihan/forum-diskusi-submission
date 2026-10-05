import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapAuth, logout } from '../states/auth/thunks';
import Avatar from './Avatar';
import Icon from './Icon';
import ProgressBar from './ProgressBar';

export default function AppLayout() {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten</a>
      <ProgressBar />
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Ruang Diskusi, beranda"><span className="brand-mark"><Icon name="chat" size={24} /></span><span>ruang<span className="brand-dot">.</span></span></Link>
          <nav className="main-nav" aria-label="Navigasi utama">
            <NavLink to="/" end><Icon name="chat" size={18} />Diskusi</NavLink>
            <NavLink to="/leaderboards"><Icon name="trophy" size={18} />Peringkat</NavLink>
          </nav>
          <div className="account-nav">
            {user ? <><span className="account-user"><Avatar name={user.name} src={user.avatar} /><span>{user.name}</span></span><button className="icon-button" onClick={() => dispatch(logout())} aria-label="Keluar akun"><Icon name="logout" /></button></>
              : !auth.initialized ? <span className="session-status">{auth.status === 'failed' ? 'Sesi belum pulih' : 'Memeriksa sesi…'}</span>
                : <><Link className="login-link" to="/login">Masuk</Link><Link className="button button-small" to="/register">Bergabung</Link></>}
          </div>
        </div>
      </header>
      {!auth.initialized && auth.status === 'failed' && <div className="session-banner" role="alert"><div><strong>Sesi akun belum bisa dipulihkan.</strong><p>{auth.error || 'Periksa koneksi internet lalu coba lagi.'}</p></div><button className="button button-secondary" aria-label="Coba lagi sesi" onClick={() => dispatch(bootstrapAuth())}>Coba lagi</button></div>}
      <main id="main-content" className="site-main" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer"><span className="footer-brand">ruang.</span><span>Percakapan kecil. Pengetahuan baru.</span><span>Forum diskusi terbuka</span></footer>
    </>
  );
}
