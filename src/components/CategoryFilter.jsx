export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="category-list" role="group" aria-label="Filter kategori">
      <button
        className={`category-button ${value === '' ? 'selected' : ''}`}
        aria-pressed={value === ''}
        onClick={() => onChange('')}
      >
        Semua topik
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${value === category ? 'selected' : ''}`}
          aria-pressed={value === category}
          onClick={() => onChange(category)}
        >
          <span aria-hidden="true">#</span>
          {category}
        </button>
      ))}
    </div>
  );
}
