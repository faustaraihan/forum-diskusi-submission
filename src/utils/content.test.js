import { describe, it, expect } from 'vitest';
import { sanitizeHtml, toExcerpt } from './content';
import { formatDate } from './date';

describe('safe forum content', () => {
  it('keeps readable markup but removes executable content', () => {
    const clean = sanitizeHtml(
      '<p>Halo <strong>React</strong></p><img src=x onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">link</a>'
    );
    expect(clean).toContain('<p>Halo <strong>React</strong></p>');
    expect(clean).not.toMatch(/onerror|<script|javascript:/i);
  });

  it('turns HTML into a compact text excerpt', () => {
    expect(toExcerpt('<p>Halo <b>React</b></p><p>dan Redux</p>')).toBe('Halo React dan Redux');
    expect(toExcerpt(`<p>${'a'.repeat(300)}</p>`, 80)).toBe(`${'a'.repeat(80)}…`);
  });

  it('handles missing content and malformed dates without throwing', () => {
    expect(toExcerpt(null)).toBe('');
    expect(formatDate('not-a-date')).toBe('Waktu tidak tersedia');
  });

  it('keeps words separated across line breaks and editor blocks', () => {
    expect(toExcerpt('<div>Halo</div><div>React<br>dan Redux</div>')).toBe('Halo React dan Redux');
    expect(toExcerpt('<p>Halo<br />React</p><ul><li>Redux</li><li>Router</li></ul>')).toBe(
      'Halo React Redux Router'
    );
  });
});
