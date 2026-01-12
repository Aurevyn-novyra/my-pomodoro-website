/* =========================================================
   Storage Module
   Simple localStorage abstraction with safety checks
   ========================================================= */

const Storage = (function () {
  "use strict";

  const PREFIX = "focusflow:";

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    // Test localStorage availability
    try {
      const testKey = `${PREFIX}__test__`;
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
    } catch (e) {
      console.warn("LocalStorage is not available. Settings will not persist.");
    }
  }

  /* ---------------------------------------------------------
     Get / Set Helpers
     --------------------------------------------------------- */
  function get(key, defaultValue) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      // Silently fail if storage is unavailable
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {}
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  return {
    init,
    get,
    set,
    remove
  };
})();
