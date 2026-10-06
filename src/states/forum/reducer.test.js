/**
 * Skenario reducer forum:
 * - Mengubah kategori tanpa mengubah daftar thread.
 * - Memuat daftar dari request aktif dan menolak hasil request lama.
 * - Menyajikan error loading daftar.
 * - Memindahkan up-vote ke down-vote tanpa duplikasi, pada list dan detail.
 * - Mengubah vote hanya pada komentar yang dituju.
 * - Mengakhiri pending vote dan menyimpan error ketika vote gagal.
 * - Membersihkan metadata vote saat logout tanpa menghapus diskusi publik.
 */
import { describe, it, expect } from 'vitest';
import reducer, { setCategory, voteApplied, voteStarted, voteFailed } from './slice';
import { loadForum } from './thunks';
import { thread, detail, user } from '../../test/fixtures';

function populatedState() {
  return { ...reducer(undefined, { type: '@@init' }), threads: [thread()], users: [user], detail: detail() };
}

describe('forum reducer', () => {
  it('filters by category without changing the source list', () => {
    const initial = populatedState();
    const state = reducer(initial, setCategory('react'));
    expect(state.category).toBe('react');
    expect(state.threads).toEqual([thread()]);
    expect(initial.category).toBe('');
  });

  it('accepts the active list request and ignores an older response', () => {
    const pending = reducer(undefined, loadForum.pending('active'));
    const stale = reducer(pending, loadForum.fulfilled({ threads: [thread('stale')], users: [] }, 'old'));
    expect(stale.threads).toEqual([]);
    const state = reducer(stale, loadForum.fulfilled({ threads: [thread('fresh')], users: [user] }, 'active'));
    expect(state.threads.map((item) => item.id)).toEqual(['fresh']);
    expect(state.users[0].id).toBe('me');
    expect(state.list.status).toBe('succeeded');
  });

  it('exposes a failure from the active list request', () => {
    const pending = reducer(undefined, loadForum.pending('r1'));
    const state = reducer(pending, loadForum.rejected(null, 'r1', undefined, 'Offline'));
    expect(state.list).toMatchObject({ status: 'failed', error: 'Offline' });
    expect(state.threads).toEqual([]);
  });

  it('switches vote direction in both list and detail without duplicate votes', () => {
    let state = reducer(populatedState(), voteApplied({ threadId: 't1', userId: 'me', kind: 'up' }));
    state = reducer(state, voteApplied({ threadId: 't1', userId: 'me', kind: 'down' }));
    state = reducer(state, voteApplied({ threadId: 't1', userId: 'me', kind: 'down' }));
    expect(state.threads[0].upVotesBy).toEqual([]);
    expect(state.threads[0].downVotesBy).toEqual(['me']);
    expect(state.detail.upVotesBy).toEqual([]);
    expect(state.detail.downVotesBy).toEqual(['me']);
  });

  it('updates only the requested comment vote', () => {
    const initial = populatedState();
    initial.detail.comments = ['c1', 'c2'].map((id) => ({ id, upVotesBy: [], downVotesBy: [] }));
    const state = reducer(initial, voteApplied({ threadId: 't1', commentId: 'c2', userId: 'me', kind: 'up' }));
    expect(state.detail.comments[0].upVotesBy).toEqual([]);
    expect(state.detail.comments[1].upVotesBy).toEqual(['me']);
    expect(state.detail.upVotesBy).toEqual([]);
  });

  it('clears the pending target and exposes its vote error', () => {
    const payload = { threadId: 't1', userId: 'me', kind: 'up' };
    const pending = reducer(populatedState(), voteStarted(payload));
    const state = reducer(pending, voteFailed({ ...payload, error: 'Offline' }));
    expect(state.votePending).toEqual({});
    expect(state.voteErrors['thread:t1']).toBe('Offline');
  });

  it('clears vote request metadata on logout while keeping public threads', () => {
    const payload = { threadId: 't1', userId: 'me', kind: 'up' };
    let state = reducer(populatedState(), voteStarted(payload));
    state = reducer(state, voteApplied(payload));
    state = reducer(state, { type: 'auth/loggedOut' });
    expect(state.votePending).toEqual({});
    expect(state.voteErrors).toEqual({});
    expect(state.voteChanges).toEqual({});
    expect(state.threads[0].id).toBe('t1');
  });
});
