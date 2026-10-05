import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadThread } from '../states/forum/thunks';
import AsyncState from '../components/AsyncState';
import Avatar from '../components/Avatar';
import SafeHtml from '../components/SafeHtml';
import CommentItem from '../components/CommentItem';
import Icon from '../components/Icon';
import VoteButtons from '../components/VoteButtons';
import { formatDate } from '../utils/date';

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const { detail, detailLoad } = useSelector((state) => state.forum);
  useEffect(() => { dispatch(loadThread(threadId)); }, [dispatch, threadId]);
  return (
    <div className="detail-layout">
      <Link className="back-link" to="/"><Icon name="arrow" size={18} />Kembali ke diskusi</Link>
      <AsyncState {...detailLoad} onRetry={() => dispatch(loadThread(threadId))} isEmpty={!detail} emptyTitle="Diskusi tidak ditemukan" emptyDescription="Kembali ke daftar untuk menemukan percakapan lainnya.">
        {detail && <><article className="detail-article">{detail.category && <span className="tag">#{detail.category}</span>}<h1>{detail.title}</h1><div className="thread-meta"><Avatar name={detail.owner.name} src={detail.owner.avatar} /><span className="author-name">{detail.owner.name}</span><time dateTime={detail.createdAt}>{formatDate(detail.createdAt)}</time></div><SafeHtml html={detail.body} /><VoteButtons threadId={detail.id} upVotesBy={detail.upVotesBy} downVotesBy={detail.downVotesBy} /></article><section className="comments-section"><div className="section-heading"><h2>Percakapan</h2><span>{detail.comments.length} komentar</span></div>{detail.comments.length === 0 ? <p className="empty-comments">Belum ada komentar. Jadilah yang pertama menanggapi.</p> : detail.comments.map((comment) => <CommentItem key={comment.id} comment={comment} threadId={detail.id} />)}</section></>}
      </AsyncState>
    </div>
  );
}
