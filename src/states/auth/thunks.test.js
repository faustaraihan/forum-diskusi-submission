import { describe, it, expect, vi } from 'vitest';
import { createAppStore } from '../../app/store';
import api, { ApiError } from '../../services/api';
import { getToken, setToken } from '../../services/token';
import { bootstrapAuth, login, register, logout } from './thunks';

describe('authentication lifecycle', () => {
  it('allows a guest startup without fetching a profile', async () => {
    const profile = vi.spyOn(api, 'getMe');
    const store = createAppStore();
    await store.dispatch(bootstrapAuth());
    expect(store.getState().auth).toMatchObject({
      initialized: true,
      user: null,
      status: 'succeeded',
    });
    expect(profile).not.toHaveBeenCalled();
  });

  it('restores the profile for a valid saved token', async () => {
    setToken('valid');
    vi.spyOn(api, 'getMe').mockResolvedValue({ id: 'me', name: 'Ayu', avatar: '' });
    const store = createAppStore();
    await store.dispatch(bootstrapAuth());
    expect(store.getState().auth.user.name).toBe('Ayu');
  });

  it('clears an invalid token and continues as a guest', async () => {
    setToken('expired');
    vi.spyOn(api, 'getMe').mockRejectedValue(new ApiError('Expired', 401));
    const store = createAppStore();
    await store.dispatch(bootstrapAuth());
    expect(getToken()).toBeNull();
    expect(store.getState().auth).toMatchObject({ initialized: true, user: null });
  });

  it('preserves a token after a temporary network failure so it can be retried', async () => {
    setToken('saved');
    vi.spyOn(api, 'getMe').mockRejectedValue(new ApiError('Offline', 0));
    const store = createAppStore();
    await store.dispatch(bootstrapAuth());
    expect(getToken()).toBe('saved');
    expect(store.getState().auth).toMatchObject({ status: 'failed', initialized: false });
  });

  it('deduplicates bootstrap while the profile request is pending', async () => {
    setToken('saved');
    let resolveProfile;
    const profile = vi.spyOn(api, 'getMe').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        })
    );
    const store = createAppStore();
    const first = store.dispatch(bootstrapAuth());
    await store.dispatch(bootstrapAuth());
    resolveProfile({ id: 'me', name: 'Ayu' });
    await first;
    expect(profile).toHaveBeenCalledTimes(1);
  });

  it('stores only the token and authenticates the returned profile', async () => {
    vi.spyOn(api, 'login').mockResolvedValue('signed-token');
    vi.spyOn(api, 'getMe').mockResolvedValue({ id: 'me', name: 'Ayu' });
    const store = createAppStore();
    await store.dispatch(login({ email: 'ayu@example.com', password: 'secret' }));
    expect(getToken()).toBe('signed-token');
    expect(store.getState().auth.user.id).toBe('me');
    expect(JSON.stringify(store.getState())).not.toContain('secret');
    store.dispatch(logout());
    expect(getToken()).toBeNull();
    expect(store.getState().auth.user).toBeNull();
  });

  it('does not persist credentials when login fails', async () => {
    vi.spyOn(api, 'login').mockRejectedValue(new ApiError('Wrong password', 401));
    const store = createAppStore();
    await store.dispatch(login({ email: 'ayu@example.com', password: 'wrong' }));
    expect(getToken()).toBeNull();
    expect(store.getState().auth.status).toBe('failed');
  });

  it('registers without creating a login session', async () => {
    vi.spyOn(api, 'register').mockResolvedValue({ id: 'new' });
    const store = createAppStore();
    await store.dispatch(register({ name: 'Ayu', email: 'ayu@example.com', password: 'secret' }));
    expect(store.getState().auth.user).toBeNull();
    expect(getToken()).toBeNull();
  });

  it.each(['bootstrap', 'login'])(
    'ignores an expired %s response after another login',
    async (operation) => {
      let rejectOldProfile;
      vi.spyOn(api, 'getMe')
        .mockImplementationOnce(
          () =>
            new Promise((resolve, reject) => {
              rejectOldProfile = reject;
            })
        )
        .mockResolvedValue({ id: 'new-user', name: 'Bima' });
      vi.spyOn(api, 'login')
        .mockResolvedValueOnce(operation === 'login' ? 'old-token' : 'new-token')
        .mockResolvedValue('new-token');
      const store = createAppStore();
      setToken('old-token');
      const oldRequest = store.dispatch(operation === 'bootstrap' ? bootstrapAuth() : login({}));
      await vi.waitFor(() => expect(rejectOldProfile).toBeTypeOf('function'));
      store.dispatch(logout());
      await store.dispatch(login({}));
      expect(getToken()).toBe('new-token');
      rejectOldProfile(new ApiError('Expired', 401));
      await oldRequest;
      expect(getToken()).toBe('new-token');
      expect(store.getState().auth.user.id).toBe('new-user');
    }
  );
});
