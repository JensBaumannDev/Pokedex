import { fetchPokemon } from "../api/pokeapi.js";
import { state, rememberPokemon } from "../state/pokedex.js";
import { translate } from "../i18n/index.js";
import { hideLoader, showLoader } from "../ui/loader.js";
import { renderPokemonCard, renderPokemonCards } from "../ui/cards.js";

const grid = document.getElementById("pokedex-grid");
const loadMoreButton = document.getElementById("load-more-btn");
let loadingMore = false;
let activeQuery = "";
let initialLoaderDismissed = false;
let searchSequence = 0;
let searchController;

function hasMorePokemon() {
  return state.nextOffset < state.pokemonIndex.length;
}

function updateLoadMoreButton() {
  loadMoreButton.hidden = !hasMorePokemon();
  loadMoreButton.disabled = loadingMore;
}

function beginPageLoad() {
  loadingMore = true;
  loadMoreButton.disabled = true;
  if (state.pokemon.length === 0) showLoader();
}

function getNextPage() {
  const page = state.pokemonIndex.slice(state.nextOffset, state.nextOffset + state.pageSize);
  state.nextOffset += page.length;
  return page;
}

async function loadPageEntry({ url }) {
  try {
    const pokemon = rememberPokemon(await fetchPokemon(url));
    renderPokemonCard(pokemon);
    await dismissInitialLoader();
    return true;
  } catch (error) {
    console.error("Could not load a Pokémon:", error);
    return false;
  }
}

async function dismissInitialLoader() {
  if (initialLoaderDismissed || !state.pokemon.length) return;
  initialLoaderDismissed = true;
  await hideLoader();
}

function renderLoadError() {
  grid.innerHTML = `<div class="error-container" role="alert"><h2>${translate("loadError")}</h2></div>`;
}

async function fetchPage(page) {
  const results = await Promise.all(page.map(loadPageEntry));
  if (!state.pokemon.length && results.every((loaded) => !loaded)) renderLoadError();
}

async function finishPageLoad() {
  loadingMore = false;
  updateLoadMoreButton();
  if (!state.pokemon.length) await hideLoader();
}

export async function loadNextPage() {
  if (loadingMore || !hasMorePokemon()) return;
  beginPageLoad();
  try {
    await fetchPage(getNextPage());
  } finally {
    await finishPageLoad();
  }
}

function renderNoSearchResults() {
  grid.innerHTML = `<div class="error-container"><h2>${translate("noResults")}</h2></div>`;
}

function getSearchMatches(query) {
  return state.pokemonIndex.filter(({ name }) => name.startsWith(query)).slice(0, 20);
}

async function loadSearchMatches(matches, query, signal) {
  try {
    const pokemon = await Promise.all(matches.map(({ url }) => fetchPokemon(url, signal)));
    if (activeQuery !== query) return;
    pokemon.forEach(rememberPokemon);
    renderPokemonCards(pokemon);
  } catch (error) {
    if (error.name !== "AbortError") console.error("Could not search Pokémon:", error);
  }
}

async function runSearch(query, signal) {
  grid.replaceChildren();
  if (query.length < 3) return renderPokemonCards(state.pokemon);
  const matches = getSearchMatches(query);
  if (!matches.length) return renderNoSearchResults();
  await loadSearchMatches(matches, query, signal);
}

function waitForSearchPause() {
  return new Promise((resolve) => window.setTimeout(resolve, 250));
}

function abortPreviousSearch() {
  searchController?.abort();
  searchController = new AbortController();
  return searchController.signal;
}

export function getActiveSearch() {
  return activeQuery;
}

export async function searchPokemon(query) {
  activeQuery = query.trim().toLowerCase();
  const sequence = ++searchSequence;
  const signal = abortPreviousSearch();
  await waitForSearchPause();
  if (sequence !== searchSequence) return;
  return runSearch(activeQuery, signal);
}
