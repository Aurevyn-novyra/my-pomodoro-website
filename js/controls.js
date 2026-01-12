/* =========================================================
   Controls Module
   Handles user interactions and UI control wiring
   ========================================================= */

const Controls = (function () {
  "use strict";

  // DOM elements
  const startPauseBtn = document.getElementById("startPauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const sessionTabs = document.querySelectorAll(".session-tab");
  const fullscreenToggle = document.getElementById("fullscreenToggle");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsPanel = document.getElementById("settingsPanel");

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    bindControls();
    syncInitialState();
  }

  /* ---------------------------------------------------------
     Event Bindings
     --------------------------------------------------------- */
  function bindControls() {
    // Start / Pause
    startPauseBtn.addEventListener("click", handleStartPause);

    // Reset
    resetBtn.addEventListener("click", handleReset);

    // Session tabs
    sessionTabs.forEach((tab) => {
      tab.addEventListener("click", () => handleSessionTab(tab));
    });

    // Fullscreen toggle
    fullscreenToggle.addEventListener("click", toggleFullscreen);

    // Settings panel toggle
    settingsToggle.addEventListener("click", toggleSettingsPanel);
  }

  /* ---------------------------------------------------------
     Control Handlers
     --------------------------------------------------------- */
  function handleStartPause() {
    if (Timer.isRunning()) {
      Timer.pause();
      updateStartPauseUI(false);
    } else {
      Timer.start();
      updateStartPauseUI(true);
    }
  }

  function handleReset() {
    Timer.reset();
    updateStartPauseUI(false);
  }

  function handleSessionTab(tab) {
    if (Timer.isRunning()) {
      Timer.pause();
      updateStartPauseUI(false);
    }

    const session = tab.dataset.session;
    setActiveSession(session);
    Timer.setSession(session);
  }

  /* ---------------------------------------------------------
     UI State Updates
     --------------------------------------------------------- */
  function updateStartPauseUI(isRunning) {
    startPauseBtn.textContent = isRunning ? "Pause" : "Start";
  }

  function setActiveSession(session) {
    sessionTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.session === session);
    });

    Storage.set("currentSession", session);
  }

  function syncInitialState() {
    const session = Storage.get("currentSession", "pomodoro");
    setActiveSession(session);
    updateStartPauseUI(false);
  }

  /* ---------------------------------------------------------
     Fullscreen
     --------------------------------------------------------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  /* ---------------------------------------------------------
     Settings Panel
     --------------------------------------------------------- */
  function toggleSettingsPanel() {
    const isHidden = settingsPanel.getAttribute("aria-hidden") === "true";
    settingsPanel.setAttribute("aria-hidden", String(!isHidden));
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  return {
    init,
    setActiveSession
  };
})();
