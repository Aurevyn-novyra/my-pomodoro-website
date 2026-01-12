/* =========================================================
   Settings Module
   Manages user preferences and timer configuration
   ========================================================= */

const Settings = (function () {
  "use strict";

  // Default settings
  const DEFAULTS = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    volume: 0.5,
    mute: false,
    autoStart: false
  };

  // DOM elements
  const pomodoroInput = document.getElementById("pomodoroDuration");
  const shortBreakInput = document.getElementById("shortBreakDuration");
  const longBreakInput = document.getElementById("longBreakDuration");
  const volumeControl = document.getElementById("volumeControl");
  const muteToggle = document.getElementById("muteToggle");
  const autoStartToggle = document.getElementById("autoStartToggle");

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    loadSettings();
    bindEvents();
  }

  /* ---------------------------------------------------------
     Load & Persist
     --------------------------------------------------------- */
  function loadSettings() {
    pomodoroInput.value = Storage.get("pomodoro", DEFAULTS.pomodoro);
    shortBreakInput.value = Storage.get("shortBreak", DEFAULTS.shortBreak);
    longBreakInput.value = Storage.get("longBreak", DEFAULTS.longBreak);

    volumeControl.value = Storage.get("volume", DEFAULTS.volume);
    muteToggle.checked = Storage.get("mute", DEFAULTS.mute);
    autoStartToggle.checked = Storage.get("autoStart", DEFAULTS.autoStart);
  }

  function saveSetting(key, value) {
    Storage.set(key, value);
  }

  /* ---------------------------------------------------------
     Event Bindings
     --------------------------------------------------------- */
  function bindEvents() {
    pomodoroInput.addEventListener("change", () => {
      saveSetting("pomodoro", clamp(pomodoroInput.value, 1, 420));
      Timer.setSession(Timer.getCurrentSession());
    });

    shortBreakInput.addEventListener("change", () => {
      saveSetting("shortBreak", clamp(shortBreakInput.value, 1, 60));
      Timer.setSession(Timer.getCurrentSession());
    });

    longBreakInput.addEventListener("change", () => {
      saveSetting("longBreak", clamp(longBreakInput.value, 1, 120));
      Timer.setSession(Timer.getCurrentSession());
    });

    volumeControl.addEventListener("input", () => {
      saveSetting("volume", parseFloat(volumeControl.value));
      Sounds.setVolume(volumeControl.value);
    });

    muteToggle.addEventListener("change", () => {
      saveSetting("mute", muteToggle.checked);
      Sounds.setMute(muteToggle.checked);
    });

    autoStartToggle.addEventListener("change", () => {
      saveSetting("autoStart", autoStartToggle.checked);
    });
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function clamp(value, min, max) {
    return Math.min(Math.max(parseInt(value, 10), min), max);
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  function getDurations() {
    return {
      pomodoro: Storage.get("pomodoro", DEFAULTS.pomodoro),
      shortBreak: Storage.get("shortBreak", DEFAULTS.shortBreak),
      longBreak: Storage.get("longBreak", DEFAULTS.longBreak)
    };
  }

  return {
    init,
    getDurations
  };
})();
