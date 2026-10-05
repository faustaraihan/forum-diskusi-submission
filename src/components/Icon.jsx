const paths = {
  chat: 'M4 4h16v12H8l-4 4V4Z M8 8h8 M8 12h5',
  plus: 'M12 5v14 M5 12h14',
  up: 'm6 14 6-6 6 6',
  down: 'm6 10 6 6 6-6',
  arrow: 'M19 12H5 m6-6-6 6 6 6',
  trophy: 'M8 3h8v7a4 4 0 0 1-8 0V3Z M8 5H4v3a4 4 0 0 0 4 4 M16 5h4v3a4 4 0 0 1-4 4 M12 14v5 M8 21h8 M9 19h6',
  book: 'M12 5c-3-2-7-2-9 0v14c2-2 6-2 9 0 3-2 7-2 9 0V5c-2-2-6-2-9 0Z M12 5v14',
  logout: 'M10 4H4v16h6 M9 12h11 m-4-4 4 4-4 4',
};

export default function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.chat} /></svg>;
}
