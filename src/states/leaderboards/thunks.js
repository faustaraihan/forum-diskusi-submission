import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loadLeaderboards = createAsyncThunk('leaderboards/load', async (_, { rejectWithValue }) => {
  try { return await api.getLeaderboards(); } catch (error) { return rejectWithValue(error.message); }
}, { condition: (_, { getState }) => getState().leaderboards.status !== 'loading' });
