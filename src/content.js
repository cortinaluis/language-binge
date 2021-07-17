import TranslationOverlayController from "./translation-overlay-controller.js";
import { handleMutation, timer } from "./helpers.js";
import * as Constants from "./constants.js";
let pageOverlay;
// const sentenceIndex = {};

const translationOverlayController = new TranslationOverlayController();

const subtitlesObserver = new MutationObserver((mutationList) => {
  console.debug('mutationList', mutationList);
  // console.debug('sentenceIndex', sentenceIndex);
  mutationList.forEach(handleMutation);
});

(async () => {
  window.translantionCache = {};
  // sets up pageOverlay
  pageOverlay = translationOverlayController.getPageOverlayElement();
  document.getElementsByTagName('body')[0].appendChild(pageOverlay);

  // waits for the subtitle to be loaded by the user for `SECONDS_TO_WAIT` seconds and sets up the subtitlesObserver
  for (let i = 0; i < 10; i++) {
    try {
      subtitlesObserver.observe(document.getElementsByClassName('player-timedtext')[0], { childList: true });
      return;
    } catch (error) {
      // todo: turn this into a soft-fail to include animation on extension while it is retrying
      console.error(error);
      console.warn(`Failed to find subtitle DOM element. Retrying in ${Constants.MILISECONDS_TO_WAIT} milisecond(s)...`);
      await timer(Constants.MILISECONDS_TO_WAIT);
    }
  }
  console.error('No subtitle DOM elements are available. Please make sure you have the subtitles enabled on your Netflix player.');
})();
