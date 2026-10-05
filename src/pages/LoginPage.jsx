import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../states/auth/thunks';
import { clearAuthError } from '../states/auth/slice';
import { getSafeReturnPath } from '../utils/redirect';
import FormField from '../components/FormField';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState(null);
  const destination = getSafeReturnPath(location.state?.from);
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  if (auth.user) return <Navigate to={destination} replace />;
  const submit = async (event) => {
    event.preventDefault();
    if (auth.status === 'loading') return;
    if (!email.trim() || !password) {
      setValidation('Isi email dan password terlebih dahulu.');
      return;
    }
    setValidation(null);
    try {
      await dispatch(login({ email: email.trim(), password })).unwrap();
      navigate(destination, { replace: true });
    } catch {
      /* Error disajikan melalui Redux agar input tetap tersedia. */
    }
  };
  return (
    <div className="auth-layout">
      <section className="form-panel">
        <h1>Masuk ke ruang</h1>
        <p>Lanjutkan percakapan dengan akunmu.</p>
        {location.state?.registered && (
          <p className="success-message" role="status">
            Akun berhasil dibuat. Silakan masuk.
          </p>
        )}
        {location.state?.reason && <p className="form-note">{location.state.reason}</p>}
        <form onSubmit={submit} noValidate>
          <FormField
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="nama@email.com"
          />
          <FormField
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {(validation || auth.error) && (
            <p className="form-error" role="alert">
              {validation || auth.error}
            </p>
          )}
          <button className="button full-width" type="submit" disabled={auth.status === 'loading'}>
            {auth.status === 'loading' ? 'Sedang masuk…' : 'Masuk ke ruang'}
          </button>
        </form>
        <p className="form-switch">
          Belum punya akun?{' '}
          <Link to="/register" state={{ from: destination }}>
            Buat akun
          </Link>
        </p>
      </section>
    </div>
  );
}
