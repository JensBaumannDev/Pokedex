function getPokemonCardHTML(pokemon) {
  const paddedId = pokemon.id.toString().padStart(3, "0");
  const typeHTML = pokemon.types.map((t) => `<p class="card-type ${t.type.name}">${t.type.name}</p>`).join("");
  return `
    <div onclick="openDialog(${pokemon.id})" class="card">
      <div class="card-image-placeholder">
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
      </div>
      <div class="card-info">
        <h2 class="card-name">${pokemon.name}</h2>
        <div class="card-type">${typeHTML}</div>
        <div class="pokemon-number">#${paddedId}</div>
      </div>
    </div>
  `;
}

function renderPokemon(pokemon) {
  document.getElementById("pokedex-grid").innerHTML += getPokemonCardHTML(pokemon);
}

function resetTabs() {
  const tabs = document.querySelectorAll(".tab-link");
  tabs.forEach((tab) => tab.classList.remove("active"));
}

function showAbout() {
  resetTabs();
  document.querySelector(".tab-link[onclick='showAbout()']").classList.add("active");

  const container = document.getElementById("dialogTabContent");
  const heightInCm = (currentPokemon.height * 10).toFixed(0);
  const weightInKg = (currentPokemon.weight / 10).toFixed(1);

  let html = `
    <p><span>Height:</span> ${heightInCm} cm</p>
    <p><span>Weight:</span> ${weightInKg} kg</p>
    <p><span>Types:</span> ${currentPokemon.types.map((t) => t.type.name).join(", ")}</p>
  `;

  fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}`)
    .then((r) => r.json())
    .then((species) => {
      const description = species.flavor_text_entries
        .find((entry) => entry.language.name === "en")
        ?.flavor_text.replace(/\f/g, " ");

      if (description) {
        html += `<p style="margin-top: 15px; font-style: italic;">${description}</p>`;
        container.innerHTML = html;
      }
    })
    .catch(() => {
      container.innerHTML = html;
    });

  container.innerHTML = html;
}

function showBaseStats() {
  resetTabs();
  document.querySelector(".tab-link[onclick='showBaseStats()']").classList.add("active");

  const container = document.getElementById("dialogTabContent");
  container.innerHTML = "";

  currentPokemon.stats.forEach((stat) => {
    const maxStat = 100;
    const percent = Math.min((stat.base_stat / maxStat) * 100, 100);
    const statHTML = `
      <div class="stat-row">
        <span class="stat-label">${stat.stat.name}</span>
        <span class="stat-value">${stat.base_stat}</span>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
    container.innerHTML += statHTML;
  });
}

function showEvolution() {
  resetTabs();
  document.querySelector(".tab-link[onclick='showEvolution()']").classList.add("active");
  document.getElementById("dialogTabContent").innerHTML = "<p>Evolution data not implemented yet.</p>";
}

function showMoves() {
  resetTabs();
  document.querySelector(".tab-link[onclick='showMoves()']").classList.add("active");
  document.getElementById("dialogTabContent").innerHTML = "<p>Moves data not implemented yet.</p>";
}
