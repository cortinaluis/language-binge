const logger = {
  log: (message, ...params) => {
    if (window.languageBingeExtension.isDebugActivated) {
      console.log(message, params);
    }
  },
  debug: (message, ...params) => {
    if (window.languageBingeExtension.isDebugActivated) {
      console.debug(message, params);
    }
  },
  error: (message, ...params) => {
    if (window.languageBingeExtension.isDebugActivated) {
      console.error(message, params);
    }
  },
  warn: (message, ...params) => {
    if (window.languageBingeExtension.isDebugActivated) {
      console.warn(message, params);
    }
  },
};

export default logger;
