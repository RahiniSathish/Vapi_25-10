/**
 * Professional logging utility for frontend
 * Provides consistent logging with levels and optional debug mode
 */

const DEBUG_MODE = import.meta.env.DEV || false; // Only debug in development

const logger = {
  /**
   * Log informational messages (only in debug mode)
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  info: (message, data = null) => {
    if (DEBUG_MODE) {
      if (data) {
        console.log(`[INFO] ${message}`, data);
      } else {
        console.log(`[INFO] ${message}`);
      }
    }
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {any} data - Optional data to log
   */
  warn: (message, data = null) => {
    if (data) {
      console.warn(`[WARN] ${message}`, data);
    } else {
      console.warn(`[WARN] ${message}`);
    }
  },

  /**
   * Log error messages (always shown)
   * @param {string} message - Error message
   * @param {Error|any} error - Error object or data
   */
  error: (message, error = null) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },

  /**
   * Log debug messages (only in debug mode)
   * @param {string} message - Debug message
   * @param {any} data - Optional data to log
   */
  debug: (message, data = null) => {
    if (DEBUG_MODE) {
      if (data) {
        console.log(`[DEBUG] ${message}`, data);
      } else {
        console.log(`[DEBUG] ${message}`);
      }
    }
  }
};

export default logger;

