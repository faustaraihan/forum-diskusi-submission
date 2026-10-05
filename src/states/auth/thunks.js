import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { clearToken, getToken, setToken } from '../../services/token';

const pending = (_, { getState }) => getState().auth.status !== 'loading';

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  if (!getToken()) return null;
  try {
    return await api.getMe();
  } catch (error) {
    if ([401, 403].includes(error.status)) {
      clearToken();
      return null;
    }
    return rejectWithValue(error.message);
  }
}, { condition: (_, context) => pending(_, context) && !context.getState().auth.initialized });

export const login = createAsyncThunk('auth/login', async (values, { getState, requestId, rejectWithValue }) => {
  try {
    const token = await api.login(values);
    if (getState().auth.requestId !== requestId) return rejectWithValue('Permintaan dibatalkan.');
    setToken(token);
    const user = await api.getMe();
    return user;
  } catch (error) {
    if ([401, 403].includes(error.status)) clearToken();
    return rejectWithValue(error.message);
  }
}, { condition: pending });

export const register = createAsyncThunk('auth/register', async (values, { rejectWithValue }) => {
  try { return await api.register(values); } catch (error) { return rejectWithValue(error.message); }
}, { condition: pending });

export function logout() {
  return (dispatch) => {
    clearToken();
    dispatch({ type: 'auth/loggedOut' });
  };
}
