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

let allPokemonList = [];
let allPokemon = [];
let currentLimit = 20;

async function loadPokedex() {
  initTheme();

  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await response.json();

  allPokemonList = data.results;
  allPokemon = [];

  for (let index = 0; index < currentLimit; index++) {
    const pokemon = allPokemonList[index];

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

  const dialogImage = document.getElementById("dialogImg");
  dialogImage.src = selectedPokemon.sprites.other["official-artwork"].front_default;
  dialogImage.alt = selectedPokemon.name;

  const tabs = document.querySelectorAll(".tab-link");
  const tabContent = document.getElementById("dialogTabContent");

  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      showTabContent(selectedPokemon, tab.dataset.tab);
    };
  });

  showTabContent(selectedPokemon, "base-stats");

  document.getElementById("cardDialog").showModal();
}

function closeDialog() {
  let dialog = document.getElementById("cardDialog");
  dialog.close();
}

function showTabContent(pokemon, tabName) {
  const tabContent = document.getElementById("dialogTabContent");
  if (tabName === "about") {
    tabContent.innerHTML = `
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Types: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
    `;
  } else if (tabName === "base-stats") {
    tabContent.innerHTML = pokemon.stats.map((s) => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("");
  } else if (tabName === "evolution") {
    tabContent.innerHTML = "<p>Evolution data not implemented yet.</p>";
  } else if (tabName === "moves") {
    tabContent.innerHTML = "<p>Moves data not implemented yet.</p>";
  }
}
