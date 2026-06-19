// Jewels Insult Counter — a phone-friendly tally for dinner-time roasts.
// All data is stored locally on the device (localStorage). Nothing is sent anywhere.

(function () {
  "use strict";

  var STORAGE_KEY = "jewels-insult-counter-v1";

  var els = {
    count: document.getElementById("count"),
    tonight: document.getElementById("tonight"),
    rate: document.getElementById("rate"),
    record: document.getElementById("record"),
    tapBtn: document.getElementById("tapBtn"),
    undoBtn: document.getElementById("undoBtn"),
    resetBtn: document.getElementById("resetBtn"),
    logList: document.getElementById("logList"),
    emptyLog: document.getElementById("emptyLog"),
    toast: document.getElementById("toast"),
  };

  // state.events = array of timestamps (ms) for the current night.
  // state.record = highest single-night total ever.
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return {
          events: Array.isArray(parsed.events) ? parsed.events : [],
          record: typeof parsed.record === "number" ? parsed.record : 0,
        };
      }
    } catch (e) {
      /* fall through to defaults */
    }
    return { events: [], record: 0 };
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage might be full or blocked; counting still works in-memory */
    }
  }

  function formatTime(ms) {
    var d = new Date(ms);
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return h + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
  }

  function perHour() {
    if (state.events.length < 2) return state.events.length;
    var spanMs = state.events[state.events.length - 1] - state.events[0];
    var hours = spanMs / 3600000;
    if (hours < 1 / 60) return state.events.length; // less than a minute: just show count
    return Math.round(state.events.length / hours);
  }

  function buzz(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  var toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove("show");
    }, 1400);
  }

  function render() {
    var n = state.events.length;
    els.count.textContent = n;
    els.tonight.textContent = n;
    els.rate.textContent = perHour();
    els.record.textContent = Math.max(state.record, n);

    // Timeline (newest first)
    els.logList.innerHTML = "";
    if (n === 0) {
      els.emptyLog.style.display = "block";
    } else {
      els.emptyLog.style.display = "none";
      for (var i = n - 1; i >= 0; i--) {
        var li = document.createElement("li");
        var idx = document.createElement("span");
        idx.className = "idx";
        idx.textContent = "#" + (i + 1);
        var time = document.createElement("span");
        time.className = "time";
        time.textContent = formatTime(state.events[i]);
        li.appendChild(idx);
        li.appendChild(time);
        els.logList.appendChild(li);
      }
    }
  }

  function addInsult() {
    state.events.push(Date.now());
    if (state.events.length > state.record) {
      state.record = state.events.length;
    }
    save();
    render();
    buzz(35);
    els.tapBtn.classList.remove("pop");
    // force reflow so the animation can replay
    void els.tapBtn.offsetWidth;
    els.tapBtn.classList.add("pop");
  }

  function undo() {
    if (state.events.length === 0) {
      toast("Nothing to undo");
      return;
    }
    state.events.pop();
    save();
    render();
    buzz(15);
    toast("Removed last insult");
  }

  function resetNight() {
    if (state.events.length === 0) {
      toast("Already at zero");
      return;
    }
    if (!confirm("Reset tonight's count to 0?\n(Your all-time record is kept.)")) {
      return;
    }
    if (state.events.length > state.record) {
      state.record = state.events.length;
    }
    state.events = [];
    save();
    render();
    toast("Fresh start ✨");
  }

  // Use pointerdown for snappy response on touch + mouse.
  els.tapBtn.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    addInsult();
  });
  // Prevent the iOS double-tap-to-zoom delay / ghost clicks.
  els.tapBtn.addEventListener("click", function (e) { e.preventDefault(); });

  els.undoBtn.addEventListener("click", undo);
  els.resetBtn.addEventListener("click", resetNight);

  // Keep the per-hour figure fresh even when idle.
  setInterval(function () {
    els.rate.textContent = perHour();
  }, 30000);

  render();

  // Offline support so it works at the dinner table with bad signal.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
