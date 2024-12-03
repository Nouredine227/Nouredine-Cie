fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
        const gameList = document.getElementById('game-list');
        data.games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.classList.add('game');
            gameItem.innerHTML = `
                <img src="assets/images/${game.icon}" alt="${game.name}">
                <h2>${game.name}</h2>
                <p>${game.description}</p>
                <a href="${game.downloadLink}" class="button" download>Télécharger</a>
            `;
            gameList.appendChild(gameItem);
        });
    });
