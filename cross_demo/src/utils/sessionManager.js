/**
 * Session Manager
 * Handles automatic logout after a period of inactivity.
 */

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

let timeoutId = null;
let onExpireCallback = null;

const resetTimer = () => {
  if (!onExpireCallback) return;
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (onExpireCallback) onExpireCallback();
  }, INACTIVITY_TIMEOUT_MS);
};

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

export const start = ({ onExpire }) => {
  onExpireCallback = onExpire;
  ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));
  resetTimer();
};

export const stop = () => {
  onExpireCallback = null;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, resetTimer));
};
