// alter
const geburtsdatum = new Date(2005, 11, 7);

// alter aus geburtsdatum errechnen
function berechneAlter(geb) {
  const heute = new Date();
  let alter = heute.getFullYear() - geb.getFullYear();
  const diff = heute.getMonth() - geb.getMonth();
  // noch kein geburtstag
  if (diff < 0 || (diff === 0 && heute.getDate() < geb.getDate())) {
    alter--;
  }
  return alter;
}

// admin
function istUserAdmin(username) {
  const admins = ["wamos05"];
  return admins.includes(username);
}

function initializeMyspace() {
  const alterFeld = document.getElementById("alter-anzeige");
  if (alterFeld) {
    alterFeld.textContent = berechneAlter(geburtsdatum);
  }

  const isGuest = localStorage.getItem("isGuest") === "true";
  const statusSelect = document.getElementById("status-select");
  if (statusSelect) {
    if (isGuest) {
      statusSelect.disabled = true;
      statusSelect.value = localStorage.getItem("userStatus") || "Offline";
    } else {
      const gespeicherterStatus =
        localStorage.getItem("userStatus") || "Online";
      statusSelect.value = gespeicherterStatus;
      statusSelect.addEventListener("change", (e) => {
        localStorage.setItem("userStatus", e.target.value);
      });
    }
  }

  const friendBtn = document.getElementById("friend-btn");
  if (friendBtn) {
    friendBtn.disabled = isGuest;
  }

  if (typeof applyTheme === "function") {
    applyTheme(getSavedTheme());
    initThemeSelect("theme-select");
  }

  const postBtn = document.getElementById("post-button");
  if (postBtn) {
    postBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof nachrichtSenden === "function") nachrichtSenden();
    });
  }

  // nachricht per enter
  const textInput = document.getElementById("nachricht-text");
  if (textInput) {
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (typeof nachrichtSenden === "function") nachrichtSenden();
      }
    });
  }

  loadWallMessages();

  const clearBtn = document.getElementById("clear-wall-button");
  if (clearBtn) {
    const aktuellerUser = localStorage.getItem("username") || "Gast";
    if (!istUserAdmin(aktuellerUser)) {
      clearBtn.style.display = "none";
    } else {
      clearBtn.addEventListener("click", () => {
        if (
          confirm(
            "Möchtest du wirklich alle Nachrichten von der Pinnwand löschen?",
          )
        ) {
          clearWall();
        }
      });
    }
  }

  // Papierkorb-Tabs (nur für Admin)
  const aktuellerUserAdmin = localStorage.getItem("username") || "Gast";
  if (istUserAdmin(aktuellerUserAdmin)) {
    const tabPapierkorb = document.getElementById("tab-papierkorb");
    const pinnwandInhalt = document.getElementById("pinnwand-inhalt");
    const papierkorbInhalt = document.getElementById("papierkorb-inhalt");
    const clearWallBtn = document.getElementById("clear-wall-button");
    const pinnwandTitel = document.getElementById("pinnwand-titel");
    const papierkorbWiederherstellenBtn = document.getElementById(
      "papierkorb-wiederherstellen-button",
    );
    const papierkorbLeerenBtn = document.getElementById(
      "papierkorb-leeren-button",
    );

    if (tabPapierkorb) tabPapierkorb.classList.remove("d-none");

    tabPapierkorb?.addEventListener("click", () => {
      const imPapierkorb = !papierkorbInhalt.classList.contains("d-none");

      if (imPapierkorb) {
        pinnwandInhalt.classList.remove("d-none");
        papierkorbInhalt.classList.add("d-none");
        if (clearWallBtn) clearWallBtn.classList.remove("d-none");
        if (papierkorbWiederherstellenBtn) {
          papierkorbWiederherstellenBtn.classList.add("d-none");
        }
        if (papierkorbLeerenBtn) papierkorbLeerenBtn.classList.add("d-none");
        if (pinnwandTitel) pinnwandTitel.textContent = "Pinnwand";
        tabPapierkorb.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Papierkorb';
        tabPapierkorb.classList.replace(
          "btn-secondary",
          "btn-outline-secondary",
        );
      } else {
        pinnwandInhalt.classList.add("d-none");
        papierkorbInhalt.classList.remove("d-none");
        if (clearWallBtn) clearWallBtn.classList.add("d-none");
        if (papierkorbWiederherstellenBtn) {
          papierkorbWiederherstellenBtn.classList.remove("d-none");
        }
        if (papierkorbLeerenBtn) papierkorbLeerenBtn.classList.remove("d-none");
        if (pinnwandTitel) pinnwandTitel.textContent = "Papierkorb";
        tabPapierkorb.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Zurück';
        tabPapierkorb.classList.replace(
          "btn-outline-secondary",
          "btn-secondary",
        );
        loadPapierkorb();
      }
    });

    papierkorbWiederherstellenBtn?.addEventListener("click", () => {
      if (confirm("Alle Nachrichten wiederherstellen?")) {
        alleWiederherstellen();
      }
    });

    papierkorbLeerenBtn?.addEventListener("click", () => {
      if (
        confirm(
          "Papierkorb wirklich leeren? Alle gelöschten Nachrichten werden endgueltig entfernt.",
        )
      ) {
        papierkorbLeeren();
      }
    });
  }

  // Gast-Papierkorb
  if (isGuest && !istUserAdmin(aktuellerUserAdmin)) {
    const tabPapierkorb = document.getElementById("tab-papierkorb");
    const pinnwandInhalt = document.getElementById("pinnwand-inhalt");
    const papierkorbInhalt = document.getElementById("papierkorb-inhalt");
    const pinnwandTitel = document.getElementById("pinnwand-titel");

    if (tabPapierkorb) tabPapierkorb.classList.remove("d-none");

    tabPapierkorb?.addEventListener("click", () => {
      const imPapierkorb = !papierkorbInhalt.classList.contains("d-none");

      if (imPapierkorb) {
        pinnwandInhalt.classList.remove("d-none");
        papierkorbInhalt.classList.add("d-none");
        if (pinnwandTitel) pinnwandTitel.textContent = "Pinnwand";
        tabPapierkorb.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Papierkorb';
        tabPapierkorb.classList.replace(
          "btn-secondary",
          "btn-outline-secondary",
        );
      } else {
        pinnwandInhalt.classList.add("d-none");
        papierkorbInhalt.classList.remove("d-none");
        if (pinnwandTitel) pinnwandTitel.textContent = "Papierkorb";
        tabPapierkorb.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Zurück';
        tabPapierkorb.classList.replace(
          "btn-outline-secondary",
          "btn-secondary",
        );
        loadPapierkorbGast();
      }
    });
  }

  // Musik-Player
  const playlist = [
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      title: "Modem Melodie",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "Pixel Party",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      title: "Chatroom Groove",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      title: "CD-Burner Beat",
    },
  ];

  const audio = document.getElementById("global-audio-player");
  const playlistEl = document.getElementById("playlist");
  const playPauseButton = document.getElementById("play-pause-button");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");
  const progressContainer = document.getElementById("audio-progress");
  const progressBar = document.getElementById("audio-progress-bar");
  const progressWrapper = progressContainer
    ? progressContainer.querySelector(".progress-wrapper")
    : null;
  const tooltipEl = document.getElementById("audio-progress-tooltip");
  const progressTime = document.getElementById("audio-time-display");
  const speedDropdown = document.getElementById("speed-dropdown");
  const speedCurrent = document.getElementById("speed-current");
  const speedArrow = document.getElementById("speed-arrow");
  const speedOptions = document.getElementById("speed-options");
  const audioStateKeyPrefix = "audioPlayerState";
  const currentTheme = getSavedTheme();
  let currentIndex = 0;
  let isPlayingState = false;
  let currentlyPlayingScream = false;
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  let currentPlaybackRate =
    parseFloat(localStorage.getItem("audioPlaybackRate")) || 1;

  function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds) || seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  function updateAudioProgress() {
    if (!audio || !progressBar) return;
    if (currentlyPlayingScream) return;
    const duration = audio.duration || 0;
    const currentTime = audio.currentTime || 0;
    const percent = duration ? (currentTime / duration) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", Math.round(percent));
    if (progressTime) {
      progressTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
  }

  function seekAudio(event) {
    if (!audio || !audio.duration) return;
    if (currentlyPlayingScream) return;
    if (event.target.closest && event.target.closest("#speed-select")) return;
    const target = progressWrapper || progressContainer;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percent = Math.min(Math.max(clickPosition / rect.width, 0), 1);
    audio.currentTime = percent * (audio.duration || 0);
    updateAudioProgress();
  }

  // Play/Pause aktualisieren
  function updatePlayPauseButton() {
    if (!playPauseButton) return;
    playPauseButton.innerHTML = isPlayingState
      ? '<i class="fa-solid fa-pause" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-play" aria-hidden="true"></i>';
    playPauseButton.setAttribute(
      "aria-label",
      isPlayingState ? "Pause" : "Play",
    );
  }

  function applyPlaybackRate(rate) {
    currentPlaybackRate = Number(rate) || 1;
    if (audio) audio.playbackRate = currentPlaybackRate;
    if (speedCurrent) speedCurrent.textContent = `${currentPlaybackRate}x`;
    if (speedOptions) {
      speedOptions.querySelectorAll(".audio-speed-option").forEach((option) => {
        const selected = Number(option.dataset.rate) === currentPlaybackRate;
        option.classList.toggle("active", selected);
        option.setAttribute("aria-selected", String(selected));
      });
    }
    try {
      localStorage.setItem("audioPlaybackRate", String(currentPlaybackRate));
    } catch (e) {}
  }

  function incrementPlaybackRate() {
    const currentIndex = playbackRates.indexOf(currentPlaybackRate);
    const nextIndex = (currentIndex + 1) % playbackRates.length;
    applyPlaybackRate(playbackRates[nextIndex]);
  }

  function getAudioStateKey() {
    const user = localStorage.getItem("username") || "Gast";
    return `${audioStateKeyPrefix}_${user}`;
  }

  function loadAudioState() {
    try {
      const key = getAudioStateKey();
      const raw = localStorage.getItem(key);
      if (!raw) return { currentIndex: 0, isPlaying: false };
      return JSON.parse(raw);
    } catch (e) {
      return { currentIndex: 0, isPlaying: false };
    }
  }

  function saveAudioState(isPlaying) {
    const key = getAudioStateKey();
    localStorage.setItem(key, JSON.stringify({ currentIndex, isPlaying }));
  }

  function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = "";

    playlist.forEach((track, index) => {
      const li = document.createElement("li");
      li.className = "mb-1 playlist-item";

      const button = document.createElement("button");
      button.className = "btn btn-secondary playlist-track";
      button.type = "button";
      button.textContent = track.title;
      button.addEventListener("click", () => {
        currentIndex = index;
        playTrack(currentIndex, true);
      });
      li.appendChild(button);
      playlistEl.appendChild(li);
    });
  }

  function updatePlaylistHighlight() {
    document.querySelectorAll("#playlist button").forEach((button, index) => {
      button.classList.toggle("active-track", index === currentIndex);
    });
  }

  function playTrack(index = currentIndex, autoplay = true) {
    if (!audio || !playlist[index]) return;
    currentIndex = index;
    audio.src = playlist[index].src;
    audio.load();
    // Geschwindigkeit anwenden
    audio.playbackRate = currentPlaybackRate;
    updatePlaylistHighlight();
    if (autoplay) {
      audio
        .play()
        .then(() => {
          isPlayingState = true;
          updatePlayPauseButton();
          saveAudioState(true);
        })
        .catch(() => {
          isPlayingState = false;
          updatePlayPauseButton();
          saveAudioState(false);
        });
    } else {
      isPlayingState = false;
      updatePlayPauseButton();
      updateAudioProgress();
    }
  }

  function initCursorTrail(theme) {
    if (theme === "standard") return;
    if (document.body.dataset.cursorTrailInitialized === "true") return;

    const trailRoot = document.createElement("div");
    trailRoot.className = "cursor-trail";
    document.body.appendChild(trailRoot);
    document.body.dataset.cursorTrailInitialized = "true";

    document.addEventListener("mousemove", (event) => {
      const currentTheme = document.body.classList.contains("theme-dark")
        ? "dark"
        : document.body.classList.contains("theme-bunt")
          ? "bunt"
          : "standard";
      if (currentTheme === "standard") return;

      const dot = document.createElement("span");
      dot.className = `trail-dot trail-${currentTheme}`;
      dot.style.left = `${event.clientX - 6}px`;
      dot.style.top = `${event.clientY - 6}px`;
      trailRoot.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    });
  }

  if (playPauseButton) {
    playPauseButton.addEventListener("click", () => {
      if (!audio.src) {
        playTrack(currentIndex, true);
      } else if (isPlayingState) {
        audio.pause();
        isPlayingState = false;
      } else {
        audio.play();
        isPlayingState = true;
      }
      updatePlayPauseButton();
    });
  }

  if (progressWrapper) {
    progressWrapper.addEventListener("click", seekAudio);
  } else if (progressContainer) {
    progressContainer.addEventListener("click", seekAudio);
  }

  if (speedDropdown && speedArrow && speedCurrent && speedOptions) {
    const getOptionButtons = () =>
      Array.from(speedOptions.querySelectorAll(".audio-speed-option"));

    const updateAriaState = (isOpen) => {
      speedArrow.setAttribute("aria-expanded", String(isOpen));
      speedDropdown.classList.toggle("open", isOpen);
    };

    const setOptionTabIndices = (tabIndex) => {
      getOptionButtons().forEach((option) => {
        option.tabIndex = tabIndex;
      });
    };

    const closeSpeedMenu = () => {
      updateAriaState(false);
      setOptionTabIndices(-1);
    };

    const openSpeedMenu = () => {
      if (currentlyPlayingScream) return;
      updateAriaState(true);
      setOptionTabIndices(0);
      const activeOption = getOptionButtons().find(
        (option) => Number(option.dataset.rate) === currentPlaybackRate,
      );
      (activeOption || getOptionButtons()[0])?.focus();
    };

    speedOptions.querySelectorAll(".audio-speed-option").forEach((option) => {
      option.tabIndex = -1;
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        applyPlaybackRate(option.dataset.rate);
        closeSpeedMenu();
        speedArrow.focus();
      });

      option.addEventListener("keydown", (event) => {
        const optionButtons = getOptionButtons();
        const currentIndex = optionButtons.indexOf(option);
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          optionButtons[(currentIndex + 1) % optionButtons.length].focus();
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          optionButtons[
            (currentIndex - 1 + optionButtons.length) % optionButtons.length
          ].focus();
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          option.click();
        } else if (event.key === "Escape") {
          closeSpeedMenu();
          speedArrow.focus();
        }
      });
    });

    speedArrow.addEventListener("click", (event) => {
      event.stopPropagation();
      if (currentlyPlayingScream) return;
      if (speedDropdown.classList.contains("open")) {
        closeSpeedMenu();
      } else {
        openSpeedMenu();
      }
    });

    speedArrow.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        event.stopPropagation();
        if (speedDropdown.classList.contains("open")) {
          closeSpeedMenu();
        } else {
          openSpeedMenu();
        }
      }
    });

    speedCurrent.addEventListener("click", (event) => {
      event.stopPropagation();
      if (currentlyPlayingScream) return;
      incrementPlaybackRate();
    });

    document.addEventListener("click", (event) => {
      if (!speedDropdown.contains(event.target)) {
        closeSpeedMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && speedDropdown.classList.contains("open")) {
        closeSpeedMenu();
        speedArrow.focus();
      }
    });
  }

  if (progressWrapper && tooltipEl) {
    const showTooltip = () => tooltipEl.classList.add("visible");
    const hideTooltip = () => tooltipEl.classList.remove("visible");

    function onProgressMove(e) {
      if (currentlyPlayingScream) {
        tooltipEl.classList.remove("visible");
        return;
      }
      const rect = progressWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const w = rect.width || 1;
      const clampedX = Math.max(0, Math.min(x, w));
      const percent = clampedX / w;
      const duration = audio && audio.duration ? audio.duration : 0;
      const previewSec = percent * duration;
      tooltipEl.textContent = formatTime(previewSec);
      tooltipEl.style.left = `${clampedX}px`;
      showTooltip();
    }

    progressWrapper.addEventListener("mousemove", onProgressMove);
    progressWrapper.addEventListener("mouseenter", onProgressMove);
    progressWrapper.addEventListener("mouseleave", hideTooltip);
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(currentIndex, audio && !audio.paused);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      playTrack(currentIndex, audio && !audio.paused);
    });
  }

  if (audio) {
    const savedState = loadAudioState();
    if (typeof savedState.currentIndex === "number") {
      currentIndex = Math.min(savedState.currentIndex, playlist.length - 1);
    }
    isPlayingState = savedState.isPlaying || false;

    const audioListenersInitialized =
      audio.dataset.listenersInitialized === "true";

    if (!audioListenersInitialized) {
      audio.addEventListener("ended", () => {
        if (currentlyPlayingScream) {
          currentlyPlayingScream = false;
          audio.src = playlist[currentIndex].src;
          audio.load();
          isPlayingState = false;
          updatePlayPauseButton();
          saveAudioState(false);
          if (speedDropdown) {
            speedDropdown.classList.remove("disabled");
            applyPlaybackRate(currentPlaybackRate);
          }
          return;
        }
        currentIndex = (currentIndex + 1) % playlist.length;
        playTrack(currentIndex, true);
      });
      audio.addEventListener("play", () => {
        isPlayingState = true;
        updatePlayPauseButton();
        audio.playbackRate = currentPlaybackRate;
        saveAudioState(true);
      });
      audio.addEventListener("pause", () => {
        isPlayingState = false;
        updatePlayPauseButton();
        saveAudioState(false);
      });
      audio.addEventListener("timeupdate", updateAudioProgress);
      audio.addEventListener("durationchange", updateAudioProgress);
      audio.addEventListener("loadedmetadata", updateAudioProgress);
      audio.dataset.listenersInitialized = "true";
    }

    applyPlaybackRate(currentPlaybackRate);
    if (speedDropdown) {
      if (currentlyPlayingScream) {
        speedDropdown.classList.add("disabled");
      } else {
        speedDropdown.classList.remove("disabled");
      }
    }

    renderPlaylist();
    updatePlaylistHighlight();
    initCursorTrail(currentTheme);

    const aktuellerUser = localStorage.getItem("username") || "Gast";
    const istAdmin = istUserAdmin(aktuellerUser);

    const screamAlreadyPlayed =
      sessionStorage.getItem("screamPlayed") === "true";
    if (!istAdmin && !screamAlreadyPlayed) {
      sessionStorage.setItem("screamPlayed", "true");
      currentlyPlayingScream = true;
      if (speedDropdown) speedDropdown.classList.add("disabled");
      audio.src = "Wilhelm_Scream.ogg";
      audio.load();
      audio
        .play()
        .then(() => {
          isPlayingState = true;
          updatePlayPauseButton();
        })
        .catch(() => {});
    } else {
      playTrack(currentIndex, false);
    }
  }
}

