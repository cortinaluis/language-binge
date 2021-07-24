const isWordTranslationInCache = (word, cache = window.languageBingeExtension.wordTranslationCache) => !!cache[word];

const setWordTranslationInCache = (word, translation, cache = window.languageBingeExtension.wordTranslationCache) => cache[word] = translation;

const getWordTranslationInCache = (word, cache = window.languageBingeExtension.wordTranslationCache) => cache[word];

const isSentenceInCache = (sentence, cache = window.languageBingeExtension.sentenceCache) => !!cache[sentence];

const setSentenceAsCached = (sentence, cache = window.languageBingeExtension.sentenceCache) => cache[sentence] = true;

export { isWordTranslationInCache, setWordTranslationInCache, getWordTranslationInCache, isSentenceInCache, setSentenceAsCached };
