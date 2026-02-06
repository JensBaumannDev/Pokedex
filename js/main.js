function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark-mode");
  }
}

function changeTheme() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

let allPokemon = [];
let currentLimit = 20;

async function loadPokedex() {
  initTheme();

  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await response.json();
  allPokemon = [];

  for (let index = 0; index < currentLimit; index++) {
    const pokemon = data.results[index];

    const responseDetail = await fetch(pokemon.url);
    const details = await responseDetail.json();
    allPokemon.push(details);
    renderPokemon(details);
  }
  setTimeout(() => {
    document.getElementById("loader").classList.add("d-none");
    document.body.classList.remove("noscroll");
  }, 1000);
}

async function loadMorePokemon() {
  document.getElementById("loader").classList.remove("d-none");
  document.body.classList.add("noscroll");

  for (let index = currentLimit; index < currentLimit + 20; index++) {
    const pokemon = allPokemonList[index];
    if (!pokemon) break;
    const details = await fetch(pokemon.url).then((r) => r.json());
    allPokemon.push(details);
    renderPokemon(details);
  }

  currentLimit += 20;

  setTimeout(() => {
    document.getElementById("loader").classList.add("d-none");
    document.body.classList.remove("noscroll");
  }, 1000);
}

async function searchPokemon() {
  let search = document.getElementById("searchInput").value.toLowerCase();
  let results = allPokemon.filter((pokemon) => pokemon.name.includes(search));

  if (search.length >= 3) {
    document.getElementById("pokedex-grid").innerHTML = "";

    if (results.length == 0) {
      document.getElementById("pokedex-grid").innerHTML =
        `<div class="error-container"><h2>No Pokémon found!</h2></div>`;
    } else {
      for (let index = 0; index < results.length; index++) {
        const pokemon = results[index];
        const response = await fetch(pokemon.url);
        const details = await response.json();
        renderPokemon(details);
      }
    }
  } else {
    document.getElementById("pokedex-grid").innerHTML = "";
    currentLimit = 20;
    loadPokedex();
  }
}

function openDialog(pokemonId) {
  const selectedPokemon = allPokemon.find((p) => p.id === pokemonId);
  if (!selectedPokemon) return;

  document.getElementById("dialogId").innerText = `#${selectedPokemon.id.toString().padStart(3, "0")}`;
  document.getElementById("dialogName").innerText = selectedPokemon.name;

  const typeContainer = document.getElementById("dialogTypes");
  typeContainer.innerHTML = selectedPokemon.types
    .map((typeInfo) => `<p class="card-type ${typeInfo.type.name}">${typeInfo.type.name}</p>`)
    .join("");

  const dialogImage = document.getElementById("dialogImg");
  dialogImage.src = selectedPokemon.sprites.other["official-artwork"].front_default;
  dialogImage.alt = selectedPokemon.name;

  const imageContainer = document.querySelector(".dialog-image-container");
  imageContainer.className = "dialog-image-container";
  imageContainer.classList.add(selectedPokemon.types[0].type.name);

  const statsContainer = document.getElementById("dialogStats");
  statsContainer.innerHTML = selectedPokemon.stats
    .map((statInfo) => `<p>${statInfo.stat.name}: ${statInfo.base_stat}</p>`)
    .join("");

  document.getElementById("cardDialog").showModal();
}

function closeDialog() {
  let dialog = document.getElementById("cardDialog");
  dialog.close();
}
