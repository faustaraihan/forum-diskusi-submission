import { createSlice } from '@reduxjs/toolkit';
import { bootstrapAuth, login, register } from './thunks';

const initialState = { user: null, initialized: false, status: 'idle', error: null, requestId: null, session: 0 };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedOut(state) {
      state.user = null;
      state.initialized = true;
      state.status = 'succeeded';
      state.error = null;
      state.requestId = null;
      state.session += 1;
    },
    clearAuthError(state) { state.error = null; },
  },
  extraReducers(builder) {
    [bootstrapAuth, login, register].forEach((thunk) => {
      builder.addCase(thunk.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.requestId = action.meta.requestId;
      });
      builder.addCase(thunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'succeeded';
        state.requestId = null;
        if (thunk !== register) {
          state.user = action.payload;
          state.initialized = true;
          state.session += 1;
        }
      });
      builder.addCase(thunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload || 'Permintaan gagal. Coba lagi.';
        state.requestId = null;
      });
    });
  },
});

export const { clearAuthError } = slice.actions;
export default slice.reducer;
