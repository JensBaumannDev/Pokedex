import { translate } from "../i18n/index.js";
import { escapeHTML } from "./html.js";

const typeIcons = {
  normal: "bi-circle-fill", fire: "bi-fire", water: "bi-droplet-fill", electric: "bi-lightning-charge-fill",
  grass: "bi-flower1", ice: "bi-snow", fighting: "bi-hand-thumbs-up-fill", poison: "bi-radioactive",
  ground: "bi-triangle-fill", flying: "bi-wind", psychic: "bi-eye-fill", bug: "bi-bug-fill",
  rock: "bi-gem", ghost: "bi-cloud-fog2-fill", dragon: "bi-stars", dark: "bi-moon-stars-fill",
  steel: "bi-shield-fill", fairy: "bi-magic",
};

export function getTypeIconHTML(typeName) {
  const icon = typeIcons[typeName];
  return icon ? `<i class="bi ${icon} type-badge-icon" aria-hidden="true"></i>` : "";
}

function getTypeLabelHTML(type) {
  const name = escapeHTML(type.name);
  return [
    `<p class="card-type ${name}">`,
    getTypeIconHTML(type.name),
    `<span data-resource="type" data-resource-name="${name}">${name}</span>`,
    "</p>",
  ].join("");
}

export function getPokemonCardHTML(pokemon) {
  const id = String(pokemon.id).padStart(3, "0");
  const name = escapeHTML(pokemon.name);
  const types = pokemon.types.map(({ type }) => getTypeLabelHTML(type)).join("");
  return [
    `<article class="card" data-pokemon-id="${pokemon.id}" role="button" tabindex="0" aria-label="${name}">`,
    getCardImageHTML(pokemon), getCardInfoHTML(pokemon, id, types), "</article>",
  ].join("");
}

function getCardImageHTML(pokemon) {
  const artwork = pokemon.sprites.other["official-artwork"].front_default;
  return `<div class="card-image-placeholder"><img src="${escapeHTML(artwork)}" alt="${escapeHTML(pokemon.name)}" loading="lazy" decoding="async"></div>`;
}

function getCardInfoHTML(pokemon, id, types) {
  const name = escapeHTML(pokemon.name);
  return [
    '<div class="card-info">', `<h2 class="card-name">${name}</h2>`,
    `<div class="card-type">${types}</div>`, `<div class="pokemon-number">#${id}</div>`, "</div>",
  ].join("");
}

function getAboutTypeHTML(type) {
  const name = escapeHTML(type.name);
  return [
    `<span class="inline-type ${name}">`,
    getTypeIconHTML(type.name),
    `<span data-resource="type" data-resource-name="${name}">${name}</span>`,
    "</span>",
  ].join("");
}

export function getAboutHTML(pokemon) {
  const height = (pokemon.height * 10).toFixed(0);
  const weight = (pokemon.weight / 10).toFixed(1);
  const types = pokemon.types.map(({ type }) => getAboutTypeHTML(type)).join(" ");
  return [
    `<p><span>${translate("height")}:</span> ${height} cm</p>`,
    `<p><span>${translate("weight")}:</span> ${weight} kg</p>`,
    `<p><span>${translate("types")}:</span> ${types}</p>`,
  ].join("");
}

function getStatRowHTML(stat) {
  const percent = Math.min(stat.base_stat, 100);
  const name = escapeHTML(stat.stat.name);
  return [
    '<div class="stat-row">',
    `<span class="stat-label" data-resource="stat" data-resource-name="${name}">${name}</span>`,
    `<span class="stat-value">${stat.base_stat}</span>`,
    `<div class="stat-bar-container"><div class="stat-bar" style="width:${percent}%"></div></div>`,
    "</div>",
  ].join("");
}

export function getBaseStatsHTML(pokemon) {
  return pokemon.stats.map(getStatRowHTML).join("");
}

function getEvolutionItemHTML(evolution) {
  const name = escapeHTML(evolution.name);
  return [
    '<div class="evolution-item">',
    `<div class="evolution-image-container"><img src="${escapeHTML(evolution.image)}" alt="${name}"></div>`,
    `<p class="evolution-name" data-resource="pokemon-species" data-resource-name="${escapeHTML(evolution.id)}" `,
    `data-resource-fallback="${name}">${name}</p>`,
    "</div>",
  ].join("");
}

function getEvolutionArrowHTML() {
  return '<div class="evolution-arrow" aria-hidden="true"><span>➔</span></div>';
}

function getEvolutionStepHTML(evolution, index) {
  const arrow = index > 0 ? getEvolutionArrowHTML() : "";
  return `${arrow}${getEvolutionItemHTML(evolution)}`;
}

export function getEvolutionHTML(evolutions) {
  if (!evolutions?.length) return `<p>${translate("noEvolution")}</p>`;
  const steps = evolutions.map(getEvolutionStepHTML).join("");
  return `<div class="evolution-chain">${steps}</div>`;
}

function isLevelUpMove(move) {
  return move.version_group_details.some(isLearnedByLevel);
}

function isLearnedByLevel(detail) {
  return detail.move_learn_method.name === "level-up" && detail.level_learned_at > 0;
}

function getLevel(move) {
  return move.version_group_details.find(isLearnedByLevel)?.level_learned_at || 999;
}

function compareMoves(first, second) {
  return getLevel(first) - getLevel(second);
}

function getLevelUpMoves(pokemon) {
  return pokemon.moves.filter(isLevelUpMove).sort(compareMoves).slice(0, 8);
}

function getMoveChipHTML(move) {
  const level = getLevel(move);
  const name = escapeHTML(move.move.name);
  return [
    `<span class="move-chip" title="${translate("learnedAtLevel", { level })}">`,
    `<span class="move-name" data-resource="move" data-resource-name="${name}">${name}</span>`,
    `<span class="move-level">Lv. ${level}</span>`, "</span>",
  ].join("");
}

export function getMovesHTML(pokemon) {
  const moves = getLevelUpMoves(pokemon);
  if (!moves.length) return `<p>${translate("noMoves")}</p>`;
  return `<div class="moves-list">${moves.map(getMoveChipHTML).join("")}</div>`;
}
