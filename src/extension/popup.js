import { getObjectFromLocalStorage, sendMessageToContent, fetchTranslation } from '@/misc/helpers.js';
import { MESSAGES, SUPPORTED_LANGUAGES } from '@/misc/constants.js';
import ElementFactory from '@/misc/element-factory.js';
import logger from '@/misc/logger';

document.addEventListener('DOMContentLoaded', async () => {
    const browserLanguage = window.navigator.languages[1];

    const elementFactory = new ElementFactory();

    const languageOptionElements = elementFactory.getOptionElementsForLanguagesAsString(SUPPORTED_LANGUAGES);

    const fromLanguageElement = document.querySelector('#fromLanguage');
    const toLanguageElement = document.querySelector('#toLanguage');

    fromLanguageElement.innerHTML = languageOptionElements;
    toLanguageElement.innerHTML = languageOptionElements;

    const defaultFromLanguage = await getObjectFromLocalStorage('fromLanguage');
    const defaultToLanguage = await getObjectFromLocalStorage('toLanguage');

    Array.from(fromLanguageElement.children).some((child) => {
        if (child.value === defaultFromLanguage) {
            child.selected = true;
            return true;
        }
    });

    Array.from(toLanguageElement.children).some((child) => {
        if (child.value === defaultToLanguage) {
            child.selected = true;
            return true;
        }
    });

    fromLanguageElement.addEventListener('change', async (event) => {
        const targetLanguage = event.target.value;
        sendMessageToContent(MESSAGES.SET_TO_LANGUAGE, targetLanguage);
    });


    toLanguageElement.addEventListener('change', async (event) => {
        const targetLanguage = event.target.value;
        sendMessageToContent(MESSAGES.SET_TO_LANGUAGE, targetLanguage);
    });

    try {
        if (browserLanguage !== 'en') {
            document.querySelector('label[for=fromLanguage]').innerHTML = await fetchTranslation('From:', 'en', browserLanguage);
            document.querySelector('label[for=toLanguage]').innerHTML = await fetchTranslation('To:', 'en', browserLanguage);
        }
    } catch(_) {
        logger.warn('Failed to fetch translations for interface. Falling back to english...');
    } finally {
        document.querySelector('.main').style.visibility = 'visible';
        document.querySelector('.spinner').remove();
    }
});
