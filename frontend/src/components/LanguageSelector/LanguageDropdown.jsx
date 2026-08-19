import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSearch from './LanguageSearch';
import LanguageItem from './LanguageItem';
import { GOOGLE_TRANSLATE_LANGUAGES } from './googleTranslate';
import { useLanguage } from './LanguageProvider';

const LanguageDropdown = ({ isOpen, onClose }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const filteredLanguages = useMemo(() => {
    if (!query.trim()) return GOOGLE_TRANSLATE_LANGUAGES;
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return GOOGLE_TRANSLATE_LANGUAGES.filter(lang => {
      const enMatch = lang.englishName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      const nativeMatch = lang.nativeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      return enMatch || nativeMatch;
    });
  }, [query]);

  useEffect(() => {// eslint-disable-next-line react-hooks/set-state-in-effect

    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery(''); // Reset search on close
      return;
    }

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => Math.min(prev + 1, filteredLanguages.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredLanguages[activeIndex]) {
            changeLanguage(filteredLanguages[activeIndex].code);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredLanguages, changeLanguage, onClose]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.1)',
              zIndex: 99,
              backdropFilter: 'blur(2px)'
            }}
            className="md-hide"
          />

          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 1
            }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: '320px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-dropdown), 0 0 0 1px var(--border-default)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'top right'
            }}
          >
            <LanguageSearch query={query} setQuery={setQuery} />
            
            <div 
              ref={listRef}
              style={{
                maxHeight: '360px',
                overflowY: 'auto',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
              className="custom-scrollbar"
            >
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang, index) => (
                  <LanguageItem
                    key={lang.code}
                    language={lang}
                    isSelected={currentLanguage === lang.code}
                    isActive={index === activeIndex}
                    onClick={() => {
                      changeLanguage(lang.code);
                      onClose();
                    }}
                  />
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LanguageDropdown;

