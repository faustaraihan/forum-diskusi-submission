import { Link, NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../states/auth/thunks';
import Avatar from './Avatar';
import Icon from './Icon';
import ProgressBar from './ProgressBar';

export default function AppLayout() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
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
              : <><Link className="login-link" to="/login">Masuk</Link><Link className="button button-small" to="/register">Bergabung</Link></>}
          </div>
        </div>
      </header>
      <main id="main-content" className="site-main" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer"><span className="footer-brand">ruang.</span><span>Percakapan kecil. Pengetahuan baru.</span><span>Forum diskusi terbuka</span></footer>
    </>
  );
}
