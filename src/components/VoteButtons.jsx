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
  const upActive = Boolean(user && upVotesBy.includes(user.id));
  const downActive = Boolean(user && downVotesBy.includes(user.id));
  const disabled = pending || !sessionReady;

  const handleVote = (kind) => {
    if (!sessionReady) return;
    if (!user) {
      navigate('/login', {
        state: { from: location.pathname, reason: 'Masuk untuk memberikan suara.' },
      });
      return;
    }
    dispatch(vote({ threadId, commentId, kind }));
  };
  return (
    <div className="vote-group">
      <div className="vote-controls">
        <button
          className={`vote-button ${upActive ? 'vote-up-active' : ''}`}
          aria-label={`Up-vote ${target}`}
          aria-pressed={upActive}
          disabled={disabled}
          onClick={() => handleVote('up')}
        >
          <Icon name="up" size={18} filled={upActive} />
          <span>{upVotesBy.length}</span>
        </button>
        <button
          className={`vote-button ${downActive ? 'vote-down-active' : ''}`}
          aria-label={`Down-vote ${target}`}
          aria-pressed={downActive}
          disabled={disabled}
          onClick={() => handleVote('down')}
        >
          <Icon name="down" size={18} filled={downActive} />
          <span>{downVotesBy.length}</span>
        </button>
        {pending && (
          <span className="vote-pending" role="status">
            Menyimpan…
          </span>
        )}
      </div>
      {error && (
        <p className="vote-error" role="alert">
          {error} Suara dikembalikan.
        </p>
      )}
    </div>
  );
}
