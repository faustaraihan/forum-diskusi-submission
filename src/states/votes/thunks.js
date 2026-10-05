import api from '../../services/api';
import { voteApplied, voteStarted, voteFinished, voteFailed } from '../forum/slice';
import { getUserVote, voteKey } from './model';

export function vote({ threadId, commentId, kind }) {
  return async (dispatch, getState) => {
    const { auth, forum } = getState();
    const key = voteKey(threadId, commentId);
    if (!auth.user || forum.votePending[key]) return;
    const target = commentId
      ? forum.detail?.id === threadId &&
        forum.detail.comments.find((comment) => comment.id === commentId)
      : forum.detail?.id === threadId
        ? forum.detail
        : forum.threads.find((thread) => thread.id === threadId);
    if (!target) return;
    const previous = getUserVote(target, auth.user.id);
    const next = previous === kind ? 'neutral' : kind;
    const payload = { threadId, commentId, userId: auth.user.id, kind: next };
    dispatch(voteStarted(payload));
    dispatch(voteApplied(payload));
    try {
      await api.vote({ threadId, ...(commentId ? { commentId } : {}), kind: next });
      if (getState().auth.session === auth.session) dispatch(voteFinished(payload));
    } catch (error) {
      if (getState().auth.session !== auth.session) return;
      dispatch(voteApplied({ ...payload, kind: previous }));
      dispatch(voteFailed({ ...payload, error: error.message }));
    }
  };
}
