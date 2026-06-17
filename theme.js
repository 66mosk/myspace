/* ========================================================================
   Theme-Konfiguration
   ======================================================================== */
const themeKey = "siteTheme";
const themes = {
  standard: "theme-standard",
  dark: "theme-dark",
  bunt: "theme-bunt",
  pixel: "theme-bunt",
};

// gespeichertes Theme auslesen
function getSavedTheme() {
  const saved = localStorage.getItem(themeKey);
  if (saved) return saved;

  const sessionTheme = sessionStorage.getItem("loginTheme");
  if (sessionTheme) {
    sessionStorage.removeItem("loginTheme");
    return sessionTheme;
  }
  return "dark";
}

/* ========================================================================
   Theme-Anwendung
   ======================================================================== */
function applyTheme(theme, save = true) {
  const chosen = theme || getSavedTheme();
  document.body.classList.remove("theme-standard", "theme-bunt", "theme-dark");
  document.body.classList.add(themes[chosen] || "theme-standard");
  if (save) {
    localStorage.setItem(themeKey, chosen);

    const currentUsername = localStorage.getItem("username");
    if (currentUsername && window.db && window.dbHelpers) {
      const { doc, setDoc } = window.dbHelpers;
      const userDocRef = doc(window.db, "users", currentUsername);
      setDoc(userDocRef, { theme: chosen }, { merge: true }).catch((err) => {
        console.error("Fehler beim Firestore Theme-Sync:", err);
      });
    }
  }
}

// Dropdown bekommt Theme-Funktion
function initThemeSelect(selectId) {
  const themeSelect = document.getElementById(selectId);
  if (!themeSelect) return;

  themeSelect.value = getSavedTheme();
  themeSelect.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });
}
