import { getWordTranslationInCache, isSentenceInCache, isWordTranslationInCache, setSentenceAsCached, setWordTranslationInCache } from './cache.js';
import { EMPTY_STRING } from './constants.js';
import ElementFactory from './element-factory.js';
import logger from './logger.js';

const fetchTranslation = async (word, source = 'en', target = 'pt') => {
    if (isWordTranslationInCache(word)) {
        return getWordTranslationInCache(word);
    }

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
    setWordTranslationInCache(word, translatedText);

    return translatedText;
};

const handleMutation = (mutationList) => {
    const overlay = document.getElementById('pageOverlay');

    const completeSentence = mutationList.reduce((sum, mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            return sum + '\n' + Array.from(mutation.addedNodes).reduce((sum, curr) => {
                const { innerText } = curr;
                curr.children[0].innerHTML = EMPTY_STRING;
                return sum + innerText;
            }, '');
        }
        return '';
    }, '');

    if (isSentenceInCache(completeSentence)) {
        return;
    }

    overlay.innerHTML = EMPTY_STRING;
    Array.from(document.querySelector('.player-timedtext').children).forEach(child => child.remove());
    logger.log('Text: ', completeSentence);

    setSentenceAsCached(completeSentence);
    overlay.appendChild(new ElementFactory().getSentenceElement(completeSentence));

};


// currently unused -- it's not like the libretranslate.de API is going to change every day
const fetchSupportedLanguages = async () => {
    const response = await fetch('https://libretranslate.de/languages', {
        headers: { 'accept': 'application/json' },
    });
    return await response.json();
};


const getObjectFromLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (value) => {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const saveObjectInLocalStorage = async (obj) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const sendMessageToContent = (message, payload) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { message, payload });
    });
};

async function timer(time = 1000) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
}

export {
    fetchTranslation,
    handleMutation,
    fetchSupportedLanguages,
    timer,
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
    sendMessageToContent,
};
