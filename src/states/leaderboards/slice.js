import { createSlice } from '@reduxjs/toolkit';
import { loadLeaderboards } from './thunks';

const slice = createSlice({
  name: 'leaderboards',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadLeaderboards.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loadLeaderboards.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(loadLeaderboards.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Peringkat gagal dimuat.'; });
  },
});

export default slice.reducer;
