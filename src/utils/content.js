import DOMPurify from 'dompurify';

export function sanitizeHtml(raw) {
  return DOMPurify.sanitize(raw || '', {
    ALLOWED_TAGS: [
      'div',
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'a',
      'h2',
      'h3',
    ],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

export function toExcerpt(raw, maxLength = 180) {
  const container = document.createElement('div');
  container.innerHTML = sanitizeHtml(raw);
  container.querySelectorAll('br, div, p, li, h2, h3, blockquote, pre').forEach((element) => {
    element.after(' ');
  });
  const text = (container.textContent || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
