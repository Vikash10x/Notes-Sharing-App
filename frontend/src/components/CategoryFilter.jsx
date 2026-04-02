const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      overflowX: 'auto', paddingBottom: '4px',
      scrollbarWidth: 'none',
    }}>
      <button
        onClick={() => onSelect('')}
        style={{
          flexShrink: 0,
          padding: '8px 18px',
          borderRadius: '999px',
          border: selected === '' ? 'none' : '1px solid #1e293b',
          background: selected === '' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(15,23,42,0.8)',
          color: selected === '' ? 'white' : '#64748b',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
          fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
          boxShadow: selected === '' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        All Notes
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat.name)}
          style={{
            flexShrink: 0,
            padding: '8px 18px',
            borderRadius: '999px',
            border: selected === cat.name ? 'none' : '1px solid #1e293b',
            background: selected === cat.name ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(15,23,42,0.8)',
            color: selected === cat.name ? 'white' : '#64748b',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            boxShadow: selected === cat.name ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (selected !== cat.name) { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#818cf8'; }}}
          onMouseLeave={e => { if (selected !== cat.name) { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#64748b'; }}}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
