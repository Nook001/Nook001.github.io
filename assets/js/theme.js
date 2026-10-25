// Follow the system until the visitor uses the one-click light/dark toggle.
(() => {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const key = "nook-theme";
  if (!button) return;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference;

  function isDark() {
    return preference === "dark" || (preference === "auto" && system.matches);
  }

  function updateButton() {
    const dark = isDark();
    button.setAttribute("aria-pressed", String(dark));
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }

  function apply(value) {
    preference = value === "light" || value === "dark" ? value : "auto";
    if (preference === "auto") root.removeAttribute("data-theme");
    else root.dataset.theme = preference;
    updateButton();
  }

  apply(root.dataset.theme);
  button.hidden = false;
  button.addEventListener("click", () => {
    apply(isDark() ? "light" : "dark");
    try {
      localStorage.setItem(key, preference);
    } catch (_) { /* The toggle still works for this page. */ }
  });

  // CSS updates the palette; keep the icon and accessible state in sync too.
  if (system.addEventListener) system.addEventListener("change", updateButton);
  else system.addListener(updateButton);

  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      try { apply(localStorage.getItem(key)); } catch (_) { /* Keep in-memory state. */ }
    }
  });
})();
