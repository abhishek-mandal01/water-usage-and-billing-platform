import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageSelector/LanguageProvider';
import LanguageDropdown from './LanguageSelector/LanguageDropdown';
import { GOOGLE_TRANSLATE_LANGUAGES } from './LanguageSelector/googleTranslate';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentLangObj = GOOGLE_TRANSLATE_LANGUAGES.find(l => l.code === currentLanguage) || { englishName: 'English' };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={selectorRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-default)',
          backgroundColor: isOpen ? 'var(--color-primary-50)' : 'var(--bg-card)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--shadow-inner)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease'
        }}
      >
        <Globe size={18} color="var(--color-primary-500)" />
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
          {isOpen ? currentLangObj.englishName : currentLanguage.toUpperCase()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={16} color="var(--text-tertiary)" />
        </motion.div>
      </motion.button>

      <LanguageDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default LanguageSelector;
