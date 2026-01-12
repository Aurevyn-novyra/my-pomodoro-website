/* =========================================================
   Timer Module
   Handles countdown logic, session switching, and progress
   ========================================================= */

const Timer = (function () {
  "use strict";

  // Internal state
  let duration = 25 * 60; // seconds
  let remaining = duration;
  let intervalId = null;
  let isRunning = false;
  let currentSession = "pomodoro";

  // SVG progress ring
  const RING_CIRCUMFERENCE = 2 * Math.PI * 100; // r = 100

  // DOM elements
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const progressRing = document.querySelector(".progress-ring-progress");

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    currentSession = Storage.get("currentSession", "pomodoro");
    duration = getSessionDuration(currentSession);
    remaining = duration;

    updateDisplay();
    updateProgress();

    Storage.set("isRunning", false);
  }

  /* ---------------------------------------------------------
     Timer Controls
     --------------------------------------------------------- */
  function start() {
    if (isRunning) return;

    isRunning = true;
    Storage.set("isRunning", true);

    Sounds.playFocus();

    intervalId = setInterval(tick, 1000);
  }

  function pause() {
    if (!isRunning) return;

    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;

    Storage.set("isRunning", false);
    Sounds.pauseFocus();
  }

  function reset() {
    pause();
    remaining = duration;
    updateDisplay();
    updateProgress();
  }

  function resume() {
    if (remaining > 0) {
      start();
    }
  }

  /* ---------------------------------------------------------
     Tick Logic
     --------------------------------------------------------- */
  function tick() {
    if (remaining <= 0) {
      completeSession();
      return;
    }

    remaining -= 1;
    updateDisplay();
    updateProgress();
  }

  /* ---------------------------------------------------------
     Session Completion
     --------------------------------------------------------- */
  function completeSession() {
    pause();
    remaining = 0;
    updateDisplay();
    updateProgress();

    Sounds.playAlarm();

    // Update stats
    Stats.recordSession(currentSession, duration);

    // Auto-switch session
    switchSessionAuto();
  }

  function switchSessionAuto() {
    const autoStart = Storage.get("autoStart", false);

    if (currentSession === "pomodoro") {
      currentSession = Stats.shouldLongBreak()
        ? "longBreak"
        : "shortBreak";
    } else {
      currentSession = "pomodoro";
    }

    setSession(currentSession);

    if (autoStart) {
      start();
    }
  }

  /* ---------------------------------------------------------
     Session Management
     --------------------------------------------------------- */
  function setSession(session) {
    currentSession = session;
    Storage.set("currentSession", session);

    duration = getSessionDuration(session);
    remaining = duration;

    updateDisplay();
    updateProgress();
  }

  function getSessionDuration(session) {
    const settings = Settings.getDurations();

    switch (session) {
      case "shortBreak":
        return settings.shortBreak * 60;
      case "longBreak":
        return settings.longBreak * 60;
      case "pomodoro":
      default:
        return settings.pomodoro * 60;
    }
  }

  /* ---------------------------------------------------------
     UI Updates
     --------------------------------------------------------- */
  function updateDisplay() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    minutesEl.textContent = String(mins).padStart(2, "0");
    secondsEl.textContent = String(secs).padStart(2, "0");
  }

  function updateProgress() {
    const progress = remaining / duration;
    const offset = RING_CIRCUMFERENCE * (1 - progress);

    progressRing.style.strokeDasharray = RING_CIRCUMFERENCE;
    progressRing.style.strokeDashoffset = offset;
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  return {
    init,
    start,
    pause,
    reset,
    resume,
    setSession,
    isRunning: () => isRunning,
    getCurrentSession: () => currentSession
  };
})();
