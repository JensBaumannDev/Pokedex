import { fetchPokemonIndex } from "./api/pokeapi.js";
import { localizeApiLabels } from "./i18n/apiContent.js";
import { state } from "./state/pokedex.js";
import { changeInterfaceLanguage, initializeI18n, translate } from "./i18n/index.js";
import { loadNextPage, searchPokemon, getActiveSearch } from "./data/pokemon.js";
import { initializeCardEvents, updateVisiblePokemonNames } from "./ui/cards.js";
import { initializeDialog, openPokemonDialog, refreshDialogLanguage } from "./ui/dialog.js";
import { initializeLanguagePicker } from "./ui/languagePicker.js";
import { applyInterfaceLanguage } from "./ui/interface.js";
import { initializeHeader } from "./ui/header.js";
import { initializeTheme } from "./ui/theme.js";
import { hideLoader } from "./ui/loader.js";

const searchInput = document.getElementById("searchInput");
const grid = document.getElementById("pokedex-grid");

function handleSearchInput() {
  searchPokemon(searchInput.value);
}

async function updateLocalizedContent() {
  updateVisiblePokemonNames();
  await localizeApiLabels(grid, state.currentLanguage);
  refreshDialogLanguage();
  if (getActiveSearch().length >= 3) await searchPokemon(getActiveSearch());
}

async function loadInitialData() {
  const [index] = await Promise.all([fetchPokemonIndex(), initializeLanguagePicker(updateLocalizedContent)]);
  state.pokemonIndex = index.results;
  await changeInterfaceLanguage(state.currentLanguage);
  applyInterfaceLanguage();
  await loadNextPage();
}

function bindApplicationEvents() {
  document.getElementById("load-more-btn").addEventListener("click", loadNextPage);
  searchInput.addEventListener("input", handleSearchInput);
  initializeCardEvents(openPokemonDialog);
}

async function showInitializationError(error) {
  console.error("Pokédex initialization failed:", error);
  grid.innerHTML = `<div class="error-container"><h2>${translate("loadError")}</h2></div>`;
  await hideLoader();
}

export async function startApp() {
  initializeTheme();
  initializeHeader();
  initializeDialog();
  bindApplicationEvents();
  try {
    await initializeI18n("en");
    applyInterfaceLanguage();
    await loadInitialData();
  } catch (error) {
    await showInitializationError(error);
  }
}
