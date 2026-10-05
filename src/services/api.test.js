import { describe, it, expect, vi } from 'vitest';
import api, { ApiError } from './api';
import { setToken } from './token';

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('API boundary', () => {
  it('sends the authenticated JSON payload and unpacks the created comment', async () => {
    setToken('test-token');
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        respond({ status: 'success', data: { comment: { id: 'c1', content: 'Halo' } } })
      );
    vi.stubGlobal('fetch', fetcher);
    expect(await api.createComment({ threadId: 't1', content: 'Halo' })).toEqual({
      id: 'c1',
      content: 'Halo',
    });
    expect(fetcher).toHaveBeenCalledWith(
      'https://forum-api.dicoding.dev/v1/threads/t1/comments',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
        body: '{"content":"Halo"}',
      })
    );
  });

  it('preserves HTTP status for invalid credentials', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(respond({ status: 'fail', message: 'Invalid credentials' }, 401))
    );
    await expect(api.getMe()).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials',
    });
  });

  it('rejects an application failure even when HTTP succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(respond({ status: 'fail', message: 'Ditolak' }))
    );
    await expect(api.getThreads()).rejects.toBeInstanceOf(ApiError);
  });

  it('does not misclassify a connection failure as an authentication failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(api.getMe()).rejects.toMatchObject({ status: 0 });
  });

  it('uses the neutral comment endpoint without a request body', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(respond({ status: 'success', data: { vote: { voteType: 0 } } }));
    vi.stubGlobal('fetch', fetcher);
    await api.vote({ threadId: 't1', commentId: 'c1', kind: 'neutral' });
    expect(fetcher).toHaveBeenCalledWith(
      'https://forum-api.dicoding.dev/v1/threads/t1/comments/c1/neutral-vote',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
