import { describe, it, expect } from 'vitest';
import { getSafeReturnPath } from './redirect';

describe('safe login return paths', () => {
  it('keeps paths within this app', () => {
    expect(getSafeReturnPath('/threads/t1')).toBe('/threads/t1');
    expect(getSafeReturnPath('/threads/new')).toBe('/threads/new');
  });

  it.each([
    'https://example.com',
    '//example.com',
    '/\\example.com',
    '/login',
    '/register?x=1',
    '/%2f%2fexample.com',
    undefined,
  ])('rejects an unsafe or looping return path %s', (path) => {
    expect(getSafeReturnPath(path)).toBe('/');
  });
});
