export default function AsyncState({ status, error, onRetry, isEmpty, emptyTitle = 'Belum ada diskusi', emptyDescription = 'Mulai percakapan pertama dan bagikan pertanyaanmu.', children }) {
  if (status === 'loading' || status === 'idle') {
    return <div className="loading-content" role="status"><span className="spinner" /><p>Memuat percakapan…</p><div className="skeleton" /><div className="skeleton short" /></div>;
  }
  if (status === 'failed') {
    return <div className="state-panel" role="alert"><h2>Konten belum bisa dimuat</h2><p>{error}</p><button className="button button-secondary" onClick={onRetry}>Coba lagi</button></div>;
  }
  if (isEmpty) return <div className="state-panel"><h2>{emptyTitle}</h2><p>{emptyDescription}</p></div>;
  return children;
}
