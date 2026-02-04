function getPokemonCardHTML(pokemon) {
  let typeHTML = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    const typeName = pokemon.types[i].type.name;
    typeHTML += `<p class="card-type ${typeName}">${typeName}</p>`;
  }

  return `
        <div class="card">
            <div class="card-image-placeholder">
                <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
            </div>
            <div class="card-info">
                <h2 class="card-name">${pokemon.name}</h2>
                <div class="card-type">${typeHTML}</div>
            </div>
        </div>
    `;
}

function renderPokemon(pokemonDetails) {
  const contentRef = document.getElementById("pokedex-grid");
  contentRef.innerHTML += `${getPokemonCardHTML(pokemonDetails)}`;
}
