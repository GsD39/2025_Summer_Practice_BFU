import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

const browserLanguage = navigator.language.split('-')[0];
const defaultLocale = ['en', 'ru'].includes(browserLanguage) ? browserLanguage : 'en';

const savedLocale = localStorage.getItem('user_language');
const initialLocale = savedLocale || defaultLocale;

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, ru },
  datetimeFormats: {
    en: { short: { year: 'numeric', month: 'short', day: 'numeric' }},
    ru: { short: { year: 'numeric', month: 'short', day: 'numeric' }}
  }
})

export default i18n