import * as Constants from './constants.js';
import { fetchTranslation } from './helpers.js';

export default class TranslationOverlayController {
    getWordSpanElement(word) {
        const span = Object.assign(document.createElement('span'), {
            innerText: word.trim(),
            className: 'langBingeSpan',
        });

        const textNode = Object.assign(document.createElement('span'), {
            innerText: 'loading...',
            className: 'langBingeTooltipText',
        });

        span.appendChild(textNode);
        span.addEventListener('mouseover', async () => {
            if (window.languageBingeCache[word]) {
                textNode.innerText = window.languageBingeCache[word];
            } else {
                const translation = await fetchTranslation(word);
                textNode.innerText = translation;
            }
        });

        return span;
    }

    getSentenceElement(sentence) {
        const div = Object.assign(document.createElement('div'), { className: 'langBingeSentence' });

        sentence.split(Constants.WHITESPACE).forEach((word) => {
            div.appendChild(this.getWordSpanElement(word));
        });

        return div;
    }

    getPageOverlayElement() {
        const pageOverlay = Object.assign(document.createElement('div'), {
            className: 'pageOverlay',
        });

        return pageOverlay;
    }
}
