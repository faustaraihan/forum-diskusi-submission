import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createThread } from '../states/forum/thunks';
import { clearFormErrors } from '../states/forum/slice';
import FormField from '../components/FormField';
import Icon from '../components/Icon';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.forum.create);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [validation, setValidation] = useState(null);
  useEffect(() => { dispatch(clearFormErrors()); }, [dispatch]);
  const submit = async (event) => {
    event.preventDefault();
    if (status.status === 'loading') return;
    if (!title.trim() || !body.trim()) { setValidation('Judul dan isi diskusi tidak boleh kosong.'); return; }
    setValidation(null);
    try {
      const result = await dispatch(createThread({ title: title.trim(), body: body.trim(), ...(category.trim() ? { category: category.trim() } : {}) })).unwrap();
      navigate(`/threads/${result.thread.id}`);
    } catch { /* Redux menyimpan pesan kegagalan; input tidak dikosongkan. */ }
  };
  return <div className="editor-layout"><Link className="back-link" to="/"><Icon name="arrow" size={18} />Kembali ke diskusi</Link><section className="form-panel editor-panel"><h1>Mulai percakapan.</h1><p>Pertanyaan yang baik membuka banyak kemungkinan.</p><form onSubmit={submit} noValidate><FormField id="thread-title" label="Judul" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Apa yang ingin kamu diskusikan?" required /><FormField id="thread-category" label="Kategori (opsional)" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Contoh: react, redux, pengalaman" help="Kategori membantu orang lain menemukan diskusimu." /><FormField id="thread-body" label="Isi diskusi" multiline rows={9} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Ceritakan konteksnya. Bagikan pertanyaan atau pengalamanmu…" required />{(validation || status.error) && <p className="form-error" role="alert">{validation || status.error}</p>}<div className="form-actions"><Link to="/" className="cancel-link">Batal</Link><button className="button" type="submit" disabled={status.status === 'loading'}>{status.status === 'loading' ? 'Menerbitkan…' : 'Terbitkan diskusi'}</button></div></form></section></div>;
}
