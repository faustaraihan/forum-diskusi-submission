import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loadForum = createAsyncThunk(
  'forum/load',
  async (_, { rejectWithValue }) => {
    try {
      const [threads, users] = await Promise.all([api.getThreads(), api.getUsers()]);
      return { threads, users };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().forum.list.status !== 'loading' }
);

export const loadThread = createAsyncThunk(
  'forum/detail',
  async (threadId, { rejectWithValue }) => {
    try {
      return await api.getThread(threadId);
    } catch (error) {
      return rejectWithValue({ message: error.message, status: error.status });
    }
  },
  {
    condition: (threadId, { getState }) => {
      const request = getState().forum.detailLoad;
      return !(request.status === 'loading' && request.threadId === threadId);
    },
  }
);

export const createThread = createAsyncThunk(
  'forum/create',
  async (values, { getState, rejectWithValue }) => {
    const { user, session } = getState().auth;
    if (!user) return rejectWithValue('Masuk terlebih dahulu untuk membuat diskusi.');
    try {
      const thread = await api.createThread(values);
      if (getState().auth.session !== session)
        return rejectWithValue('Sesi berubah. Muat ulang daftar diskusi.');
      return { thread, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().forum.create.status !== 'loading' }
);

export const addComment = createAsyncThunk(
  'forum/comment',
  async (values, { getState, rejectWithValue }) => {
    const { user, session } = getState().auth;
    if (!user) return rejectWithValue('Masuk terlebih dahulu untuk mengirim komentar.');
    try {
      const comment = await api.createComment(values);
      if (getState().auth.session !== session)
        return rejectWithValue('Sesi berubah. Muat ulang diskusi.');
      return {
        ...comment,
        owner: { ...user, ...comment.owner, avatar: comment.owner.avatar || user.avatar },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  { condition: (_, { getState }) => getState().forum.comment.status !== 'loading' }
);
