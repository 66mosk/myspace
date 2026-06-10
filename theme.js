// Theme-Funktionen ausgelagert
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

  return "standard";
}

// Theme anwenden
function applyTheme(theme, save = true) {
  const chosen = theme || getSavedTheme();
  document.body.classList.remove("theme-standard", "theme-bunt", "theme-dark");
  document.body.classList.add(themes[chosen] || "theme-standard");
  if (save) {
    localStorage.setItem(themeKey, chosen);
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
