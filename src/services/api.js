import { getToken } from './token';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, authenticated = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = authenticated ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung. Periksa koneksi internet lalu coba lagi.');
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('Respons server tidak dapat dibaca. Coba lagi.', response.status);
  }
  if (!response.ok || payload.status !== 'success') {
    throw new ApiError(payload.message || 'Permintaan gagal. Coba lagi.', response.status);
  }
  return payload.data;
}

const api = {
  async register(values) {
    return (await request('/register', { method: 'POST', body: values })).user;
  },
  async login(values) {
    return (await request('/login', { method: 'POST', body: values })).token;
  },
  async getMe() {
    return (await request('/users/me', { authenticated: true })).user;
  },
  async getUsers() {
    return (await request('/users')).users;
  },
  async getThreads() {
    return (await request('/threads')).threads;
  },
  async getThread(id) {
    return (await request(`/threads/${encodeURIComponent(id)}`)).detailThread;
  },
  async createThread(values) {
    return (await request('/threads', { method: 'POST', body: values, authenticated: true }))
      .thread;
  },
  async createComment({ threadId, content }) {
    return (
      await request(`/threads/${encodeURIComponent(threadId)}/comments`, {
        method: 'POST',
        body: { content },
        authenticated: true,
      })
    ).comment;
  },
  async vote({ threadId, commentId, kind }) {
    const suffix = { up: 'up-vote', down: 'down-vote', neutral: 'neutral-vote' };
    const target = commentId
      ? `/threads/${encodeURIComponent(threadId)}/comments/${encodeURIComponent(commentId)}`
      : `/threads/${encodeURIComponent(threadId)}`;
    return (await request(`${target}/${suffix[kind]}`, { method: 'POST', authenticated: true }))
      .vote;
  },
  async getLeaderboards() {
    return (await request('/leaderboards')).leaderboards;
  },
};

export default api;
