import { useSelector } from 'react-redux';

export default function ProgressBar() {
  const loading = useSelector(
    (state) =>
      state.auth.status === 'loading' ||
      state.forum.list.status === 'loading' ||
      state.forum.detailLoad.status === 'loading' ||
      state.forum.create.status === 'loading' ||
      state.forum.comment.status === 'loading' ||
      Object.keys(state.forum.votePending).length > 0 ||
      state.leaderboards?.status === 'loading'
  );
  return loading ? (
    <div className="progress-bar" role="status" aria-label="Memuat data">
      <span />
    </div>
  ) : null;
}
