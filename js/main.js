//#region THEME TOGGLE
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
//#endregion

let allPokemon = [];
let currentLimit = 20;

async function loadPokedex() {
  initTheme();

  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  const data = await response.json();
  allPokemon = data.results;

  for (let index = 0; index < currentLimit; index++) {
    const pokemon = data.results[index];

    const responseDetail = await fetch(pokemon.url);
    const details = await responseDetail.json();

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
    const pokemon = allPokemon[index];
    const response = await fetch(pokemon.url);
    const details = await response.json();
    renderPokemon(details);
  }
  currentLimit += 20;

  setTimeout(() => {
    document.getElementById("loader").classList.add("d-none");
    document.body.classList.remove("noscroll");
  }, 1000);
}
