fetch("data/games.json")
    .then(response => response.json())
    .then(data => {
        const games = data.games;
        const gameList = document.getElementById("game-list");
        const searchInput = document.getElementById("game-search");
        const platformFilter = document.getElementById("game-platform-filter");

        function displayGames(filteredGames) {
            gameList.innerHTML = "";
            filteredGames.forEach(game => {
                const gameDiv = document.createElement("div");
                gameDiv.className = "game-item";
                gameDiv.innerHTML = `
                    <img src="assets/icons/${game.icon}" alt="${game.name}" width="104" height="142">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <p>Plateforme: ${game.platform}</p>
                    <a href="${game.downloadLink}" target="_blank" class="btn">Télécharger</a>
                `;
                gameList.appendChild(gameDiv);
            });
        }

        function filterGames() {
            const searchTerm = searchInput.value.toLowerCase();
            const platformValue = platformFilter.value;
            const filteredGames = games.filter(game => {
                const matchesSearch = game.name.toLowerCase().includes(searchTerm);
                const matchesFilter = platformValue === "all" || game.platform === platformValue;
                return matchesSearch && matchesFilter;
            });
            displayGames(filteredGames);
        }

        searchInput.addEventListener("input", filterGames);
        platformFilter.addEventListener("change", filterGames);

        displayGames(games);
    })
    .catch(error => console.error("Erreur de chargement des jeux :", error));
