import { createSelector } from '@reduxjs/toolkit';

const selectThreads = (state) => state.forum.threads;
const selectUsers = (state) => state.forum.users;
const selectCategory = (state) => state.forum.category;

export const selectCategories = createSelector([selectThreads], (threads) => (
  [...new Set(threads.map((thread) => thread.category).filter(Boolean))].sort((a, b) => a.localeCompare(b))
));

export const selectVisibleThreads = createSelector([selectThreads, selectUsers, selectCategory], (threads, users, category) => {
  const byId = new Map(users.map((user) => [user.id, user]));
  return threads.filter((thread) => !category || thread.category === category).map((thread) => ({
    ...thread, owner: byId.get(thread.ownerId) || { id: thread.ownerId, name: 'Pengguna', avatar: '' },
  }));
});
