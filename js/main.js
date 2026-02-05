let currentLimit = 20;

async function loadPokedex() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await response.json();

  for (let index = 0; index < currentLimit; index++) {
    const pokemon = data.results[index];

    const responseDetail = await fetch(pokemon.url);
    const details = await responseDetail.json();

    renderPokemon(details);
  }
}

function changeTheme() {
  document.body.classList.toggle("dark-mode");
}
