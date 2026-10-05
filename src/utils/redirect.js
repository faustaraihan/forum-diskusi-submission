export function getSafeReturnPath(value, fallback = '/') {
  if (typeof value !== 'string' || !value.startsWith('/')) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.startsWith('//') ||
      decoded.includes('\\') ||
      [...decoded].some((char) => char.charCodeAt(0) < 32)
    )
      return fallback;
    const url = new URL(value, 'https://ruang.local');
    if (url.origin !== 'https://ruang.local' || ['/login', '/register'].includes(url.pathname))
      return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
