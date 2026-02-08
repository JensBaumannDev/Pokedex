let allPokemonList = [];
let allPokemon = [];
let currentLimit = 20;
let currentPokemon = null;

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  else if (savedTheme === "light") document.body.classList.remove("dark-mode");
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.body.classList.add("dark-mode");
}

function changeTheme() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) localStorage.setItem("theme", "dark");
  else localStorage.setItem("theme", "light");
}

async function loadPokedex() {
  initTheme();
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await response.json();
  allPokemonList = data.results;
  allPokemon = [];
  for (let i = 0; i < currentLimit; i++) {
    const pokemon = allPokemonList[i];
    const details = await fetch(pokemon.url).then((r) => r.json());
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
  for (let i = currentLimit; i < currentLimit + 20; i++) {
    const pokemon = allPokemonList[i];
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
  const search = document.getElementById("searchInput").value.toLowerCase();

  const results = allPokemonList.filter((p) => p.name.includes(search));

  const grid = document.getElementById("pokedex-grid");
  grid.innerHTML = "";

  if (search.length >= 3) {
    if (results.length === 0) {
      grid.innerHTML = `<div class="error-container"><h2>No Pokémon found!</h2></div>`;
    } else {
      for (const pokemon of results.slice(0, 20)) {
        const details = await fetch(pokemon.url).then((r) => r.json());
        if (!allPokemon.find((p) => p.id === details.id)) allPokemon.push(details);
        renderPokemon(details);
      }
    }
  } else {
    for (const pokemon of allPokemon) {
      renderPokemon(pokemon);
    }
  }
}

function openDialog(pokemonId) {
  const selectedPokemon = allPokemon.find((p) => p.id === pokemonId);
  if (!selectedPokemon) return;

  currentPokemon = selectedPokemon;

  document.getElementById("dialogId").innerText = `#${selectedPokemon.id.toString().padStart(3, "0")}`;
  document.getElementById("dialogName").innerText = selectedPokemon.name;

  const typeContainer = document.getElementById("dialogTypes");
  typeContainer.innerHTML = selectedPokemon.types
    .map((typeInfo) => `<p class="card-type ${typeInfo.type.name}">${typeInfo.type.name}</p>`)
    .join("");

  const dialogImage = document.getElementById("dialogImg");
  dialogImage.src = selectedPokemon.sprites.other["official-artwork"].front_default;
  dialogImage.alt = selectedPokemon.name;

  document.getElementById("cardDialog").showModal();

  showAbout();
  initDialogTabs();
}

function closeDialog() {
  document.getElementById("cardDialog").close();
}

function initDialogTabs() {
  const tabButtons = document.querySelectorAll(".dialog-tabs .tab-link");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      const tabName = btn.dataset.tab;
      if (tabName === "about") showAbout();
      else if (tabName === "base-stats") showBaseStats();
      else if (tabName === "evolution") showEvolution();
      else if (tabName === "moves") showMoves();
    });
  });
}

function prevPokemon() {
  if (!currentPokemon) return;
  const idx = allPokemon.findIndex((p) => p.id === currentPokemon.id);
  if (idx === -1) return;
  const prevIdx = (idx - 1 + allPokemon.length) % allPokemon.length;
  openDialog(allPokemon[prevIdx].id);
}

function nextPokemon() {
  if (!currentPokemon) return;
  const idx = allPokemon.findIndex((p) => p.id === currentPokemon.id);
  if (idx === -1) return;
  const nextIdx = (idx + 1) % allPokemon.length;
  openDialog(allPokemon[nextIdx].id);
}

document.getElementById("cardDialog").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeDialog();
});
