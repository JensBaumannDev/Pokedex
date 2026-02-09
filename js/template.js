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

function getAboutHTML(pokemon) {
  const heightInCm = (pokemon.height * 10).toFixed(0);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  let html = `
    <p><span>Height:</span> ${heightInCm} cm</p>
    <p><span>Weight:</span> ${weightInKg} kg</p>
    <p><span>Types:</span> ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
  `;

  return html;
}

function getBaseStatsHTML(pokemon) {
  let html = "";

  pokemon.stats.forEach((stat) => {
    const maxStat = 100;
    const percent = Math.min((stat.base_stat / maxStat) * 100, 100);
    html += `
      <div class="stat-row">
        <span class="stat-label">${stat.stat.name}</span>
        <span class="stat-value">${stat.base_stat}</span>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });

  return html;
}

function getEvolutionHTML() {
  return "<p>Evolution data not implemented yet.</p>";
}

function getMovesHTML() {
  return "<p>Moves data not implemented yet.</p>";
}
