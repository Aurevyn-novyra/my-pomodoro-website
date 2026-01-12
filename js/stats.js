/* =========================================================
   Stats Module
   Tracks focus time and completed sessions
   ========================================================= */

const Stats = (function () {
  "use strict";

  // DOM elements
  const todayFocusEl = document.getElementById("todayFocusTime");
  const totalSessionsEl = document.getElementById("totalSessions");

  // Internal counters
  let todayFocusSeconds = 0;
  let totalSessions = 0;

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    loadStats();
    render();
  }

  /* ---------------------------------------------------------
     Load / Save
     --------------------------------------------------------- */
  function loadStats() {
    const todayKey = getTodayKey();

    todayFocusSeconds = Storage.get(todayKey, 0);
    totalSessions = Storage.get("totalSessions", 0);
  }

  function saveStats() {
    const todayKey = getTodayKey();

    Storage.set(todayKey, todayFocusSeconds);
    Storage.set("totalSessions", totalSessions);
  }

  /* ---------------------------------------------------------
     Recording Logic
     --------------------------------------------------------- */
  function recordSession(sessionType, durationSeconds) {
    if (sessionType === "pomodoro") {
      todayFocusSeconds += durationSeconds;
      totalSessions += 1;

      saveStats();
      render();
    }
  }

  /* ---------------------------------------------------------
     Long Break Logic
     --------------------------------------------------------- */
  function shouldLongBreak() {
    const sessionsBeforeLongBreak = 4;
    return totalSessions % sessionsBeforeLongBreak === 0;
  }

  /* ---------------------------------------------------------
     UI Rendering
     --------------------------------------------------------- */
  function render() {
    todayFocusEl.textContent = formatTime(todayFocusSeconds);
    totalSessionsEl.textContent = totalSessions;
  }

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    return `${hrs}h ${mins}m`;
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function getTodayKey() {
    const today = new Date().toISOString().split("T")[0];
    return `focus-${today}`;
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  return {
    init,
    recordSession,
    shouldLongBreak
  };
})();
