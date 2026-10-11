import { fetchLanguages } from "../api/pokeapi.js";
import { languageDisplayNames } from "../i18n/languageNames.js";
import { changeInterfaceLanguage } from "../i18n/index.js";
import { state } from "../state/pokedex.js";
import { escapeHTML } from "./html.js";

const select = document.getElementById("languageSelect");
const trigger = document.getElementById("languageTrigger");
const currentLabel = document.getElementById("languageCurrent");
const menu = document.getElementById("languageMenu");
let onChange = () => {};

function getDisplayName(language) {
  if (languageDisplayNames[language]) return languageDisplayNames[language];
  return new Intl.DisplayNames([navigator.language || "en"], { type: "language" }).of(language) || language;
}

function getBrowserPreferences() {
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

function resolvePreference(preference, available) {
  const normalized = preference.toLowerCase().replaceAll("_", "-");
  if (available.includes(normalized)) return normalized;
  if (normalized.startsWith("zh-")) return resolveChinesePreference(normalized, available);
  const base = normalized.split("-")[0];
  return available.includes(base) ? base : null;
}

function resolveChinesePreference(preference, available) {
  const traditional = /-(tw|hk|mo)(-|$)/.test(preference);
  const language = traditional ? "zh-hant" : "zh-hans";
  return available.includes(language) ? language : null;
}

function getBrowserPreferredLanguage(available) {
  for (const preference of getBrowserPreferences()) {
    const match = resolvePreference(preference, available);
    if (match) return match;
  }
  return null;
}

function getInitialLanguage(languages) {
  const saved = localStorage.getItem("pokemonLanguage")?.toLowerCase();
  if (saved && languages.includes(saved)) return saved;
  return getBrowserPreferredLanguage(languages) || languages.find((code) => code === "en") || languages[0];
}

function createOptionMarkup(option) {
  const value = escapeHTML(option.value);
  const label = escapeHTML(option.textContent);
  return `
    <button type="button" class="language-option" role="option" data-language="${value}" aria-selected="${option.selected}">
      ${label}
    </button>
  `;
}

function renderMenu() {
  currentLabel.textContent = select.selectedOptions[0]?.textContent || "English";
  menu.innerHTML = [...select.options].map(createOptionMarkup).join("");
}

function setAvailableLanguages(languages) {
  state.currentLanguage = getInitialLanguage(languages);
  select.innerHTML = languages.map(createSelectOption).join("");
}

function createSelectOption(language) {
  const selected = language === state.currentLanguage ? " selected" : "";
  return `<option value="${escapeHTML(language)}"${selected}>${escapeHTML(getDisplayName(language))}</option>`;
}

function setFallbackLanguage() {
  state.currentLanguage = "en";
  select.innerHTML = '<option value="en">English</option>';
}

async function populateLanguages() {
  try {
    const { results } = await fetchLanguages();
    setAvailableLanguages(results.map(({ name }) => name.toLowerCase()).sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    console.error("Could not load available languages:", error);
    setFallbackLanguage();
  }
  enablePicker();
}

function enablePicker() {
  select.disabled = false;
  trigger.disabled = false;
  renderMenu();
}

function closeMenu() {
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  menu.hidden = !menu.hidden;
  trigger.setAttribute("aria-expanded", String(!menu.hidden));
}

async function handleLanguageChange() {
  state.currentLanguage = select.value;
  renderMenu();
  closeMenu();
  localStorage.setItem("pokemonLanguage", state.currentLanguage);
  await changeInterfaceLanguage(state.currentLanguage);
  await onChange();
}

function handleMenuClick(event) {
  const option = event.target.closest("[data-language]");
  if (!option) return;
  select.value = option.dataset.language;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function handleDocumentClick(event) {
  if (!event.target.closest(".language-picker")) closeMenu();
}

function handleKeyDown(event) {
  if (event.key !== "Escape" || menu.hidden) return;
  closeMenu();
  trigger.focus();
}

function bindPickerEvents() {
  trigger.addEventListener("click", toggleMenu);
  menu.addEventListener("click", handleMenuClick);
  select.addEventListener("change", handleLanguageChange);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("scroll", closeMenu, { passive: true });
}

export async function initializeLanguagePicker(onLanguageChange) {
  onChange = onLanguageChange;
  await populateLanguages();
  bindPickerEvents();
}
