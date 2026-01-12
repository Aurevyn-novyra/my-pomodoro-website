/* =========================================================
   App Entry Point
   Orchestrates initialization and module wiring
   ========================================================= */

(function () {
  "use strict";

  // DOM Ready
  document.addEventListener("DOMContentLoaded", initApp);

  function initApp() {
    // Initialize core modules in correct order
    Storage.init();
    Settings.init();
    Sounds.init();
    Stats.init();
    Timer.init();
    Controls.init();

    // Restore persisted UI state
    restoreUIState();

    // App is ready
    document.body.classList.add("app-ready");
  }

  /* ---------------------------------------------------------
     Restore UI State
     --------------------------------------------------------- */
  function restoreUIState() {
    const lastSession = Storage.get("currentSession", "pomodoro");
    Controls.setActiveSession(lastSession);

    const isRunning = Storage.get("isRunning", false);
    if (isRunning) {
      Timer.resume();
    }
  }

})();
