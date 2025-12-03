import {
  getObjectFromSyncStorage,
  fetchTranslation,
  saveObjectToSyncStorage,
} from '@/misc/helpers';
import ElementFactory from '@/misc/element-factory';
import logger from '@/misc/logger';

(async () => {
  const browserLanguage = window.navigator.languages[1];

  const fromLanguageElement = document.querySelector('#fromLanguage');
  const toLanguageElement = document.querySelector('#toLanguage');

  const fromLanguage = await getObjectFromSyncStorage('fromLanguage');
  const toLanguage = await getObjectFromSyncStorage('toLanguage');
  for (const [languageElement, languageChoice] of [
    [fromLanguageElement, { fromLanguage }],
    [toLanguageElement, { toLanguage }],
  ]) {
    languageElement.append(
      ...ElementFactory.getOptionElementsForLanguages(languageChoice)
    );
    languageElement.addEventListener('change', () =>
      saveObjectToSyncStorage(
        Object.keys(languageChoice)[0],
        languageElement.value
      )
    );
  }

  try {
    if (browserLanguage !== 'en') {
      document.querySelector('label[for=fromLanguage]').textContent =
        await fetchTranslation('From:', 'en', browserLanguage);
      document.querySelector('label[for=toLanguage]').textContent =
        await fetchTranslation('To:', 'en', browserLanguage);
    }
  } catch (_) {
    logger.warn(
      'Failed to fetch translations for interface. Falling back to english...'
    );
  } finally {
    document.querySelector('.main').style.visibility = 'visible';
    document.querySelector('.spinner').remove();
  }
})();
