import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'pt-BR', // Set default locale
  fallbackLocale: 'en', // Set fallback locale
  messages: {
    'pt-BR': ptBR,
    'en': en
  }
})

export default i18n
