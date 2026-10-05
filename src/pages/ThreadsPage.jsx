import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadForum } from '../states/forum/thunks';
import { setCategory } from '../states/forum/slice';
import { selectCategories, selectVisibleThreads } from '../states/forum/selectors';
import CategoryFilter from '../components/CategoryFilter';
import ThreadCard from '../components/ThreadCard';
import AsyncState from '../components/AsyncState';
import Icon from '../components/Icon';

export default function ThreadsPage() {
  const dispatch = useDispatch();
  const threads = useSelector(selectVisibleThreads);
  const categories = useSelector(selectCategories);
  const { category, list } = useSelector((state) => state.forum);
  useEffect(() => { dispatch(loadForum()); }, [dispatch]);
  return (
    <>
      <div className="page-intro"><div><p className="intro-note"><span className="status-dot" />Tempat ide bertemu</p><h1>Obrolan hari ini,<br />wawasan untuk nanti.</h1><p>Tanyakan yang belum kamu tahu. Bagikan yang sudah kamu temukan.</p></div><Link className="button" to="/threads/new"><Icon name="plus" />Buat diskusi</Link></div>
      <div className="forum-layout">
        <section className="discussion-feed" aria-label="Daftar diskusi">
          <div className="section-heading"><h2>{category ? `Topik #${category}` : 'Semua diskusi'}</h2><span>{threads.length} percakapan</span></div>
          <AsyncState {...list} onRetry={() => dispatch(loadForum())} isEmpty={threads.length === 0} emptyTitle={category ? 'Belum ada diskusi di topik ini' : 'Belum ada diskusi'} emptyDescription="Pilih topik lain atau mulai percakapan baru.">
            <div className="thread-list">{threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}</div>
          </AsyncState>
        </section>
        <aside className="forum-sidebar">
          <section className="sidebar-section"><h2>Jelajahi topik</h2><p>Temukan percakapan yang dekat dengan minatmu.</p><CategoryFilter categories={categories} value={category} onChange={(value) => dispatch(setCategory(value))} /></section>
          <section className="community-note"><Icon name="book" size={30} /><h2>Selalu ada yang<br />bisa kita pelajari.</h2><p>Satu pertanyaanmu mungkin juga jadi pertanyaan orang lain. Mulai saja.</p><Link to="/threads/new">Bagikan pertanyaan</Link></section>
          <Link className="leaderboard-link" to="/leaderboards"><Icon name="trophy" /><span>Lihat kontributor teratas</span></Link>
        </aside>
      </div>
    </>
  );
}
