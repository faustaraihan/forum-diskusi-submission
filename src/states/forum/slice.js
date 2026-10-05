import { createSlice } from '@reduxjs/toolkit';
import { loadForum, loadThread, createThread, addComment } from './thunks';

const initialState = {
  threads: [], users: [], detail: null, category: '',
  list: { status: 'idle', error: null, requestId: null },
  detailLoad: { status: 'idle', error: null, requestId: null, threadId: null },
  create: { status: 'idle', error: null },
  comment: { status: 'idle', error: null },
  votePending: {}, voteErrors: {},
};

const slice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setCategory(state, action) { state.category = action.payload; },
    clearDetail(state) {
      state.detail = null;
      state.detailLoad = initialState.detailLoad;
    },
    clearFormErrors(state) {
      state.create.error = null;
      state.comment.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadForum.pending, (state, action) => {
        state.list = { status: 'loading', error: null, requestId: action.meta.requestId };
      })
      .addCase(loadForum.fulfilled, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.threads = action.payload.threads;
        state.users = action.payload.users;
        state.list = { status: 'succeeded', error: null, requestId: null };
      })
      .addCase(loadForum.rejected, (state, action) => {
        if (state.list.requestId !== action.meta.requestId) return;
        state.list.status = 'failed';
        state.list.error = action.payload || 'Daftar diskusi gagal dimuat.';
      })
      .addCase(loadThread.pending, (state, action) => {
        state.detailLoad = { status: 'loading', error: null, requestId: action.meta.requestId, threadId: action.meta.arg };
        if (state.detail?.id !== action.meta.arg) state.detail = null;
        state.comment.error = null;
      })
      .addCase(loadThread.fulfilled, (state, action) => {
        if (state.detailLoad.requestId !== action.meta.requestId) return;
        state.detail = action.payload;
        state.detailLoad.status = 'succeeded';
        state.detailLoad.requestId = null;
        const item = state.threads.find((thread) => thread.id === action.payload.id);
        if (item) {
          item.upVotesBy = action.payload.upVotesBy;
          item.downVotesBy = action.payload.downVotesBy;
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
      builder.addCase(thunk.pending, (state) => { state[key] = { status: 'loading', error: null }; });
      builder.addCase(thunk.rejected, (state, action) => {
        state[key] = { status: 'failed', error: action.payload || 'Perubahan gagal disimpan.' };
      });
    });
    builder.addCase(createThread.fulfilled, (state, action) => {
      state.create = { status: 'succeeded', error: null };
      state.threads.unshift(action.payload.thread);
      if (!state.users.some((user) => user.id === action.payload.user.id)) state.users.push(action.payload.user);
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comment = { status: 'succeeded', error: null };
      if (state.detail?.id === action.meta.arg.threadId) state.detail.comments.unshift(action.payload);
      const item = state.threads.find((thread) => thread.id === action.meta.arg.threadId);
      if (item) item.totalComments += 1;
    });
  },
});

export const { setCategory, clearDetail, clearFormErrors } = slice.actions;
export default slice.reducer;