// Pinnwand
let cooldownAktiv = false;
let aktuellSichtbar = 10;
let alleNachrichten = [];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapeMap[match];
  });
}

async function nachrichtSenden() {
  const textInput = document.getElementById("nachricht-text");
  const postBtn = document.getElementById("post-button");
  if (!textInput || !postBtn) return;

  const text = textInput.value.trim();
  if (text === "") {
    alert("Bitte gib eine Nachricht ein, bevor du sie anheften möchtest.");
    return;
  }
  if (cooldownAktiv) {
    alert("Bitte warte kurz, bevor du eine weitere Nachricht sendest.");
    return;
  }

  const aktuellerUser = localStorage.getItem("username") || "Gast";
  const jetzt = new Date();

  const neueNachricht = {
    name: aktuellerUser,
    text: text,
    zeit: jetzt.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: jetzt.getTime(),
  };

  try {
    const { collection, addDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    await addDoc(collection(window.db, "pinnwand"), neueNachricht);
  } catch (e) {
    console.error("Fehler beim Speichern:", e);
    return;
  }

  textInput.value = "";
  cooldownAktiv = true;
  postBtn.disabled = true;
  const originalText = postBtn.textContent;
  postBtn.textContent = "…";

  setTimeout(() => {
    cooldownAktiv = false;
    postBtn.disabled = false;
    postBtn.textContent = originalText;
  }, 1000);

  loadWallMessages(false);
}

async function loadWallMessages(autoScroll = false, ausDatenbankLaden = true) {
  const liste = document.getElementById("nachrichten-liste");
  if (!liste) return;

  liste.className = "list-group p-2 border rounded pinnwand-bg";

  if (ausDatenbankLaden) {
    try {
      const { collection, getDocs, orderBy, query, doc, deleteDoc } =
        await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
      const q = query(
        collection(window.db, "pinnwand"),
        orderBy("timestamp", "asc"),
      );
      const snapshot = await getDocs(q);
      const dreissigTage = 30 * 24 * 60 * 60 * 1000;
      const jetzt = Date.now();

      // überfällige wirklich löschen
      const faellig = snapshot.docs.filter(
        (d) => d.data().deletedAt && jetzt - d.data().deletedAt > dreissigTage,
      );
      faellig.forEach((d) => deleteDoc(doc(window.db, "pinnwand", d.id)));

      // gelöschte rausfiltern
      alleNachrichten = snapshot.docs
        .filter((d) => !d.data().deletedAt)
        .map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error("Fehler beim Laden:", e);
      alleNachrichten = [];
    }
  }

  liste.innerHTML = "";

  if (alleNachrichten.length === 0) {
    liste.innerHTML =
      '<div class="text-muted text-center my-auto pin-empty-message">Keine Nachrichten bisher.</div>';
    renderChatlängensteuerungButtons(0);
    return;
  }

  const reversedNachrichten = [...alleNachrichten].reverse();

  const geladeneNachrichten = reversedNachrichten.slice(0, aktuellSichtbar);

  const aktuellerUser = localStorage.getItem("username") || "Gast";
  const istAdmin = istUserAdmin(aktuellerUser);

  let lastDateString = "";
  let lastAuthor = "";

  geladeneNachrichten.forEach((msg) => {
    const msgDate = new Date(Number(msg.timestamp) || 0);
    const dateString = msgDate.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (dateString !== lastDateString) {
      const separator = document.createElement("div");
      separator.className = "text-center small text-muted my-2 fw-bold";

      const heute = new Date().toLocaleDateString("de-DE");
      const gestern = new Date(Date.now() - 86400000).toLocaleDateString(
        "de-DE",
      );

      if (dateString === heute) separator.textContent = "Heute";
      else if (dateString === gestern) separator.textContent = "Gestern";
      else separator.textContent = dateString;

      liste.appendChild(separator);
      lastDateString = dateString;
      lastAuthor = "";
    }

    const istEigener = msg.name === aktuellerUser;
    const zeigeHeader = msg.name !== lastAuthor;
    lastAuthor = msg.name;

    const item = document.createElement("div");
    item.className = `d-flex flex-column ${
      istEigener ? "align-items-end ms-auto" : "align-items-start me-auto"
    } w-75 mb-2`;

    let headerHtml = "";
    if (zeigeHeader) {
      headerHtml = `<span class="text-muted small fw-bold mb-1 px-1">${
        istEigener ? "Du" : msg.name
      }</span>`;
    }

    const darfLoeschen = istEigener || istAdmin;
    const deleteBtnHtml = darfLoeschen
      ? `<button class="btn btn-sm text-danger border-0 p-0 delete-msg-btn ms-2" data-id="${msg.id}" title="Nachricht löschen" aria-label="Nachricht löschen" style="font-size: 1.1rem; line-height: 1; background: transparent; color: ${
          istEigener ? "#ff8080" : "#dc3545"
        } !important;">&times;</button>`
      : "";

    const sichererText = escapeHTML(msg.text);

    item.innerHTML = `
      ${headerHtml}
      <div class="rounded p-2 px-3 shadow-sm ${
        istEigener ? "bg-primary text-white" : "bg-light text-dark"
      }" style="width: fit-content; max-width: 100%;">
        <div class="d-flex justify-content-between align-items-start gap-3">
          <span class="text-break" style="white-space: pre-wrap;">${sichererText}</span>
          ${deleteBtnHtml}
        </div>
        <div class="text-end text-muted" style="font-size: 0.7em; opacity: 0.8; margin-top: 3px; color: ${
          istEigener ? "#e0e0e0" : "inherit"
        } !important;">
          ${msg.zeit}
        </div>
      </div>
    `;

    liste.appendChild(item);
  });

  liste.querySelectorAll(".delete-msg-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      if (confirm("Möchtest du diese Nachricht wirklich löschen?")) {
        deleteMessage(id);
      }
    });
  });

  renderChatlängensteuerungButtons(alleNachrichten.length);

  if (autoScroll) {
    liste.scrollTop = 0;
  }
}

