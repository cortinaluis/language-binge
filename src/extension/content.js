import ElementFactory from '@/misc/element-factory.js';
import { getObjectFromLocalStorage, saveObjectInLocalStorage, timer } from '@/misc/helpers.js';
import { MILISECONDS_TO_WAIT, MESSAGES } from '@/misc/constants.js';
import logger from '@/misc/logger.js';
import MutationObserverStrategy from '@/misc/mutation-observer-strategy.js';

const elementFactory = new ElementFactory();

const setupGlobalWindowConfiguration = async () => {
    const fromLanguage = await getObjectFromLocalStorage('fromLanguage');
    const toLanguage = await getObjectFromLocalStorage('toLanguage');

    window.languageBingeExtension = {
        sentenceCache: {},
        wordTranslationCache: {},
        fromLanguage,
        toLanguage,
        isDebugActivated: false,
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

const bootstrapExtension = async (streamingService) => {
    await setupGlobalWindowConfiguration();
    setupPageOverlay();

    const mutationObserverStrategy = new MutationObserverStrategy(streamingService);

    // waits for the subtitle to be loaded by the user for `MILLISECONDS_TO_WAIT` seconds and sets up the subtitlesObserver
    for (let i = 0; i < 10; i++) {
        try {
            mutationObserverStrategy.observe();
            return;
        } catch (error) {
            // todo: turn this soft-fail into an animation extension icon while it is retrying
            logger.error(error);
            logger.warn(`Failed to find subtitle DOM element. Retrying in ${MILISECONDS_TO_WAIT} milisecond(s)...`);
            await timer(MILISECONDS_TO_WAIT);
        }
    }
    logger.error(`No subtitle DOM elements are available. Please make sure you have the subtitles enabled on your ${streamingService} player.`);
};


chrome.runtime.onMessage.addListener(({ message, streamingService }) => {
    switch(message) {
    case MESSAGES.BOOTSTRAP_EXTENSION:
        bootstrapExtension(streamingService);
        break;
    case MESSAGES.CLEANUP_PAGE_OVERLAY:
        cleanupPageOverlay();
        break;
    default:
        logger.warn('Unsupported message type', { message });
    }
});
