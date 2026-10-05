import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { vote } from '../states/votes/thunks';
import { voteKey } from '../states/votes/model';
import Icon from './Icon';

export default function VoteButtons({ threadId, commentId, upVotesBy, downVotesBy }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const sessionReady = useSelector((state) => state.auth.initialized);
  const key = voteKey(threadId, commentId);
  const pending = useSelector((state) => Boolean(state.forum.votePending[key]));
  const error = useSelector((state) => state.forum.voteErrors[key]);
  const target = commentId ? 'komentar' : 'diskusi';
  const act = (kind) => {
    if (!sessionReady) return;
    if (!user) navigate('/login', { state: { from: location.pathname, reason: 'Masuk untuk memberikan suara.' } });
    else dispatch(vote({ threadId, commentId, kind }));
  };
  return <div className="vote-group"><div className="vote-controls"><button className={`vote-button ${user && upVotesBy.includes(user.id) ? 'vote-up-active' : ''}`} aria-label={`Up-vote ${target}`} aria-pressed={Boolean(user && upVotesBy.includes(user.id))} disabled={pending || !sessionReady} onClick={() => act('up')}><Icon name="up" size={18} /><span>{upVotesBy.length}</span></button><button className={`vote-button ${user && downVotesBy.includes(user.id) ? 'vote-down-active' : ''}`} aria-label={`Down-vote ${target}`} aria-pressed={Boolean(user && downVotesBy.includes(user.id))} disabled={pending || !sessionReady} onClick={() => act('down')}><Icon name="down" size={18} /><span>{downVotesBy.length}</span></button>{pending && <span className="vote-pending" role="status">Menyimpan…</span>}</div>{error && <p className="vote-error" role="alert">{error} Suara dikembalikan.</p>}</div>;
}
