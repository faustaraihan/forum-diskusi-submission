import { useState } from 'react';

export default function Avatar({ name = 'Pengguna', src, large = false }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return src && failedSrc !== src ? (
    <img
      className={`avatar ${large ? 'avatar-large' : ''}`}
      src={src}
      alt={`Avatar ${name}`}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  ) : (
    <span
      className={`avatar avatar-fallback ${large ? 'avatar-large' : ''}`}
      role="img"
      aria-label={`Avatar ${name}`}
    >
      {initials || '?'}
    </span>
  );
}
