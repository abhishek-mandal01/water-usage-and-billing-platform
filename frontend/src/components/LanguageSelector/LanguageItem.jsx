import React from 'react';
import { Check } from 'lucide-react';

const LanguageItem = ({ language, isSelected, onClick, isActive }) => {
  return (
    <button
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        background: isSelected ? 'var(--color-primary-50)' : isActive ? 'var(--bg-body)' : 'transparent',
        cursor: 'pointer',
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--bg-body)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ 
          fontSize: 'var(--text-base)', 
          fontWeight: isSelected ? 'var(--font-semibold)' : 'var(--font-medium)',
          color: isSelected ? 'var(--color-primary-600)' : 'var(--text-primary)'
        }}>
          {language.nativeName}
        </span>
        <span style={{ 
          fontSize: 'var(--text-xs)', 
          color: isSelected ? 'var(--color-primary-500)' : 'var(--text-tertiary)' 
        }}>
          {language.englishName}
        </span>
      </div>
      
      {isSelected && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--color-primary-600)'
        }}>
          <Check size={18} strokeWidth={3} />
        </div>
      )}
    </button>
  );
};

export default LanguageItem;
