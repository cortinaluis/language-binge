import { getWordTranslationInCache, isWordTranslationInCache, setWordTranslationInCache } from './cache.js';
import { STREAMING_REGEXES } from './constants.js';

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

const urlMatchesSupportedStreamingServices = (url) => {
    if (!url) return null;

    for (let [key, value] of Object.entries(STREAMING_REGEXES)) {
        if (url.match(value)) {
            return key;
        }
    }

    return null;
};

async function timer(time = 1000) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
}

export {
    fetchTranslation,
    fetchSupportedLanguages,
    timer,
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
    sendMessageToContent,
    urlMatchesSupportedStreamingServices,
};