function renderChatlängensteuerungButtons(totalMessages) {
  const container = document.getElementById("chatlängensteuerung-container");
  if (!container) return;

  container.innerHTML = "";

  if (totalMessages <= 10) {
    return;
  }

  const zeigeWeniger = aktuellSichtbar > 10;
  const zeigeMehr = totalMessages > aktuellSichtbar;
  const ladeChatLaengeNeu = (sichtbareNachrichten) => {
    aktuellSichtbar = sichtbareNachrichten;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    loadWallMessages(false, false);
  };

  const lessBtn = document.createElement("button");
  lessBtn.type = "button";
  lessBtn.className = "btn btn-secondary btn-sm";
  lessBtn.textContent = "Weniger anzeigen";
  lessBtn.addEventListener("mousedown", (e) => e.preventDefault());
  if (!zeigeWeniger) {
    lessBtn.disabled = true;
  } else {
    lessBtn.addEventListener("click", () => {
      ladeChatLaengeNeu(Math.max(10, aktuellSichtbar - 10));
    });
  }
  container.appendChild(lessBtn);

  const moreBtn = document.createElement("button");
  moreBtn.type = "button";
  moreBtn.className = "btn btn-primary btn-sm";
  moreBtn.textContent = "Ältere Nachrichten laden";
  moreBtn.addEventListener("mousedown", (e) => e.preventDefault());
  if (!zeigeMehr) {
    moreBtn.disabled = true;
  } else {
    moreBtn.addEventListener("click", () => {
      ladeChatLaengeNeu(aktuellSichtbar + 10);
    });
  }
  container.appendChild(moreBtn);
}

