import React from 'react';
import { IconButton } from '@mui/material';
import { Language } from '@mui/icons-material'; // Import MUI language icon
import { useTranslation } from 'react-i18next'; // Import i18next hook

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); // i18n instance to change language

  const handleLanguageToggle = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'ar' : 'en'; // Toggle between 'en' and 'ar'
    i18n.changeLanguage(newLang); // Change language using i18next
    localStorage.setItem('lang',newLang)
  };

  return (
    <IconButton onClick={handleLanguageToggle} title="Switch Language">
      <Language /> {/* Icon representing the language switch */}
    </IconButton>
  );
};

export default LanguageSwitcher;
