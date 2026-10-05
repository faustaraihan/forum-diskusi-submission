import DOMPurify from 'dompurify';

export function sanitizeHtml(raw) {
  return DOMPurify.sanitize(raw || '', {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

export function toExcerpt(raw, maxLength = 180) {
  const html = sanitizeHtml(raw).replace(/<\/(p|li|h2|h3|blockquote)>/g, '</$1> ');
  const container = document.createElement('div');
  container.innerHTML = html;
  const text = (container.textContent || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