async function deleteMessage(id) {
  try {
    const { doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    await updateDoc(doc(window.db, "pinnwand", id), {
      deletedAt: Date.now(),
      deletedBy: localStorage.getItem("username") || "Gast",
    });
  } catch (e) {
    console.error("Fehler beim Löschen:", e);
    return;
  }
  loadWallMessages(false);
}

async function clearWall() {
  try {
    const { collection, getDocs, doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    const snapshot = await getDocs(collection(window.db, "pinnwand"));
    const updates = snapshot.docs
      .filter((d) => !d.data().deletedAt)
      .map((d) =>
        updateDoc(doc(window.db, "pinnwand", d.id), {
          deletedAt: Date.now(),
          deletedBy: localStorage.getItem("username") || "Gast",
        }),
      );
    await Promise.all(updates);
  } catch (e) {
    console.error("Fehler beim Leeren:", e);
    return;
  }
  loadWallMessages(false);
}

function getExpiryInfo(deletedAt) {
  const deletedMs = Number(deletedAt);
  const expiryMs = deletedMs + 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const remainingMs = expiryMs - now;
  const expiryDate = new Date(expiryMs).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (remainingMs <= 0) {
    return {
      expiryDate,
      remainingText: "wird bald endgültig gelöscht",
    };
  }

  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
  );
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

  let remainingText;
  if (days > 0) {
    remainingText = `in ${days} Tag${days === 1 ? "" : "en"}`;
  } else if (hours > 0) {
    remainingText = `in ${hours} Stunde${hours === 1 ? "" : "n"}`;
  } else if (minutes > 0) {
    remainingText = `in ${minutes} Minute${minutes === 1 ? "" : "n"}`;
  } else {
    remainingText = "in weniger als einer Stunde";
  }

  return {
    expiryDate,
    remainingText,
  };
}

async function loadPapierkorb() {
  const liste = document.getElementById("papierkorb-liste");
  if (!liste) return;

  liste.innerHTML = "Lädt...\n";

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    const q = query(
      collection(window.db, "pinnwand"),
      orderBy("timestamp", "asc"),
    );
    const snapshot = await getDocs(q);
    const gelöschte = snapshot.docs
      .filter((d) => d.data().deletedAt)
      .map((d) => ({ id: d.id, ...d.data() }));

    liste.innerHTML = "";

    if (gelöschte.length === 0) {
      liste.innerHTML = "Papierkorb ist leer.\n";
      return;
    }

    gelöschte.forEach((msg) => {
      const gelöschtVon = msg.deletedBy || msg.name;
      const gelöschtAm = new Date(msg.deletedAt).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const geschriebenAm = new Date(Number(msg.timestamp)).toLocaleDateString(
        "de-DE",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      const expiryInfo = getExpiryInfo(msg.deletedAt);
      const item = document.createElement("div");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="small text-muted mb-1">
          <strong>${escapeHTML(gelöschtVon)}</strong> hat eine Nachricht von
          <strong>${escapeHTML(msg.name)}</strong> gelöscht am ${gelöschtAm} —
          <span class="text-muted">Wird automatisch gelöscht am ${expiryInfo.expiryDate} (${expiryInfo.remainingText})</span>
        </div>
        <div class="border rounded px-3 py-2 mb-2">
          <span class="text-break">${escapeHTML(msg.text)}</span>
          <span class="text-muted small ms-2 text-nowrap">- ${escapeHTML(
            msg.name,
          )}, ${geschriebenAm}</span>
        </div>
        <div class="d-flex action-buttons gap-2 justify-content-end">
          <button type="button" class="btn btn-sm btn-outline-success wiederherstellen-btn" data-id="${msg.id}" aria-label="Nachricht wiederherstellen" title="Nachricht wiederherstellen">
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger endgueltig-btn" data-id="${msg.id}" aria-label="Nachricht endgültig löschen" title="Nachricht endgültig löschen">
            <i class="fa-solid fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      `;
      liste.appendChild(item);
    });

    liste.querySelectorAll(".wiederherstellen-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        await wiederherstellenMessage(id);
      });
    });

    liste.querySelectorAll(".endgueltig-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (
          confirm(
            "Nachricht endgültig löschen? Das kann nicht rückgängig gemacht werden.",
          )
        ) {
          await endgueltigLoeschen(id);
        }
      });
    });
  } catch (e) {
    console.error("Fehler beim Laden des Papierkorbs:", e);
    liste.innerHTML = "Fehler beim Laden.\n";
  }
}

