import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../states/forum/thunks';
import FormField from './FormField';

export default function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const sessionReady = useSelector((state) => state.auth.initialized);
  const status = useSelector((state) => state.forum.comment);
  const [content, setContent] = useState('');
  const [validation, setValidation] = useState(null);
  const [sent, setSent] = useState(false);
  if (!sessionReady)
    return (
      <div className="comment-login" role="status">
        <p>Menunggu pemulihan sesi akun.</p>
        <span>Jika koneksi bermasalah, gunakan tombol Coba lagi di atas.</span>
      </div>
    );
  if (!user)
    return (
      <div className="comment-login">
        <p>Ikut diskusi</p>
        <Link
          to="/login"
          state={{ from: location.pathname, reason: 'Masuk untuk ikut menanggapi.' }}
        >
          Masuk untuk ikut berdiskusi
        </Link>
      </div>
    );
  const submit = async (event) => {
    event.preventDefault();
    if (status.status === 'loading') return;
    if (!content.trim()) {
      setValidation('Isi komentar tidak boleh kosong.');
      return;
    }
    setValidation(null);
    setSent(false);
    try {
      await dispatch(addComment({ threadId, content: content.trim() })).unwrap();
      setContent('');
      setSent(true);
    } catch {
      /* Isi komentar dipertahankan supaya pengguna bisa mencoba lagi. */
    }
  };
  return (
    <form className="comment-form" onSubmit={submit} noValidate>
      <FormField
        id="comment-content"
        label="Tanggapanmu"
        multiline
        rows={4}
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setSent(false);
        }}
        placeholder="Tulis komentar…"
        required
      />
      {(validation || status.error) && (
        <p className="form-error" role="alert">
          {validation || status.error}
        </p>
      )}
      {sent && (
        <p className="success-message" role="status">
          Komentar berhasil dikirim.
        </p>
      )}
      <button className="button" type="submit" disabled={status.status === 'loading'}>
        {status.status === 'loading' ? 'Mengirim…' : 'Kirim komentar'}
      </button>
    </form>
  );
}
