import ElementFactory from '@/misc/element-factory.js';
import { getObjectFromLocalStorage, saveObjectInLocalStorage, handleMutation, timer } from '@/misc/helpers.js';
import { MILISECONDS_TO_WAIT, MESSAGES } from '@/misc/constants.js';
import logger from '@/misc/logger';

const elementFactory = new ElementFactory();

const subtitlesObserver = new MutationObserver((mutationList) => {
    logger.debug('mutationList', mutationList);
    handleMutation(mutationList);
});


const setupGlobalWindowConfiguration = async () => {
    const fromLanguage = await getObjectFromLocalStorage('fromLanguage');
    const toLanguage = await getObjectFromLocalStorage('toLanguage');

    window.languageBingeExtension = {
        sentenceCache: {},
        wordTranslationCache: {},
        fromLanguage,
        toLanguage,
    };

    chrome.runtime.onMessage.addListener(({ message, payload }) => {
        switch(message) {

        case MESSAGES.SET_FROM_LANGUAGE:
            saveObjectInLocalStorage({
                fromLanguage: payload,
            });
            window.languageBingeExtension.fromLanguage = payload;
            break;

        case MESSAGES.SET_TO_LANGUAGE:
            saveObjectInLocalStorage({
                toLanguage: payload,
            });
            window.languageBingeExtension.toLanguage = payload;
            break;
        default:
            break;
        }
        return true;
    });
};

const setupPageOverlay = () => document.getElementsByTagName('body')[0].appendChild(elementFactory.getPageOverlayElement());

const cleanupPageOverlay = () => document.getElementById('pageOverlay').remove();

const getNetflixSubtitleComponent = () => document.getElementsByClassName('player-timedtext')[0];

const bootstrapExtension = async () => {
    await setupGlobalWindowConfiguration();
    setupPageOverlay();

    // waits for the subtitle to be loaded by the user for `MILLISECONDS_TO_WAIT` seconds and sets up the subtitlesObserver
    for (let i = 0; i < 10; i++) {
        try {
            subtitlesObserver.observe(getNetflixSubtitleComponent(), { childList: true });
            return;
        } catch (error) {
            // todo: turn this soft-fail into an animation extension icon while it is retrying
            logger.error(error);
            logger.warn(`Failed to find subtitle DOM element. Retrying in ${MILISECONDS_TO_WAIT} milisecond(s)...`);
            await timer(MILISECONDS_TO_WAIT);
        }
    }
    logger.error('No subtitle DOM elements are available. Please make sure you have the subtitles enabled on your Netflix player.');
};


chrome.runtime.onMessage.addListener(({ message }) => {
    switch(message) {
    case MESSAGES.BOOTSTRAP_EXTENSION:
        bootstrapExtension();
        break;
    case MESSAGES.CLEANUP_PAGE_OVERLAY:
        cleanupPageOverlay();
        break;
    default:
        logger.warn('Unsupported message type', { message });
    }
});
