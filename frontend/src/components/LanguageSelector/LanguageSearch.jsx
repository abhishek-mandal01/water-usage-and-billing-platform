import { Search, X } from 'lucide-react';

const LanguageSearch = ({ query, setQuery }) => {
  return (
    <div style={{
      position: 'relative',
      padding: '16px',
      borderBottom: '1px solid var(--border-default)',
      background: 'var(--bg-card)',
      zIndex: 2,
      borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-body)',
        borderRadius: 'var(--radius-full)',
        padding: '0 12px',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-inner)'
      }}>
        <Search size={18} color="var(--text-tertiary)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search language..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            padding: '10px 12px',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            outline: 'none',
            width: '100%'
          }}
          autoFocus
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LanguageSearch;

