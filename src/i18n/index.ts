import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import pt from './locales/pt.json';

const LANGUAGE_STORAGE_KEY = '@rick_morty_explorer:language';

const getDeviceLanguage = (): string => {
  let locale = 'en';
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      locale = settings?.AppleLocale || settings?.AppleLanguages?.[0] || 'en';
    } else if (Platform.OS === 'android') {
      locale = NativeModules.I18nManager?.localeIdentifier || 'en';
    }
  } catch (error) {
    console.warn('Failed to detect device language, falling back to English', error);
  }
  
  return locale.toLowerCase().startsWith('pt') ? 'pt' : 'en';
};

export const resources = {
  en: { translation: en },
  pt: { translation: pt },
} as const;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

// Persist the user's manual language choice and reapply it on next launch
// (overriding the device-language default). AsyncStorage is async, so the app
// starts in the detected language and switches once the saved value loads.
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng).catch(() => {});
});

AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then((saved) => {
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  })
  .catch(() => {});

export default i18n;
