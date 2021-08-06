import { createI18n, useI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      message: {
        language: 'Language',
        hello: 'hello world!',
      },
    },
    de: {
      message: {
        language: 'Sprache',
        hello: ' Hallo Welt',
      },
    },
  },
});

export function translate() {
  const { t, locale } = useI18n();
  return { t, locale };
}

export default i18n;
