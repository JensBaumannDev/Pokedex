import { fetchSpecies } from "../api/pokeapi.js";
import { localizedSpeciesName, localizeApiLabels } from "../i18n/apiContent.js";
import { state } from "../state/pokedex.js";
import { getPokemonCardHTML } from "./templates.js";

const grid = document.getElementById("pokedex-grid");

export function renderPokemonCard(pokemon) {
  grid.insertAdjacentHTML("beforeend", getPokemonCardHTML(pokemon));
  const card = grid.querySelector(`[data-pokemon-id="${pokemon.id}"]`);
  if (state.currentLanguage !== "en") {
    localizeApiLabels(card, state.currentLanguage);
    updatePokemonName(pokemon, state.currentLanguage);
  }
}

export function renderPokemonCards(pokemonList, { clear = true } = {}) {
  if (clear) grid.replaceChildren();
  pokemonList.forEach(renderPokemonCard);
}

export function updateVisiblePokemonNames(pokemonList = state.pokemon) {
  pokemonList.forEach((pokemon) => updatePokemonName(pokemon, state.currentLanguage));
}

function updatePokemonName(pokemon, language) {
  if (language === "en") return setPokemonName(pokemon, pokemon.name);
  fetchSpecies(pokemon.id).then((species) => applyLocalizedName(pokemon, language, species)).catch(ignoreNameError);
}

function applyLocalizedName(pokemon, language, species) {
  if (language !== state.currentLanguage) return;
  setPokemonName(pokemon, localizedSpeciesName(species, language, pokemon.name));
}

function setPokemonName(pokemon, name) {
  const card = grid.querySelector(`[data-pokemon-id="${pokemon.id}"]`);
  if (!card) return;
  card.querySelector(".card-name").textContent = name;
  card.setAttribute("aria-label", name);
  card.querySelector("img").alt = name;
}

function ignoreNameError() {
  return undefined;
}

export function initializeCardEvents(openDialog) {
  grid.addEventListener("click", (event) => handleCardClick(event, openDialog));
  grid.addEventListener("keydown", (event) => handleCardKeydown(event, openDialog));
}

function handleCardClick(event, openDialog) {
  const card = event.target.closest("[data-pokemon-id]");
  if (card) openDialog(Number(card.dataset.pokemonId));
}

function handleCardKeydown(event, openDialog) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-pokemon-id]");
  if (!card) return;
  event.preventDefault();
  openDialog(Number(card.dataset.pokemonId));
}
