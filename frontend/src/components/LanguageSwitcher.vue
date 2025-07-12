<template>
    <div class="language-switcher">
      <button 
        @click="changeLanguage('en')"
        :class="{ active: currentLocale === 'en' }"
        aria-label="English"
      >
        EN
      </button>
      <button 
        @click="changeLanguage('ru')"
        :class="{ active: currentLocale === 'ru' }"
        aria-label="Russian"
      >
        RU
      </button>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n'
  
  export default {
    name: 'LanguageSwitcher',
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    computed: {
      currentLocale() {
        return this.locale
      }
    },
    methods: {
      changeLanguage(lang) {
        this.locale = lang
        localStorage.setItem('user_language', lang)
      }
    }
  }
  </script>
  
  <style scoped>
  .language-switcher {
    display: flex;
    margin-left: 20px;
  }
  
  .language-switcher button {
    padding: 5px 10px;
    margin: 0 2px;
    border: 1px solid #ddd;
    background: #f8f9fa;
    cursor: pointer;
    font-size: 0.8rem;
    border-radius: 3px;
  }
  
  .language-switcher button.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
    font-weight: bold;
  }
  </style>