import TranslationOverlayController from './translation-overlay-controller.js';
import Constants from './constants.js';

const fetchTranslation = async (word, source = 'en', target = 'pt') => {
    const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: word,
            source,
            target,
        }),
    });
    const { translatedText } = await response.json();
    window.languageBingeCache[word] = translatedText;    
    return translatedText;
};

const handleMutation = (mutation) => {
    // todo: review this logic... maybe you dont need to check for so many cases
    // the bug right now is that it is capturing unnecessary events that happen on the subtitle
    // hint: maybe JUST MAYBE there is a problem with event bubbling, e.g. when you hover the cursor
    // this excess of events is what makes us use the sentenceIndex (more like a cache lol)
    const addedNode = mutation.addedNodes[0];
    if (mutation.type === 'childList' && addedNode) {
        const sentence = addedNode.innerText;
        const sentenceSpanHtmlElement = addedNode.children[0];
        // indexing
        /*
        if (sentenceIndex[sentence]) {
          return;
        }
        sentenceIndex[sentence] = true;
        */
        console.log('Text: ', sentence);
        console.dir(sentenceSpanHtmlElement);
        sentenceSpanHtmlElement.innerHTML = Constants.EMPTY_STRING;
        sentenceSpanHtmlElement.style.zIndex = 999999;
        const overlay = document.getElementsByClassName('pageOverlay')[0];
        overlay.innerHTML = Constants.EMPTY_STRING;
        overlay.appendChild(new TranslationOverlayController().getSentenceElement(sentence));
    }
};

async function timer(time = 1000) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
}

export { fetchTranslation, handleMutation, timer };
