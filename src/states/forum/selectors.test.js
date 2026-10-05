import { describe, it, expect } from 'vitest';
import { selectVisibleThreads, selectCategories } from './selectors';
import { thread, user } from '../../test/fixtures';

describe('forum selectors', () => {
  const forum = { threads: [thread('a', 'react'), thread('b', 'redux'), thread('c', 'react')], users: [user], category: '' };

  it('shows every thread with author information when no filter is selected', () => {
    const result = selectVisibleThreads({ forum });
    expect(result.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(result[0].owner.name).toBe('Ayu');
  });

  it('filters locally without mutating the original list', () => {
    expect(selectVisibleThreads({ forum: { ...forum, category: 'redux' } }).map((item) => item.id)).toEqual(['b']);
    expect(forum.threads).toHaveLength(3);
  });

  it('returns unique categories and no items for a category that disappeared', () => {
    expect(selectCategories({ forum })).toEqual(['react', 'redux']);
    expect(selectVisibleThreads({ forum: { ...forum, category: 'unknown' } })).toEqual([]);
  });

  it('keeps threads readable when the author lookup is incomplete', () => {
    expect(selectVisibleThreads({ forum: { ...forum, users: [] } })[0].owner.name).toBe('Pengguna');
  });
});
