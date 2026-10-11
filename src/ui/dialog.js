import { fetchPokemon } from "../api/pokeapi.js";
import { state, findPokemon, rememberPokemon } from "../state/pokedex.js";
import { localizeApiLabels } from "../i18n/apiContent.js";
import { getTypeIconHTML } from "./templates.js";
import { renderDialogContent, localizeDialogTypes } from "./dialogContent.js";
import { escapeHTML } from "./html.js";

const dialog = document.getElementById("cardDialog");
const typeColors = {
  normal: "#a0a29f", fire: "#ff7055", water: "#55a9f5", electric: "#f0bf35", grass: "#65b96a",
  ice: "#72bfd5", fighting: "#d56b52", poison: "#ad70a0", ground: "#c7a94e", flying: "#8294e8",
  psychic: "#e56e9e", bug: "#9ba943", rock: "#a99a68", ghost: "#7777bd", dragon: "#7869df",
  dark: "#706161", steel: "#9292a5", fairy: "#d888d0",
};

function setDialogIdentity(pokemon) {
  document.getElementById("dialogId").textContent = `#${String(pokemon.id).padStart(3, "0")}`;
  document.getElementById("dialogName").textContent = pokemon.name;
  const image = document.getElementById("dialogImg");
  image.src = pokemon.sprites.other["official-artwork"].front_default;
  image.alt = pokemon.name;
}

function createTypeBadge(type) {
  const name = escapeHTML(type.name);
  return [
    `<p class="card-type ${name}">`,
    getTypeIconHTML(type.name),
    `<span data-resource="type" data-resource-name="${name}">${name}</span>`,
    "</p>",
  ].join("");
}

function setDialogTypes(pokemon) {
  const target = document.getElementById("dialogTypes");
  target.innerHTML = pokemon.types.map(({ type }) => createTypeBadge(type)).join("");
  localizeApiLabels(target, state.currentLanguage);
}

function setPokemonAccent(pokemon) {
  const type = pokemon.types[0].type.name;
  const accent = typeColors[type] || "#7b8da8";
  const hero = document.getElementById("dialogHero");
  hero.style.setProperty("--pokemon-accent", accent);
  hero.style.setProperty("--pokemon-tint", `${accent}2b`);
}

function lockPageScroll() {
  document.documentElement.classList.add("noscroll");
  document.body.classList.add("noscroll");
}

export function openPokemonDialog(pokemonId, tab = "about") {
  const pokemon = findPokemon(pokemonId);
  if (!pokemon) return;
  state.currentPokemon = pokemon;
  state.activeTab = tab;
  setDialogIdentity(pokemon);
  setDialogTypes(pokemon);
  setPokemonAccent(pokemon);
  if (!dialog.open) dialog.showModal();
  lockPageScroll();
  renderActiveTab();
}

function closePokemonDialog() {
  if (dialog.open) dialog.close();
}

function updateTabState(button) {
  const active = button.dataset.tab === state.activeTab;
  button.classList.toggle("active", active);
  button.setAttribute("aria-selected", String(active));
}

function updateTabs() {
  document.querySelectorAll(".dialog-tabs .tab-link").forEach(updateTabState);
}

function renderActiveTab() {
  updateTabs();
  renderDialogContent(state.activeTab);
}

function getNextLoadedPokemon(direction) {
  if (!state.currentPokemon) return null;
  const index = state.pokemon.findIndex((pokemon) => pokemon.id === state.currentPokemon.id);
  return state.pokemon[(index + direction + state.pokemon.length) % state.pokemon.length];
}

async function loadNextPokemon(tab) {
  const current = state.currentPokemon;
  const entry = state.pokemonIndex.find((item) => item.name === current.name);
  if (!entry) return;
  openPokemonDialog(rememberPokemon(await fetchPokemon(entry.url)).id, tab);
}

async function navigatePokemon(direction) {
  const tab = state.activeTab;
  const pokemon = getNextLoadedPokemon(direction);
  if (pokemon) return openPokemonDialog(pokemon.id, tab);
  if (state.currentPokemon) await loadNextPokemon(tab);
}

function handleTabClick(event) {
  const button = event.target.closest(".tab-link");
  if (!button) return;
  state.activeTab = button.dataset.tab;
  renderActiveTab();
}

function handleDialogBackdropClick(event) {
  if (event.target === dialog) dialog.close();
}

function unlockPageScroll() {
  document.documentElement.classList.remove("noscroll");
  document.body.classList.remove("noscroll");
}

function goToPreviousPokemon() {
  navigatePokemon(-1);
}

function goToNextPokemon() {
  navigatePokemon(1);
}

function bindDialogEvents() {
  document.querySelector(".dialog-tabs").addEventListener("click", handleTabClick);
  document.getElementById("dialogPrev").addEventListener("click", goToPreviousPokemon);
  document.getElementById("dialogNext").addEventListener("click", goToNextPokemon);
  dialog.querySelector("[data-dialog-close]").addEventListener("click", closePokemonDialog);
  dialog.addEventListener("click", handleDialogBackdropClick);
  dialog.addEventListener("close", unlockPageScroll);
}

export function initializeDialog() {
  bindDialogEvents();
}

export function refreshDialogLanguage() {
  if (!dialog.open || !state.currentPokemon) return;
  localizeDialogTypes();
  renderActiveTab();
}
