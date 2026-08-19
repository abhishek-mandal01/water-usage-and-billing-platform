import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
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
        whileHover={{ scale: 1.05, rotate: 6 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={`Change Language (${currentLangObj.englishName || 'English'})`}
        aria-label="Change Language"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          backgroundColor: isOpen ? 'var(--color-primary-100)' : 'var(--bg-card)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--shadow-btn)',
          transition: 'all var(--transition-base)'
        }}
        className="theme-toggle"
      >
        <Globe size={18} color="var(--color-primary-500)" />
      </motion.button>

      <LanguageDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default LanguageSelector;

