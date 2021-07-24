import { getWordTranslationInCache, isWordTranslationInCache } from './cache.js';
import { WHITESPACE } from './constants.js';
import { fetchTranslation } from './helpers.js';


export default class ElementFactory {
    toggleVideoState() {
        const video = document.getElementsByTagName('video')[0];
        return video.paused ? video.play() : video.pause();
    }

    getWordSpanElement(word) {
        const span = document.createElement('span');
        span.innerText = word.trim();
        span.className = 'langBingeSpan';

        const textNode = document.createElement('span');
        textNode.innerText = 'loading...'; // todo: replace this with an animation
        textNode.className = 'langBingeTooltipText';

        span.appendChild(textNode);
        span.addEventListener('mouseover', async () => {
            this.toggleVideoState();
            const lowercaseWord = word.toLowerCase();

            if (isWordTranslationInCache(lowercaseWord)) {
                textNode.innerText = getWordTranslationInCache(lowercaseWord);
            } else {
                const { fromLanguage, toLanguage } = window.languageBingeExtension;
                const translation = await fetchTranslation(lowercaseWord, fromLanguage, toLanguage);
                textNode.innerText = translation;
            }
        });

        span.addEventListener('mouseleave', () => this.toggleVideoState());
        return span;
    }

    getSentenceElement(sentence, hash) {
        const div = document.createElement('div');
        div.className = 'langBingeSentence';
        div.id = hash;

        sentence.split(WHITESPACE).forEach((word) => {
            div.appendChild(this.getWordSpanElement(word));
        });

        return div;
    }

    getPageOverlayElement() {
        const pageOverlay = document.createElement('div');
        pageOverlay.className = 'pageOverlay';
        pageOverlay.id = 'pageOverlay';
        return pageOverlay;
    }

    getOptionElementsForLanguagesAsString(languages) {
        return languages.reduce((result, { code: languageAbbreviation, name }) => {
            const languageOption = document.createElement('option');
            languageOption.value = languageAbbreviation;
            languageOption.text = name;
            return result + languageOption.outerHTML;
        }, '');
    }
}
