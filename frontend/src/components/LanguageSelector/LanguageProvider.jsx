import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });
  
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false,
        }, 'google_translate_element');
        setIsGoogleLoaded(true);
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('app_language', langCode);
    
    // Sync i18next
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(langCode);
    }
    
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    if (isGoogleLoaded && currentLanguage !== 'en') {
      // Need a slight delay to ensure Google Translate combo box is rendered
      const timer = setTimeout(() => {
        changeLanguage(currentLanguage);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isGoogleLoaded, currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isGoogleLoaded }}>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
    </LanguageContext.Provider>
  );
};
