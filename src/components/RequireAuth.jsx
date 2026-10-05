import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapAuth } from '../states/auth/thunks';

export default function RequireAuth({ children }) {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  if (!auth.initialized) {
    return (
      <div className="state-panel" role="status">
        <p>{auth.error || 'Memeriksa sesi akun…'}</p>
        {auth.status === 'failed' && (
          <button className="button button-secondary" onClick={() => dispatch(bootstrapAuth())}>
            Coba lagi
          </button>
        )}
      </div>
    );
  }
  if (!auth.user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: 'Masuk untuk membuat diskusi baru.' }}
      />
    );
  return children;
}
