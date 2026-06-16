// Benutzerverwaltung
function getUsername() {
  return localStorage.getItem("username") || "Gast";
}

function updateUser() {
  const userNames = document.querySelectorAll(".user-name-display");
  userNames.forEach((el) => {
    el.textContent = getUsername();
  });
}

// Logout mit theme-speichern
function logout() {
  const name = localStorage.getItem("username");
  const currentTheme = getSavedTheme();

  if (name) {
    localStorage.setItem("theme_" + name, currentTheme);
  }

  if (
    currentTheme === "bunt" ||
    currentTheme === "pixel" ||
    currentTheme === "dark"
  ) {
    localStorage.setItem("siteTheme", "dark");
  } else {
    localStorage.setItem("siteTheme", "standard");
  }

  sessionStorage.removeItem("screamPlayed");
  localStorage.removeItem("username");
  window.location.href =
    "login.html?loggedOut=" + encodeURIComponent(name || "Gast");
}

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}

function updatePageUrl(page, replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  if (replace) {
    window.history.replaceState({ page }, "", url.toString());
  } else {
    window.history.pushState({ page }, "", url.toString());
  }
}

// Seiten laden
async function zeigePage(seite, event, options = { replaceHistory: false }) {
  if (event) event.preventDefault();

  const inhalt = document.getElementById("inhalt");
  const myspaceStyle = document.getElementById("stylesheet-myspace");
  const lebenslaufStyle = document.getElementById("stylesheet-lebenslauf");

  if (!inhalt) return;

  // Style umschalten
  if (myspaceStyle) myspaceStyle.disabled = seite !== "myspace";
  if (lebenslaufStyle) lebenslaufStyle.disabled = seite !== "lebenslauf";

  try {
    const response = await fetch(`${seite}.html`);
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data, "text/html");

    if (seite === "myspace") {
      const main = doc.querySelector("main");
      const footer = doc.querySelector("footer");

      inhalt.innerHTML =
        (main?.outerHTML || "") + (footer?.outerHTML || "") || data;

      // Script neu laden sonst myspace.js nachladen
      if (typeof initializeMyspace === "function") {
        initializeMyspace();
      } else {
        const oldScript = document.querySelector('script[src^="myspace.js"]');
        if (oldScript) oldScript.remove();

        const script = document.createElement("script");
        script.src = "myspace.js?v=" + Date.now();
        script.onload = () => {
          if (typeof initializeMyspace === "function") initializeMyspace();
        };
        document.body.appendChild(script);
      }
    } else if (seite === "lebenslauf") {
      const main = doc.querySelector(".seite");
      inhalt.innerHTML = main ? main.outerHTML : data;
    }

    localStorage.setItem("aktuelleSeite", seite);
    updatePageUrl(seite, options.replaceHistory);
  } catch (error) {
    console.error(`Fehler beim Laden von ${seite}.html`, error);
  }
}

// Login prüfen
function checkLogin() {
  const usernameRaw = localStorage.getItem("username");
  const username = usernameRaw ? String(usernameRaw).trim() : "";

  if (!username) {
    window.location.href = "login.html";
    return false;
  }

  updateUser();
  return true;
}

window.addEventListener("DOMContentLoaded", () => {
  applyTheme();

  // Navigation
  document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      if (page) zeigePage(page, e);
    });
  });

  // Logout-Links
  document.querySelectorAll(".logout-link-btn").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  });

  if (checkLogin()) {
    const urlPage = getPageFromUrl();
    const letzteSeite =
      urlPage || localStorage.getItem("aktuelleSeite") || "myspace";
    zeigePage(letzteSeite, null, { replaceHistory: true });
  }

  window.addEventListener("popstate", (event) => {
    const page =
      (event.state && event.state.page) || getPageFromUrl() || "myspace";
    zeigePage(page, null, { replaceHistory: true });
  });
});
