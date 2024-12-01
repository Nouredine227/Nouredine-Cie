fetch('./data/games.json')
  .then(response => response.json())
  .then(data => {
    const gamesContainer = document.getElementById('games');
    data.games.forEach(game => {
      const gameElement = `
        <div class="game">
          <img src="./images/${game.icon}" alt="${game.name}">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <a href="${game.link}" target="_blank">Télécharger</a>
        </div>`;
      gamesContainer.innerHTML += gameElement;
    });
  });