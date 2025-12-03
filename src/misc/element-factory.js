import { getWordTranslationInCache, isWordTranslationInCache } from './cache';
import { SUPPORTED_LANGUAGES, WHITESPACE } from './constants';
import { fetchTranslation, getObjectFromSyncStorage } from './helpers';

export default class ElementFactory {
  // todo: add video param as reference or create new strategy?
  static getWordSpanElement(word) {
    const span = document.createElement('span');
    span.innerText = word.trim();
    span.className = 'langBingeSpan';

    span.addEventListener('mouseover', async () => {
      const textNode = document.createElement('span');
      textNode.className = 'langBingeTooltipText spinner';
      span.appendChild(textNode);
      document.getElementsByTagName('video')[0].pause();
      const lowercaseWord = word.toLowerCase();

      if (isWordTranslationInCache(lowercaseWord)) {
        textNode.innerText = getWordTranslationInCache(lowercaseWord);
      } else {
        const fromLanguage = await getObjectFromSyncStorage('fromLanguage');
        const toLanguage = await getObjectFromSyncStorage('toLanguage');

        textNode.innerText = await fetchTranslation(
          lowercaseWord,
          fromLanguage,
          toLanguage
        );
      }
      textNode.className = 'langBingeTooltipText';
    });

    span.addEventListener('mouseleave', () =>
      document.getElementsByTagName('video')[0].play()
    );
    return span;
  }

  static getSentenceElement(sentence, hash) {
    const div = document.createElement('div');
    div.className = 'langBingeSentence';
    div.id = hash;

    sentence.split(WHITESPACE).forEach((word) => {
      div.appendChild(ElementFactory.getWordSpanElement(word));
    });

    return div;
  }

  static getPageOverlayElement() {
    const pageOverlay = document.createElement('div');
    pageOverlay.className = 'pageOverlay';
    pageOverlay.id = 'pageOverlay';
    return pageOverlay;
  }

  static getOptionElementsForLanguages(selectedLanguage) {
    const optionElements = [];
    for (const { code: languageAbbreviation, name } of SUPPORTED_LANGUAGES) {
      const languageOption = document.createElement('option');
      languageOption.value = languageAbbreviation;
      languageOption.text = name;
      if (languageAbbreviation === selectedLanguage) {
        languageAbbreviation.selected = true;
      }
      optionElements.push(languageOption);
    }

    return optionElements;
  }
}
