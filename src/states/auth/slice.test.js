/**
 * Skenario reducer auth:
 * - Login pending menghapus error sebelumnya.
 * - Login berhasil menyimpan profil dan menandai sesi siap.
 * - Respons dari request lama tidak mengganti profil terbaru.
 * - Login gagal menampilkan pesan tanpa membuat pengguna terautentikasi.
 * - Register berhasil tidak membuat sesi login.
 * - Logout membersihkan profil/error dan membatalkan request lama.
 */
import { describe, it, expect } from 'vitest';
import reducer from './slice';
import { bootstrapAuth, login, register } from './thunks';
import { user, authenticatedState } from '../../test/fixtures';

describe('auth reducer', () => {
  it('clears an earlier error while a login is pending', () => {
    const state = reducer({ ...authenticatedState(), user: null, error: 'Offline' }, login.pending('r1'));
    expect(state).toMatchObject({ status: 'loading', error: null, requestId: 'r1' });
  });

  it('makes the returned profile available after successful login', () => {
    const pending = reducer(undefined, login.pending('r1'));
    const state = reducer(pending, login.fulfilled(user, 'r1'));
    // Demonstrasi bukti CI gagal: nilai sengaja salah, dipulihkan setelah screenshot.
    expect(state).toMatchObject({ user, initialized: true, status: 'succeeded', requestId: null, session: 2 });
  });

  it('ignores a profile response belonging to an older request', () => {
    const pending = reducer(authenticatedState(), bootstrapAuth.pending('new-request'));
    const state = reducer(pending, bootstrapAuth.fulfilled({ id: 'old-user' }, 'old-request'));
    expect(state.user.id).toBe('me');
    expect(state.requestId).toBe('new-request');
    expect(state.status).toBe('loading');
  });

  it('exposes login failure without authenticating the user', () => {
    const pending = reducer(undefined, login.pending('r1'));
    const state = reducer(pending, login.rejected(null, 'r1', {}, 'Kredensial salah'));
    expect(state).toMatchObject({ user: null, status: 'failed', error: 'Kredensial salah', requestId: null });
  });

  it('does not authenticate a newly registered user', () => {
    const pending = reducer(undefined, register.pending('r1'));
    const state = reducer(pending, register.fulfilled(user, 'r1'));
    expect(state.user).toBeNull();
    expect(state.session).toBe(0);
    expect(state.status).toBe('succeeded');
  });

  it('logs out and prevents an in-flight login response from restoring the session', () => {
    const pending = reducer(authenticatedState(), login.pending('r1'));
    const loggedOut = reducer(pending, { type: 'auth/loggedOut' });
    const state = reducer(loggedOut, login.fulfilled(user, 'r1'));
    expect(state).toMatchObject({ user: null, initialized: true, status: 'succeeded', error: null, requestId: null, session: 2 });
  });
});