async function wiederherstellenMessage(id, papierkorbNeuLaden = true) {
  try {
    const { doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    await updateDoc(doc(window.db, "pinnwand", id), { deletedAt: null });
  } catch (e) {
    console.error("Fehler beim Wiederherstellen:", e);
    return;
  }
  if (papierkorbNeuLaden) {
    loadPapierkorb();
  }
  loadWallMessages(false);
}

async function endgueltigLoeschen(id) {
  try {
    const { doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    await deleteDoc(doc(window.db, "pinnwand", id));
  } catch (e) {
    console.error("Fehler beim endgültigen Löschen:", e);
    return;
  }
  loadPapierkorb();
}

async function papierkorbLeeren() {
  try {
    const { collection, getDocs, doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    const snapshot = await getDocs(collection(window.db, "pinnwand"));
    const deletes = snapshot.docs
      .filter((d) => d.data().deletedAt)
      .map((d) => deleteDoc(doc(window.db, "pinnwand", d.id)));
    await Promise.all(deletes);
  } catch (e) {
    console.error("Fehler beim Leeren des Papierkorbs:", e);
    return;
  }
  loadPapierkorb();
}

async function alleWiederherstellen() {
  try {
    const { collection, getDocs, doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    const snapshot = await getDocs(collection(window.db, "pinnwand"));
    const updates = snapshot.docs
      .filter((d) => d.data().deletedAt)
      .map((d) =>
        updateDoc(doc(window.db, "pinnwand", d.id), { deletedAt: null }),
      );
    await Promise.all(updates);
  } catch (e) {
    console.error("Fehler beim Wiederherstellen:", e);
    return;
  }
  loadPapierkorb();
  loadWallMessages(false);
}

async function loadPapierkorbGast() {
  const liste = document.getElementById("papierkorb-liste");
  if (!liste) return;

  liste.innerHTML = '<div class="text-muted text-center my-3">Laedt...</div>';

  const aktuellerUser = localStorage.getItem("username") || "Gast";

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    const q = query(
      collection(window.db, "pinnwand"),
      orderBy("timestamp", "asc"),
    );
    const snapshot = await getDocs(q);
    const gelöschte = snapshot.docs
      .filter((d) => d.data().deletedAt && d.data().name === aktuellerUser)
      .map((d) => ({ id: d.id, ...d.data() }));

    liste.innerHTML = "";

    if (gelöschte.length === 0) {
      liste.innerHTML =
        '<div class="text-muted text-center my-3 pin-empty-message">Dein Papierkorb ist leer.</div>';
      return;
    }

    gelöschte.forEach((msg) => {
      const gelöschtAm = new Date(msg.deletedAt).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const geschriebenAm = new Date(Number(msg.timestamp)).toLocaleDateString(
        "de-DE",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      const expiryInfo = getExpiryInfo(msg.deletedAt);
      const item = document.createElement("div");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="small text-muted mb-1">
          Gelöscht am ${gelöschtAm} —
          <span class="text-muted">Wird automatisch gelöscht am ${expiryInfo.expiryDate} (${expiryInfo.remainingText})</span>
        </div>
        <div class="border rounded px-3 py-2 mb-2">
          <span class="text-break">${escapeHTML(msg.text)}</span>
          <span class="text-muted small ms-2">- ${geschriebenAm}</span>
        </div>
        <div class="d-flex action-buttons gap-2 justify-content-end">
          <button type="button" class="btn btn-sm btn-outline-success wiederherstellen-btn" data-id="${msg.id}" aria-label="Nachricht wiederherstellen" title="Nachricht wiederherstellen">
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
          </button>
        </div>
      `;
      liste.appendChild(item);
    });

    liste.querySelectorAll(".wiederherstellen-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        await wiederherstellenMessage(id, false);
        loadPapierkorbGast();
      });
    });
  } catch (e) {
    console.error("Fehler beim Laden des Gast-Papierkorbs:", e);
    liste.innerHTML =
      '<div class="text-muted text-center my-3">Fehler beim Laden.</div>';
  }
}
