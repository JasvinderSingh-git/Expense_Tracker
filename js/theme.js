/* ==========================================
   EXPENSE TRACKER
   theme.js
   Theme Manager
========================================== */


/* ==========================================
   CURRENT THEME
========================================== */

let currentTheme = loadSettings().theme || "light";


/* ==========================================
   APPLY THEME
========================================== */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

    } else {

        document.body.classList.remove("dark");

    }

    currentTheme = theme;

    updateThemeIcon();

}


/* ==========================================
   UPDATE ICON
========================================== */

function updateThemeIcon() {

    const button = $("#themeBtn");

    if (!button) return;

    if (currentTheme === "dark") {

        button.innerHTML = '<i class="fa-solid fa-sun"></i>';

    } else {

        button.innerHTML = '<i class="fa-solid fa-moon"></i>';

    }

}


/* ==========================================
   TOGGLE THEME
========================================== */

function toggleTheme() {

    if (currentTheme === "light") {

        currentTheme = "dark";

    } else {

        currentTheme = "light";

    }

    applyTheme(currentTheme);

    updateSetting("theme", currentTheme);

    showToast(

        currentTheme === "dark"

        ? "Dark mode enabled 🌙"

        : "Light mode enabled ☀️"

    );

}


/* ==========================================
   INITIALIZE THEME
========================================== */

function initializeTheme() {

    const settings = loadSettings();

    if (settings.theme === null) {

        useSystemTheme();

    } else {

        currentTheme = settings.theme;

        applyTheme(currentTheme);

    }

}


/* ==========================================
   SYSTEM THEME (Optional)
========================================== */

function useSystemTheme() {

    const prefersDark = window.matchMedia(

        "(prefers-color-scheme: dark)"

    ).matches;

    currentTheme = prefersDark ? "dark" : "light";

    applyTheme(currentTheme);

}


/* ==========================================
   LISTEN FOR SYSTEM CHANGES
========================================== */

window.matchMedia("(prefers-color-scheme: dark)")

.addEventListener("change", function(event) {

    const settings = loadSettings();

    // Only follow system theme if user hasn't chosen manually
    if (!settings.theme) {

        applyTheme(

            event.matches ? "dark" : "light"

        );

    }

});


/* ==========================================
   BUTTON EVENT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    const themeBtn = $("#themeBtn");

    if (themeBtn) {

        themeBtn.addEventListener(

            "click",

            toggleTheme

        );

    }

});