// CSS handles system changes. JS only manages the explicit preference and control.
(() => {
  const root = document.documentElement;
  const select = document.getElementById("theme-select");
  const key = "nook-theme";
  if (!select) return;

  function apply(value) {
    const theme = value === "light" || value === "dark" ? value : "auto";
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.dataset.theme = theme;
    select.value = theme;
  }

  apply(root.dataset.theme);
  select.hidden = false;
  select.addEventListener("change", () => {
    apply(select.value);
    try {
      if (select.value === "auto") localStorage.removeItem(key);
      else localStorage.setItem(key, select.value);
    } catch (_) { /* The selection still works for this page. */ }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      try { apply(localStorage.getItem(key)); } catch (_) { /* Keep in-memory state. */ }
    }
  });
})();
