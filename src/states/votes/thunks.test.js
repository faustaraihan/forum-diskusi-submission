/**
 * Skenario pengujian:
 * - Vote baru dipertahankan terhadap respons detail/list lama.
 * - Vote komentar tetap terpisah dari vote thread.
 * - Toggle vote memakai endpoint neutral.
 * - Perpindahan arah tidak menghasilkan vote duplikat.
 * - Kegagalan rollback hanya vote pengguna aktif.
 * - Guest tidak mengirim vote; request target pending dideduplikasi.
 * - Kegagalan dari sesi lama tidak merusak sesi baru.
 */
import { describe, it, expect, vi } from 'vitest';
import { createAppStore } from '../../app/store';
import api from '../../services/api';
import { thread, detail, user, authenticatedState } from '../../test/fixtures';
import { loadForum, loadThread } from '../forum/thunks';
import { voteApplied } from '../forum/slice';
import { vote } from './thunks';
import { logout } from '../auth/thunks';

function populatedStore(loggedIn = true) {
  const store = createAppStore(loggedIn ? { auth: authenticatedState() } : undefined);
  store.dispatch(loadForum.fulfilled({ threads: [thread()], users: [user] }, null));
  store.dispatch(loadThread.pending('r', 't1'));
  store.dispatch(
    loadThread.fulfilled(
      {
        ...detail(),
        comments: [{ id: 'c1', content: 'Halo', owner: user, upVotesBy: [], downVotesBy: [] }],
      },
      'r',
      't1'
    )
  );
  return store;
}

describe('optimistic voting', () => {
  it.each(['read-first', 'write-first'])(
    'preserves a thread vote against an overlapping stale detail read: %s',
    async (order) => {
      let resolveVote;
      vi.spyOn(api, 'vote').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveVote = resolve;
          })
      );
      const store = populatedStore();
      const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
      store.dispatch(loadThread.pending('overlap', 't1'));
      if (order === 'write-first') {
        resolveVote({ voteType: 1 });
        await request;
      }
      store.dispatch(loadThread.fulfilled(detail(), 'overlap', 't1'));
      if (order === 'read-first') {
        resolveVote({ voteType: 1 });
        await request;
      }
      expect(store.getState().forum.detail.upVotesBy).toEqual(['me']);
      expect(store.getState().forum.threads[0].upVotesBy).toEqual(['me']);
    }
  );

  it('preserves a completed comment vote against a read started while it was pending', async () => {
    let resolveVote;
    vi.spyOn(api, 'vote').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVote = resolve;
        })
    );
    const store = populatedStore();
    const request = store.dispatch(vote({ threadId: 't1', commentId: 'c1', kind: 'up' }));
    store.dispatch(loadThread.pending('overlap', 't1'));
    resolveVote({ voteType: 1 });
    await request;
    store.dispatch(
      loadThread.fulfilled(
        {
          ...detail(),
          comments: [{ id: 'c1', content: 'Halo', owner: user, upVotesBy: [], downVotesBy: [] }],
        },
        'overlap',
        't1'
      )
    );
    expect(store.getState().forum.detail.comments[0].upVotesBy).toEqual(['me']);
  });

  it('preserves a vote started after a list fetch against that older list response', async () => {
    vi.spyOn(api, 'vote').mockResolvedValue({ voteType: 1 });
    const store = populatedStore();
    store.dispatch(loadForum.pending('overlap'));
    await store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    store.dispatch(loadForum.fulfilled({ threads: [thread()], users: [user] }, 'overlap'));
    expect(store.getState().forum.threads[0].upVotesBy).toEqual(['me']);
    expect(store.getState().forum.detail.upVotesBy).toEqual(['me']);
  });

  it('toggles the vote displayed on the refreshed list when cached detail was stale', async () => {
    const sendVote = vi.spyOn(api, 'vote').mockResolvedValue({ voteType: 0 });
    const store = populatedStore();
    store.dispatch(loadForum.pending('fresh'));
    store.dispatch(
      loadForum.fulfilled({ threads: [{ ...thread(), upVotesBy: ['me'] }], users: [user] }, 'fresh')
    );
    await store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    expect(sendVote).toHaveBeenLastCalledWith({ threadId: 't1', kind: 'neutral' });
    expect(store.getState().forum.threads[0].upVotesBy).toEqual([]);
  });

  it('updates both list and detail immediately, then toggles to neutral', async () => {
    const sendVote = vi.spyOn(api, 'vote').mockResolvedValue({ voteType: 1 });
    const store = populatedStore();
    const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    expect(store.getState().forum.threads[0].upVotesBy).toEqual(['me']);
    expect(store.getState().forum.detail.upVotesBy).toEqual(['me']);
    await request;
    await store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    expect(store.getState().forum.detail.upVotesBy).toEqual([]);
    expect(sendVote).toHaveBeenLastCalledWith({ threadId: 't1', kind: 'neutral' });
  });

  it('switches direction without duplicate votes', async () => {
    vi.spyOn(api, 'vote').mockResolvedValue({ voteType: -1 });
    const store = populatedStore();
    await store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    await store.dispatch(vote({ threadId: 't1', kind: 'down' }));
    expect(store.getState().forum.detail.upVotesBy).toEqual([]);
    expect(store.getState().forum.detail.downVotesBy).toEqual(['me']);
  });

  it('rolls back only the acting user while preserving a concurrent change', async () => {
    let rejectVote;
    vi.spyOn(api, 'vote').mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          rejectVote = reject;
        })
    );
    const store = populatedStore();
    const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    store.dispatch(voteApplied({ threadId: 't1', userId: 'other', kind: 'up' }));
    rejectVote(new Error('Offline'));
    await request;
    expect(store.getState().forum.detail.upVotesBy).toEqual(['other']);
    expect(store.getState().forum.voteErrors['thread:t1']).toBe('Offline');
    expect(store.getState().forum.votePending).toEqual({});
  });

  it('updates only the targeted comment', async () => {
    vi.spyOn(api, 'vote').mockResolvedValue({ voteType: 1 });
    const store = populatedStore();
    await store.dispatch(vote({ threadId: 't1', commentId: 'c1', kind: 'up' }));
    expect(store.getState().forum.detail.comments[0].upVotesBy).toEqual(['me']);
    expect(store.getState().forum.detail.upVotesBy).toEqual([]);
  });

  it('does not send a request for guests', async () => {
    const sendVote = vi.spyOn(api, 'vote');
    const store = populatedStore(false);
    await store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    expect(sendVote).not.toHaveBeenCalled();
    expect(store.getState().forum.detail.upVotesBy).toEqual([]);
  });

  it('deduplicates a pending target but leaves other targets usable', async () => {
    let resolveVote;
    const sendVote = vi.spyOn(api, 'vote').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVote = resolve;
        })
    );
    const store = populatedStore();
    const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    await store.dispatch(vote({ threadId: 't1', kind: 'down' }));
    expect(sendVote).toHaveBeenCalledTimes(1);
    resolveVote({ voteType: 1 });
    await request;
    expect(store.getState().forum.detail.upVotesBy).toEqual(['me']);
  });

  it('does not roll back a new session when an old request fails after logout', async () => {
    let rejectVote;
    vi.spyOn(api, 'vote').mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          rejectVote = reject;
        })
    );
    const store = populatedStore();
    const request = store.dispatch(vote({ threadId: 't1', kind: 'up' }));
    store.dispatch(logout());
    rejectVote(new Error('Offline'));
    await request;
    expect(store.getState().forum.voteErrors).toEqual({});
    expect(store.getState().forum.votePending).toEqual({});
  });
});
