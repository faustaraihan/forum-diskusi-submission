import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../states/auth/thunks';
import { clearAuthError } from '../states/auth/slice';
import { getSafeReturnPath } from '../utils/redirect';
import FormField from '../components/FormField';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const [name, setName] = useState('');
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
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidation('Isi nama dan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setValidation('Password harus memiliki minimal 6 karakter.');
      return;
    }
    setValidation(null);
    try {
      await dispatch(register({ name: name.trim(), email: email.trim(), password })).unwrap();
      navigate('/login', { replace: true, state: { registered: true, from: destination } });
    } catch {
      /* Pesan request tersedia pada state autentikasi. */
    }
  };
  return (
    <div className="auth-layout">
      <section className="form-panel">
        <h1>Buat akun</h1>
        <p>Buat akun untuk bergabung dalam diskusi.</p>
        <form onSubmit={submit} noValidate>
          <FormField
            id="register-name"
            label="Nama"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Nama yang akan ditampilkan"
          />
          <FormField
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="nama@email.com"
          />
          <FormField
            id="register-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            help="Gunakan minimal 6 karakter."
          />
          {(validation || auth.error) && (
            <p className="form-error" role="alert">
              {validation || auth.error}
            </p>
          )}
          <button className="button full-width" type="submit" disabled={auth.status === 'loading'}>
            {auth.status === 'loading' ? 'Membuat akun…' : 'Buat akun'}
          </button>
        </form>
        <p className="form-switch">
          Sudah punya akun?{' '}
          <Link to="/login" state={{ from: destination }}>
            Masuk
          </Link>
        </p>
      </section>
    </div>
  );
}
