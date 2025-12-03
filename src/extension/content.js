import ElementFactory from '@/misc/element-factory';
import { timer } from '@/misc/helpers';
import { MILISECONDS_TO_WAIT, MESSAGES } from '@/misc/constants';
import logger from '@/misc/logger';
import MutationObserverStrategy from '@/misc/mutation-observer-strategy';

const setupGlobalWindowConfiguration = () => {
  window.languageBingeExtension = {
    sentenceCache: {},
    wordTranslationCache: {},
  };
};

const setupPageOverlay = () =>
  document.body.appendChild(ElementFactory.getPageOverlayElement());

const cleanupPageOverlay = () =>
  document.getElementById('pageOverlay').remove();

const bootstrapExtension = async (streamingService) => {
  setupGlobalWindowConfiguration();
  setupPageOverlay();

  const mutationObserverStrategy = new MutationObserverStrategy(
    streamingService
  );

  // waits for the subtitle to be loaded by the user for `MILLISECONDS_TO_WAIT` seconds and sets up the subtitlesObserver
  for (let i = 0; i < 10; i++) {
    try {
      mutationObserverStrategy.observe();
      return;
    } catch (error) {
      // todo: turn this soft-fail into an animation extension icon while it is retrying
      logger.error(error);
      logger.warn(
        `Failed to find subtitle DOM element. Retrying in ${MILISECONDS_TO_WAIT} milisecond(s)...`
      );
      await timer(MILISECONDS_TO_WAIT);
    }
  }
  logger.error(
    `No subtitle DOM elements are available. Please make sure you have the subtitles enabled on your ${streamingService} player.`
  );
};

chrome.runtime.onMessage.addListener(async ({ message, streamingService }) => {
  switch (message) {
    case MESSAGES.BOOTSTRAP_EXTENSION:
      await bootstrapExtension(streamingService);
      break;
    case MESSAGES.CLEANUP_PAGE_OVERLAY:
      cleanupPageOverlay();
      break;
    default:
      logger.warn('Unsupported message type', { message });
  }
});
