import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadLeaderboards } from '../states/leaderboards/thunks';
import AsyncState from '../components/AsyncState';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';

export default function LeaderboardsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.leaderboards);
  useEffect(() => { dispatch(loadLeaderboards()); }, [dispatch]);
  return <div className="leaderboard-page"><div className="page-intro"><div><p className="intro-note"><Icon name="trophy" size={18} />Kontributor komunitas</p><h1>Berbagi membawa<br />kita lebih jauh.</h1><p>Apresiasi untuk mereka yang menghidupkan percakapan.</p></div></div><section className="leaderboard-panel" aria-label="Peringkat pengguna"><div className="leaderboard-heading"><span>Kontributor</span><span>Skor</span></div><AsyncState status={status} error={error} onRetry={() => dispatch(loadLeaderboards())} isEmpty={items.length === 0} emptyTitle="Belum ada peringkat" emptyDescription="Mulai berkontribusi dalam diskusi komunitas."><ol className="leaderboard-list">{items.map((item, index) => <li key={item.user.id}><span className={`rank-number ${index < 3 ? 'rank-top' : ''}`}>{index + 1}</span><Avatar name={item.user.name} src={item.user.avatar} large /><span className="leaderboard-name">{item.user.name}{index === 0 && <span className="top-label">Kontributor teratas</span>}</span><span className="leaderboard-score">{item.score}<span>poin</span></span></li>)}</ol></AsyncState></section><p className="leaderboard-caption">Setiap kontribusi membuat ruang ini lebih berarti.</p></div>;
}
