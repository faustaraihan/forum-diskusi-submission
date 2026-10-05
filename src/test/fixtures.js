export const user = { id: 'me', name: 'Ayu', email: 'ayu@example.com', avatar: 'https://example.com/ayu.png' };

export function thread(id = 't1', category = 'react') {
  return {
    id, category, title: 'Belajar React', body: '<p>Halo</p>', createdAt: '2026-10-05T01:00:00Z',
    ownerId: 'me', upVotesBy: [], downVotesBy: [], totalComments: 0,
  };
}

export function detail(id = 't1') {
  return { ...thread(id), owner: user, comments: [] };
}

export function authenticatedState() {
  return { user, initialized: true, status: 'succeeded', error: null, requestId: null, session: 1 };
}
