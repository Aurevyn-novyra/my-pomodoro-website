/* =========================================================
   Sounds Module
   Handles focus music, alarm sounds, volume, and mute
   ========================================================= */

const Sounds = (function () {
  "use strict";

  // Audio elements
  const focusMusic = document.getElementById("focusMusic");
  const alarmSound = document.getElementById("alarmSound");

  let volume = 0.5;
  let muted = false;

  /* ---------------------------------------------------------
     Initialization
     --------------------------------------------------------- */
  function init() {
    volume = Storage.get("volume", 0.5);
    muted = Storage.get("mute", false);

    applyAudioSettings();
  }

  /* ---------------------------------------------------------
     Focus Music Controls
     --------------------------------------------------------- */
  function playFocus() {
    if (muted) return;

    focusMusic.currentTime = 0;
    focusMusic.play().catch(() => {});
  }

  function pauseFocus() {
    focusMusic.pause();
  }

  /* ---------------------------------------------------------
     Alarm Controls
     --------------------------------------------------------- */
  function playAlarm() {
    if (muted) return;

    alarmSound.currentTime = 0;
    alarmSound.play().catch(() => {});
  }

  /* ---------------------------------------------------------
     Volume & Mute
     --------------------------------------------------------- */
  function setVolume(value) {
    volume = parseFloat(value);
    Storage.set("volume", volume);
    applyAudioSettings();
  }

  function setMute(value) {
    muted = Boolean(value);
    Storage.set("mute", muted);
    applyAudioSettings();
  }

  function applyAudioSettings() {
    focusMusic.volume = volume;
    alarmSound.volume = volume;

    focusMusic.muted = muted;
    alarmSound.muted = muted;
  }

  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */
  return {
    init,
    playFocus,
    pauseFocus,
    playAlarm,
    setVolume,
    setMute
  };
})();
