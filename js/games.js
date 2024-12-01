// Charger et afficher la liste des jeux
fetch('data/games.json')
    .then(response => response.json())
    .then(data => {
        const games = data.games;
        const gameList = document.getElementById('gameList');

        // Afficher chaque jeu sous forme de carte
        gameList.innerHTML = games.map(game => `
            <div class="game-item">
                <img src="${game.image}" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
            </div>
        `).join('');
    })
    .catch(error => {
        console.error('Erreur lors du chargement des jeux :', error);
    });
