// src/contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, setCurrentLanguage, getTranslation } from '../utils/languages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState(getCurrentLanguage());

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    setCurrentLanguageState(languageCode);
  };

  const t = (key) => {
    return getTranslation(currentLanguage, key);
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};