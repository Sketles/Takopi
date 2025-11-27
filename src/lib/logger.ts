// Conditional logger for better performance in production
// Only logs when NODE_ENV is not 'production'

const isDevelopment = process.env.NODE_ENV !== 'production';

type LogValue = string | number | boolean | object | null | undefined;

export const logger = {
  log: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: LogValue[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  warn: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: LogValue[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

// Export individual functions for convenience
export const { log, error, warn, info, debug } = logger;
