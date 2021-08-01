import { MUTATION_OBSERVER_MAPPING } from './constants.js';
import logger from './logger.js';

export default class MutationObserverStrategy {
    constructor(streamingService) {
        this._strategy = streamingService ? new MUTATION_OBSERVER_MAPPING[streamingService]() : null;
    }

    set streamingService(streamingService) {
        this._strategy = new MUTATION_OBSERVER_MAPPING[streamingService]();
    }

    observe() {
        if (!this._strategy) {
            logger.error('MutationObserverStrategy was not defined yet');
            return;
        }
        return this._strategy.observe();
    }
}
