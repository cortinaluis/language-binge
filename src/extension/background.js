import { MESSAGES } from '@/misc/constants';
import { urlMatchesSupportedStreamingServices } from '@/misc/helpers';

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.get(tabId, async (tab) => {
      const supportedStreamingService = urlMatchesSupportedStreamingServices(
        tab.url
      );
      if (supportedStreamingService) {
        await chrome.tabs.sendMessage(tabId, {
          message: MESSAGES.BOOTSTRAP_EXTENSION,
          streamingService: supportedStreamingService,
        });
      }
      // todo: evaluate this
      //  else {
      //   // bug: it's triggering cleanup even if the page doesn't have the overlay
      //   await chrome.tabs.sendMessage(tabId, {
      //     message: MESSAGES.CLEANUP_PAGE_OVERLAY,
      //   });
      // }
    });
  }
});
