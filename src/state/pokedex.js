export const state = {
  pokemonIndex: [],
  pokemon: [],
  pageSize: 20,
  nextOffset: 0,
  currentPokemon: null,
  currentLanguage: localStorage.getItem("pokemonLanguage") || "en",
  activeTab: "about",
};

export function findPokemon(id) {
  return state.pokemon.find((pokemon) => pokemon.id === Number(id));
}

export function rememberPokemon(pokemon) {
  const existingIndex = state.pokemon.findIndex((entry) => entry.id === pokemon.id);
  if (existingIndex === -1) state.pokemon.push(pokemon);
  else state.pokemon[existingIndex] = pokemon;
  return pokemon;
}
