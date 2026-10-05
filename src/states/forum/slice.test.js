import { describe, it, expect, vi } from 'vitest';
import reducer from './slice';
import { loadThread, loadForum, createThread, addComment } from './thunks';
import { createAppStore } from '../../app/store';
import api from '../../services/api';
import { thread, detail, user, authenticatedState } from '../../test/fixtures';

describe('forum state consistency', () => {
  it('does not replace a newer detail with an old response', () => {
    let state = reducer(undefined, loadThread.pending('a', 't1'));
    state = reducer(state, loadThread.pending('b', 't2'));
    state = reducer(state, loadThread.fulfilled(detail('t1'), 'a', 't1'));
    expect(state.detail).toBeNull();
    state = reducer(state, loadThread.fulfilled(detail('t2'), 'b', 't2'));
    expect(state.detail.id).toBe('t2');
  });

  it('ignores stale errors too', () => {
    let state = reducer(undefined, loadThread.pending('a', 't1'));
    state = reducer(state, loadThread.pending('b', 't2'));
    state = reducer(state, loadThread.rejected(new Error('old error'), 'a', 't1'));
    expect(state.detailLoad.status).toBe('loading');
    expect(state.detailLoad.error).toBeNull();
  });

  it('loads users and threads together and deduplicates pending requests', async () => {
    let resolveThreads;
    const fetchThreads = vi.spyOn(api, 'getThreads').mockImplementation(() => new Promise((resolve) => { resolveThreads = resolve; }));
    vi.spyOn(api, 'getUsers').mockResolvedValue([user]);
    const store = createAppStore();
    const first = store.dispatch(loadForum());
    await store.dispatch(loadForum());
    resolveThreads([thread()]);
    await first;
    expect(store.getState().forum.threads[0].id).toBe('t1');
    expect(store.getState().forum.users[0].id).toBe('me');
    expect(fetchThreads).toHaveBeenCalledTimes(1);
  });

  it('uses the created thread returned by the server', async () => {
    vi.spyOn(api, 'createThread').mockResolvedValue(thread('server-id'));
    const store = createAppStore({ auth: authenticatedState() });
    await store.dispatch(createThread({ title: 'Judul', body: 'Isi' }));
    expect(store.getState().forum.threads[0].id).toBe('server-id');
    expect(store.getState().forum.users[0].name).toBe('Ayu');
  });

  it('adds a comment and updates its thread count with the author avatar fallback', async () => {
    vi.spyOn(api, 'createComment').mockResolvedValue({ id: 'c1', content: 'Halo', createdAt: '2026-10-05', owner: { id: 'me', name: 'Ayu' }, upVotesBy: [], downVotesBy: [] });
    const store = createAppStore({ auth: authenticatedState() });
    store.dispatch(loadForum.fulfilled({ threads: [thread()], users: [user] }, null));
    store.dispatch(loadThread.pending('request', 't1'));
    store.dispatch(loadThread.fulfilled(detail(), 'request', 't1'));
    await store.dispatch(addComment({ threadId: 't1', content: 'Halo' }));
    expect(store.getState().forum.detail.comments[0].owner.avatar).toBe(user.avatar);
    expect(store.getState().forum.threads[0].totalComments).toBe(1);
  });

  it('does not insert a comment into a different active thread', async () => {
    let resolveComment;
    vi.spyOn(api, 'createComment').mockImplementation(() => new Promise((resolve) => { resolveComment = resolve; }));
    const store = createAppStore({ auth: authenticatedState() });
    const request = store.dispatch(addComment({ threadId: 't1', content: 'Halo' }));
    store.dispatch(loadThread.pending('b', 't2'));
    store.dispatch(loadThread.fulfilled(detail('t2'), 'b', 't2'));
    resolveComment({ id: 'c1', content: 'Halo', owner: user, upVotesBy: [], downVotesBy: [] });
    await request;
    expect(store.getState().forum.detail.comments).toEqual([]);
  });
});
