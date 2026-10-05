import { createSlice } from '@reduxjs/toolkit';
import { loadForum, loadThread, createThread, addComment } from './thunks';
import { applyUserVote, voteKey } from '../votes/model';

const initialState = {
  threads: [],
  users: [],
  detail: null,
  category: '',
  list: { status: 'idle', error: null, requestId: null },
  detailLoad: { status: 'idle', error: null, requestId: null, threadId: null },
  create: { status: 'idle', error: null },
  comment: { status: 'idle', error: null },
  votePending: {},
  voteErrors: {},
  voteRevision: 0,
  voteChanges: {},
};

/**
 * Keep the user's newer vote when a GET was started before that change,
 * or while its POST was pending. Other users' votes still come from the API.
 */
function reconcileVotes(state, target, request, threadId = target.id, commentId) {
  const key = voteKey(threadId, commentId);
  const change = state.voteChanges[key];
  if (
    change &&
    (change.revision > (request.voteRevision || 0) ||
      request.pendingVotes?.includes(key) ||
      state.votePending[key])
  ) {
    return applyUserVote(target, change.userId, change.kind);
  }
  return target;
}

const slice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    clearFormErrors(state) {
      state.create.error = null;
      state.comment.error = null;
    },
    voteStarted(state, action) {
      const { threadId, commentId } = action.payload;
      const key = voteKey(threadId, commentId);
      state.votePending[key] = action.payload;
      delete state.voteErrors[key];
    },
    voteApplied(state, action) {
      const { threadId, commentId, userId, kind } = action.payload;
      state.voteRevision += 1;
      state.voteChanges[voteKey(threadId, commentId)] = {
        userId,
        kind,
        revision: state.voteRevision,
      };
      const update = (target) => {
        if (!target) return;
        const result = applyUserVote(target, userId, kind);
        target.upVotesBy = result.upVotesBy;
        target.downVotesBy = result.downVotesBy;
      };
      if (commentId) {
        if (state.detail?.id === threadId)
          update(state.detail.comments.find((comment) => comment.id === commentId));
      } else {
        update(state.threads.find((thread) => thread.id === threadId));
        if (state.detail?.id === threadId) update(state.detail);
      }
    },
    voteFinished(state, action) {
      delete state.votePending[voteKey(action.payload.threadId, action.payload.commentId)];
    },
    voteFailed(state, action) {
      const key = voteKey(action.payload.threadId, action.payload.commentId);
      delete state.votePending[key];
      state.voteErrors[key] = action.payload.error;
    },
  },
  extraReducers(builder) {
    builder
      .addCase('auth/loggedOut', (state) => {
        state.votePending = {};
        state.voteErrors = {};
        state.voteChanges = {};
        state.voteRevision = 0;
      })
      .addCase(loadForum.pending, (state, action) => {
        state.list = {
          status: 'loading',
          error: null,
          requestId: action.meta.requestId,
          voteRevision: state.voteRevision,
          pendingVotes: Object.keys(state.votePending),
        };
      })
      .addCase(loadForum.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.threads = action.payload.threads.map((thread) =>
          reconcileVotes(state, thread, state.list)
        );
        const cachedThread = state.threads.find((thread) => thread.id === state.detail?.id);
        if (cachedThread) {
          state.detail.upVotesBy = cachedThread.upVotesBy;
          state.detail.downVotesBy = cachedThread.downVotesBy;
        }
        state.users = action.payload.users;
        state.list = { status: 'succeeded', error: null, requestId: null };
      })
      .addCase(loadForum.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.list.status = 'failed';
        state.list.error = action.payload || 'Daftar diskusi gagal dimuat.';
      })
      .addCase(loadThread.pending, (state, action) => {
        state.detailLoad = {
          status: 'loading',
          error: null,
          requestId: action.meta.requestId,
          threadId: action.meta.arg,
          voteRevision: state.voteRevision,
          pendingVotes: Object.keys(state.votePending),
        };
        if (state.detail?.id !== action.meta.arg) state.detail = null;
        state.comment.error = null;
      })
      .addCase(loadThread.fulfilled, (state, action) => {
        if (state.detailLoad.requestId !== action.meta.requestId) return;
        const incoming = reconcileVotes(state, action.payload, state.detailLoad);
        state.detail = {
          ...incoming,
          comments: incoming.comments.map((comment) =>
            reconcileVotes(state, comment, state.detailLoad, incoming.id, comment.id)
          ),
        };
        state.detailLoad.status = 'succeeded';
        state.detailLoad.requestId = null;
        const item = state.threads.find((thread) => thread.id === action.payload.id);
        if (item) {
          item.upVotesBy = state.detail.upVotesBy;
          item.downVotesBy = state.detail.downVotesBy;
          item.totalComments = action.payload.comments.length;
        }
      })
      .addCase(loadThread.rejected, (state, action) => {
        if (state.detailLoad.requestId !== action.meta.requestId) return;
        state.detailLoad.status = 'failed';
        state.detailLoad.error = action.payload?.message || 'Diskusi gagal dimuat.';
        state.detailLoad.notFound = action.payload?.status === 404;
      });
    [createThread, addComment].forEach((thunk) => {
      const key = thunk === createThread ? 'create' : 'comment';
      builder.addCase(thunk.pending, (state) => {
        state[key] = { status: 'loading', error: null };
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state[key] = { status: 'failed', error: action.payload || 'Perubahan gagal disimpan.' };
      });
    });
    builder.addCase(createThread.fulfilled, (state, action) => {
      state.create = { status: 'succeeded', error: null };
      // A list requested before this POST may not contain the newly created thread.
      state.list = { status: 'succeeded', error: null, requestId: null };
      state.threads.unshift(action.payload.thread);
      if (!state.users.some((user) => user.id === action.payload.user.id))
        state.users.push(action.payload.user);
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comment = { status: 'succeeded', error: null };
      if (state.detail?.id === action.meta.arg.threadId)
        state.detail.comments.unshift(action.payload);
      const item = state.threads.find((thread) => thread.id === action.meta.arg.threadId);
      if (item) item.totalComments += 1;
    });
  },
});

export const {
  setCategory,
  clearFormErrors,
  voteStarted,
  voteApplied,
  voteFinished,
  voteFailed,
} = slice.actions;
export default slice.reducer;
