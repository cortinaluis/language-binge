import { getWordTranslationInCache, isWordTranslationInCache } from './cache';
import { WHITESPACE } from './constants';
import { fetchTranslation } from './helpers';

export default class ElementFactory {
  // todo: add video param as reference or create new strategy?
  static getWordSpanElement(word) {
    const span = document.createElement('span');
    span.innerText = word.trim();
    span.className = 'langBingeSpan';

    const textNode = document.createElement('span');
    textNode.innerText = 'loading...'; // todo: repl ace this with an animation
    textNode.className = 'langBingeTooltipText';

    span.appendChild(textNode);
    span.addEventListener('mouseover', async () => {
      document.getElementsByTagName('video')[0].pause();
      const lowercaseWord = word.toLowerCase();

      if (isWordTranslationInCache(lowercaseWord)) {
        textNode.innerText = getWordTranslationInCache(lowercaseWord);
      } else {
        const { fromLanguage, toLanguage } = window.languageBingeExtension;
        const translation = await fetchTranslation(
          lowercaseWord,
          fromLanguage,
          toLanguage
        );
        textNode.innerText = translation;
      }
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

  static getOptionElementsForLanguagesAsString(languages) {
    return languages.reduce((result, { code: languageAbbreviation, name }) => {
      const languageOption = document.createElement('option');
      languageOption.value = languageAbbreviation;
      languageOption.text = name;
      return result + languageOption.outerHTML;
    }, '');
  }
}
