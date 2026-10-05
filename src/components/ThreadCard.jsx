import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Icon from './Icon';
import VoteButtons from './VoteButtons';
import { toExcerpt } from '../utils/content';
import { formatDate } from '../utils/date';

export default function ThreadCard({ thread }) {
  return (
    <article className="thread-card">
      <div className="thread-meta"><Avatar name={thread.owner.name} src={thread.owner.avatar} /><span className="author-name">{thread.owner.name}</span><time dateTime={thread.createdAt}>{formatDate(thread.createdAt)}</time></div>
      <div className="thread-title-row"><h2><Link to={`/threads/${thread.id}`}>{thread.title}</Link></h2>{thread.category && <span className="tag">#{thread.category}</span>}</div>
      <p className="thread-excerpt">{toExcerpt(thread.body)}</p>
      <div className="thread-footer"><VoteButtons threadId={thread.id} upVotesBy={thread.upVotesBy} downVotesBy={thread.downVotesBy} /><Link className="comment-count" to={`/threads/${thread.id}`}><Icon name="chat" size={18} />{thread.totalComments} komentar</Link></div>
    </article>
  );
}
