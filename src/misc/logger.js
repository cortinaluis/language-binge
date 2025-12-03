const logger = {
  log: (message, ...params) => {
    if (process.env.DEBUG) {
      console.log(message, params);
    }
  },
  debug: (message, ...params) => {
    if (process.env.DEBUG) {
      console.debug(message, params);
    }
  },
  error: (message, ...params) => {
    if (process.env.DEBUG) {
      console.error(message, params);
    }
  },
  warn: (message, ...params) => {
    if (process.env.DEBUG) {
      console.warn(message, params);
    }
  },
};

export default logger;
