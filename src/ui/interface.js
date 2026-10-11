import { state } from "../state/pokedex.js";
import { translate } from "../i18n/index.js";

const byId = (id) => document.getElementById(id);

function getDocumentLanguage() {
  const language = state.currentLanguage;
  if (typeof language !== "string") return "en";
  if (language === "roomaji" || language.startsWith("ja-")) return "ja";
  return language === "es-419" ? "es" : language;
}

function updateIntroText() {
  const message = translate("loadingIntro");
  byId("intro-caption").textContent = message;
  byId("loader").setAttribute("aria-label", message);
}

function updateSearchAndActions() {
  byId("searchInput").placeholder = translate("search");
  byId("load-more-btn").textContent = translate("more");
  byId("load-more-btn").hidden = state.nextOffset >= state.pokemonIndex.length;
}

function updateDialogLabels() {
  document.querySelector(".dialog-eyebrow").textContent = translate("entry");
  document.querySelector(".dialog-tabs").setAttribute("aria-label", translate("details"));
  document.querySelector("[data-dialog-close]").setAttribute("aria-label", translate("closeDetails"));
  byId("dialogPrev").setAttribute("aria-label", translate("previous"));
  byId("dialogNext").setAttribute("aria-label", translate("next"));
  document.querySelectorAll(".dialog-tabs .tab-link").forEach(updateTabLabel);
}

function updateTabLabel(button) {
  button.textContent = translate(button.dataset.translationKey);
}

export function applyInterfaceLanguage() {
  document.documentElement.lang = getDocumentLanguage();
  updateIntroText();
  updateSearchAndActions();
  byId("themeToggle").setAttribute("aria-label", translate("themeToggle"));
  byId("languageSelect").setAttribute("aria-label", translate("chooseLanguage"));
  updateDialogLabels();
}
