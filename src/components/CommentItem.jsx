import Avatar from './Avatar';
import SafeHtml from './SafeHtml';
import VoteButtons from './VoteButtons';
import { formatDate } from '../utils/date';

export default function CommentItem({ comment, threadId }) {
  return (
    <article className="comment-item">
      <Avatar name={comment.owner.name} src={comment.owner.avatar} large />
      <div className="thread-content">
        <div className="thread-meta">
          <span className="author-name">{comment.owner.name}</span>
          <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
        </div>
        <SafeHtml html={comment.content} />
        <VoteButtons
          threadId={threadId}
          commentId={comment.id}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
        />
      </div>
    </article>
  );
}
