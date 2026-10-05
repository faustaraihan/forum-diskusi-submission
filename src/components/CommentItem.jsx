import Avatar from './Avatar';
import SafeHtml from './SafeHtml';
import { formatDate } from '../utils/date';

export default function CommentItem({ comment }) {
  return <article className="comment-item"><div className="thread-meta"><Avatar name={comment.owner.name} src={comment.owner.avatar} /><span className="author-name">{comment.owner.name}</span><time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time></div><SafeHtml html={comment.content} /></article>;
}
