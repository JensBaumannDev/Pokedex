import { fetchSpecies, fetchPokemon } from "../api/pokeapi.js";
import { localizedSpeciesName, localizeApiLabels } from "../i18n/apiContent.js";
import { state } from "../state/pokedex.js";
import { translate } from "../i18n/index.js";
import { getAboutHTML, getBaseStatsHTML, getEvolutionHTML, getMovesHTML } from "./templates.js";

const content = document.getElementById("dialogTabContent");

function getApiLanguage(language) {
  return language === "roomaji" ? "ja-roma" : language.toLowerCase();
}

function getSpeciesDescription(species, language) {
  return species.flavor_text_entries.find((entry) => entry.language.name.toLowerCase() === language)
    ?.flavor_text.replace(/[\f\n]/g, " ");
}

function createDescription(text) {
  const paragraph = document.createElement("p");
  paragraph.className = "pokemon-description";
  paragraph.textContent = text;
  return paragraph;
}

function isCurrentAbout(pokemon, language) {
  return pokemon === state.currentPokemon && language === state.currentLanguage && state.activeTab === "about";
}

function updateSpeciesName(species, pokemon, language) {
  const name = localizedSpeciesName(species, language, pokemon.name);
  document.getElementById("dialogName").textContent = name;
  document.getElementById("dialogImg").alt = name;
}

function appendDescription(description) {
  const text = description || translate("noDescription");
  content.append(createDescription(text));
}

async function fetchAboutDetails(pokemon, language) {
  const species = await fetchSpecies(pokemon.id);
  if (!isCurrentAbout(pokemon, language)) return;
  updateSpeciesName(species, pokemon, language);
  appendDescription(getSpeciesDescription(species, getApiLanguage(language)));
}

function appendAboutFallback(pokemon, language) {
  if (isCurrentAbout(pokemon, language)) appendDescription("");
}

async function renderAbout() {
  const pokemon = state.currentPokemon;
  const language = state.currentLanguage;
  if (!pokemon) return;
  content.innerHTML = getAboutHTML(pokemon);
  localizeApiLabels(content, language);
  try {
    await fetchAboutDetails(pokemon, language);
  } catch {
    appendAboutFallback(pokemon, language);
  }
  localizeApiLabels(content, language);
}

function renderStats() {
  content.innerHTML = getBaseStatsHTML(state.currentPokemon);
  localizeApiLabels(content, state.currentLanguage);
}

function createEvolutionEntry(node) {
  const id = node.species.url.split("/").filter(Boolean).pop();
  return { id, name: node.species.name, image: getEvolutionArtwork(id) };
}

function getEvolutionArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function collectEvolutions(chain) {
  const evolutions = [];
  let current = chain.chain;
  while (current) {
    evolutions.push(createEvolutionEntry(current));
    current = current.evolves_to[0];
  }
  return evolutions;
}

async function fetchEvolutions(pokemon) {
  const species = await fetchSpecies(pokemon.id);
  const chain = await fetchPokemon(species.evolution_chain.url);
  return collectEvolutions(chain);
}

function isCurrentEvolution(pokemon) {
  return pokemon === state.currentPokemon && state.activeTab === "evolution";
}

function renderEvolutionError(pokemon) {
  if (isCurrentEvolution(pokemon)) content.innerHTML = `<p>${translate("evolutionError")}</p>`;
}

async function renderEvolution() {
  const pokemon = state.currentPokemon;
  content.innerHTML = `<div class="spinner" role="status" aria-label="${translate("loading")}"></div>`;
  try {
    const evolutions = await fetchEvolutions(pokemon);
    if (!isCurrentEvolution(pokemon)) return;
    content.innerHTML = getEvolutionHTML(evolutions);
    localizeApiLabels(content, state.currentLanguage);
  } catch {
    renderEvolutionError(pokemon);
  }
}

function renderMoves() {
  content.innerHTML = getMovesHTML(state.currentPokemon);
  localizeApiLabels(content, state.currentLanguage);
}

export function renderDialogContent(tab) {
  const renderers = {
    about: renderAbout,
    "base-stats": renderStats,
    evolution: renderEvolution,
    moves: renderMoves,
  };
  return (renderers[tab] || renderAbout)();
}

export function localizeDialogTypes() {
  localizeApiLabels(document.getElementById("dialogTypes"), state.currentLanguage);
}
