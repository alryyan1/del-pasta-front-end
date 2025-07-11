import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      welcome: "Welcome to React and react-i18next"
    }
  },
  fr: {
    translation: {
        welcome: "Bienvenue à React et react-i18next"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend) // Load translations from files
  .use(LanguageDetector) // Detect user language

  .init({
    fallbackLng:'ar',
    // resources,
    lng: "ar", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    debug: false, // Disabled debug logging

    // Disabled missing translation logging
    saveMissing: false,

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    backend :{
      loadPath: './locales/{{lng}}/{{ns}}.json', // Adjust if your files are elsewhere
    },

    // Return the key itself when translation is missing (instead of showing fallback)
    returnKeyIfNotFound: true,
    
    // Show namespace and key when missing
    returnDetailsOnMissingTranslation: true
  });



export default i18n;