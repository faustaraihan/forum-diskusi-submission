// SVG artwork: Lucide (ISC) and Feather (MIT). See docs/icon-licenses.md.
const paths = {
  home: [
    'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
    'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  ],
  chat: [
    'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719',
  ],
  plus: ['M5 12h14', 'M12 5v14'],
  up: ['m18 15-6-6-6 6'],
  down: ['m6 9 6 6 6-6'],
  arrow: ['m12 19-7-7 7-7', 'M19 12H5'],
  trophy: [
    'M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2',
    'M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2',
    'M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3',
    'M4 22h16',
    'M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z',
    'M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3',
  ],
  logout: ['m16 17 5-5-5-5', 'M21 12H9', 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'],
};

// Filled variants use closed shapes, preserving rounded corners and interior cutouts.
const filledPaths = {
  home: [`${paths.home[1]} M9 21v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8z`],
  trophy: [
    'M7 2a1 1 0 0 0-1 1v6a6 6 0 0 0 5 5.917V18H9a2 2 0 0 0-2 2v1H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2h-2v-1a2 2 0 0 0-2-2h-2v-3.083A6 6 0 0 0 18 9V3a1 1 0 0 0-1-1z',
    'M6 3H3a2 2 0 0 0-2 2v2.5A3.5 3.5 0 0 0 4.5 11H6V9H4.5A1.5 1.5 0 0 1 3 7.5V5h3z M18 3h3a2 2 0 0 1 2 2v2.5a3.5 3.5 0 0 1-3.5 3.5H18V9h1.5A1.5 1.5 0 0 0 21 7.5V5h-3z',
  ],
  plus: [
    'M11 4a1 1 0 0 0-1 1v5H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-5V5a1 1 0 0 0-1-1z',
  ],
  up: [
    'M10.96 7.7a1.3 1.3 0 0 1 2.08 0l5.5 7.3a1.3 1.3 0 0 1-1.04 2.08h-11A1.3 1.3 0 0 1 5.46 15z',
  ],
  down: [
    'M10.96 16.3a1.3 1.3 0 0 0 2.08 0l5.5-7.3a1.3 1.3 0 0 0-1.04-2.08h-11A1.3 1.3 0 0 0 5.46 9z',
  ],
};

export default function Icon({ name, size = 20, filled = false }) {
  const solid = filled && filledPaths[name];
  return (
    <svg
      className="ui-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      fillRule="evenodd"
      stroke={solid ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {(solid || paths[name] || paths.chat).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
