export function getUserVote(target, userId) {
  if (target.upVotesBy.includes(userId)) return 'up';
  if (target.downVotesBy.includes(userId)) return 'down';
  return 'neutral';
}

export function applyUserVote(target, userId, kind) {
  const upVotesBy = target.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = target.downVotesBy.filter((id) => id !== userId);
  if (kind === 'up') upVotesBy.push(userId);
  if (kind === 'down') downVotesBy.push(userId);
  return { ...target, upVotesBy, downVotesBy };
}

export function voteKey(threadId, commentId) {
  return commentId ? `comment:${threadId}:${commentId}` : `thread:${threadId}`;
}
