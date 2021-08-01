import { isSentenceInCache, setSentenceAsCached } from '@/misc/cache.js';
import { EMPTY_STRING } from '@/misc/constants.js';
import ElementFactory from '@/misc/element-factory.js';
import logger from '@/misc/logger.js';

export default class NetflixMutationObserver {
  constructor() {
    this.mutationObserver = new MutationObserver((mutationList) => {
      logger.debug('mutationList', mutationList);
      const overlay = document.getElementById('pageOverlay');

      const completeSentence = mutationList.reduce((sum, mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          return (
            sum +
            '\n' +
            Array.from(mutation.addedNodes).reduce((sum, curr) => {
              const { innerText } = curr;
              curr.children[0].innerHTML = EMPTY_STRING;
              return sum + innerText;
            }, '')
          );
        }
        return '';
      }, '');

      Array.from(document.querySelector('.player-timedtext').children).forEach(
        (child) => child.remove()
      );

      if (isSentenceInCache(completeSentence)) {
        return;
      }

      overlay.innerHTML = EMPTY_STRING;
      logger.log('Text: ', completeSentence);

      setSentenceAsCached(completeSentence);
      overlay.appendChild(ElementFactory.getSentenceElement(completeSentence));
    });
  }

  observe() {
    return this.mutationObserver.observe(
      document.getElementsByClassName('player-timedtext')[0],
      { childList: true }
    );
  }
}
