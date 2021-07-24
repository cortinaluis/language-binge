import { MESSAGES, STREAMING_REGEXES } from '@/misc/constants';

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete'){
        chrome.tabs.get(tabId, (tab) => {
            if (tab.url?.match(STREAMING_REGEXES.NETFLIX)) {
                chrome.tabs.sendMessage(tabId, { message: MESSAGES.BOOTSTRAP_EXTENSION });
            } else {
                chrome.tabs.sendMessage(tabId, { message: MESSAGES.CLEANUP_PAGE_OVERLAY });
            }
        });
    }
});
