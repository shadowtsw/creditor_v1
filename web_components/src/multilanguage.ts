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
      welcome: {
        topic: '',
        title: '',
        text_row1: 'Experience a new way to work with your financials',
        text_row2: 'manage, structure and analyze your transactions offline',
        selection_choice1: {
          label: 'New user',
          info_text: 'First time here ? Start with creating your login credentials via key or database-authentication',
        },
        selection_choice2: {
          label: 'Existing user',
          info_text: 'If your familiar with the creditor prozedure',
        },
      },
    },
    de: {
      message: {
        language: 'Sprache',
        hello: ' Hallo Welt',
      },
      welcome: {
        topic: '',
        title: '',
        text_row1: 'Entdecke eine völlig neue Art deine Finanzen zu verwalten',
        text_row2: 'manage, structure and analyze your transactions offline',
        selection_choice1: {
          label: 'New user',
          info_text: 'First time here ? Start with creating your login credentials via key or database-authentication',
        },
        selection_choice2: {
          label: 'Existing user',
          info_text: 'If your familiar with the creditor prozedure',
        },
      },
    },
  },
});

export function translate() {
  const { t, locale } = useI18n();
  return { t, locale };
}

export default i18n;
