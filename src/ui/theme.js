import { translate } from "../i18n/index.js";

const themeToggle = document.getElementById("themeToggle");

function isDarkMode() {
  return document.body.classList.contains("dark-mode");
}

function updateThemeToggle() {
  const icon = isDarkMode() ? "bi-sun-fill" : "bi-moon-stars-fill";
  themeToggle.innerHTML = `<i class="bi ${icon} theme-icon" aria-hidden="true"></i>`;
  themeToggle.setAttribute("aria-pressed", String(isDarkMode()));
  themeToggle.setAttribute("aria-label", translate("themeToggle"));
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) document.body.classList.add("dark-mode");
}

export function initializeTheme() {
  applySavedTheme();
  updateThemeToggle();
  themeToggle.addEventListener("click", toggleTheme);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDarkMode() ? "dark" : "light");
  updateThemeToggle();
}
