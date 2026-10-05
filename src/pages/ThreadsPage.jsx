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
import Avatar from '../components/Avatar';

export default function ThreadsPage() {
  const dispatch = useDispatch();
  const threads = useSelector(selectVisibleThreads);
  const categories = useSelector(selectCategories);
  const { category, list } = useSelector((state) => state.forum);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(loadForum());
  }, [dispatch]);
  return (
    <>
      <div className="forum-layout">
        <section className="discussion-feed" aria-label="Daftar diskusi">
          <div className="feed-heading">
            <h1>Diskusi</h1>
            <span>{threads.length} percakapan</span>
          </div>
          <div className="feed-composer">
            <Avatar name={user?.name || 'Ruang'} src={user?.avatar} large />
            <Link className="composer-prompt" to="/threads/new">
              Apa yang ingin kamu diskusikan?
            </Link>
            <Link className="button button-secondary" to="/threads/new">
              <Icon name="plus" size={16} />
              <span>Buat</span>
            </Link>
          </div>
          <div className="feed-topics">
            <CategoryFilter
              categories={categories}
              value={category}
              onChange={(value) => dispatch(setCategory(value))}
            />
          </div>
          <AsyncState
            {...list}
            onRetry={() => dispatch(loadForum())}
            isEmpty={threads.length === 0}
            emptyTitle={category ? 'Belum ada diskusi di topik ini' : 'Belum ada diskusi'}
            emptyDescription="Pilih topik lain atau mulai percakapan baru."
          >
            <div className="thread-list">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          </AsyncState>
        </section>
        <aside className="forum-sidebar">
          <section className="sidebar-section">
            <h2>Tentang ruang</h2>
            <p>Forum terbuka untuk bertanya, berbagi pengalaman, dan saling menanggapi.</p>
            <Link className="leaderboard-link" to="/leaderboards">
              <Icon name="trophy" size={18} />
              <span>Peringkat kontributor</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </section>
          <p className="sidebar-caption">ruang · Forum diskusi</p>
        </aside>
      </div>
    </>
  );
}
