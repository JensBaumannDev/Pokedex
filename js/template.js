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

function getEvolutionHTML(pokemon) {
  return "<p>Evolution data not implemented yet.</p>";
}

function getMovesHTML(pokemon) {
  if (!pokemon.moves || pokemon.moves.length === 0) {
    return "<p>No moves available.</p>";
  }

  const levelUpMoves = pokemon.moves
    .filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === "level-up" && detail.level_learned_at > 0,
      ),
    )
    .sort((a, b) => {
      const aLevel =
        a.version_group_details.find((d) => d.move_learn_method.name === "level-up")?.level_learned_at || 999;
      const bLevel =
        b.version_group_details.find((d) => d.move_learn_method.name === "level-up")?.level_learned_at || 999;
      return aLevel - bLevel;
    })
    .slice(0, 8);

  if (levelUpMoves.length === 0) {
    return "<p>No moves available.</p>";
  }

  let html = "<div style='display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;'>";

  levelUpMoves.forEach((move) => {
    const level = move.version_group_details.find((d) => d.move_learn_method.name === "level-up")?.level_learned_at;
    html += `
      <span style='background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); padding: 6px 12px; border-radius: 16px; font-size: 13px; text-transform: capitalize;' title='Level ${level}'>
        ${move.move.name}
      </span>
    `;
  });

  html += "</div>";

  return html;
}
