const logger = {
    log: (message, ...params) => {
        if (window.isDebugActivated) {
            console.log(message, params);
        }
    },
    debug: (message, ...params) => {
        if (window.isDebugActivated) {
            console.debug(message, params);
        }
    },
    error: (message, ...params) => {
        if (window.isDebugActivated) {
            console.error(message, params);
        }
    },
    warn: (message, ...params) => {
        if (window.isDebugActivated) {
            console.warn(message, params);
        }
    },
};

export default logger;
