document.getElementById("gameForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const platform = document.getElementById("platform").value.trim();
    const description = document.getElementById("description").value.trim();
    const download_url = document.getElementById("url").value.trim();

    try {
        // Charger la liste actuelle des jeux
        const response = await fetch("data/games.json");
        let games = await response.json();

        // Vérifier si le jeu existe déjà pour la même plateforme
        const existingGame = games.find(game => game.name === name && game.platform === platform);

        if (existingGame) {
            // Si le jeu existe, on met à jour ses informations
            existingGame.description = description;
            existingGame.download_url = download_url;
            document.getElementById("response").innerText = "Jeu mis à jour avec succès !";
        } else {
            // Sinon, on ajoute le nouveau jeu
            games.push({ name, platform, description, download_url });
            document.getElementById("response").innerText = "Jeu ajouté avec succès !";
        }

        // Enregistrer les mises à jour dans le fichier JSON
        await fetch("data/games.json", {
            method: "PUT", // GitHub Pages ne supporte pas PUT, fonctionne uniquement en local ou avec un serveur.
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(games),
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du jeu :", error);
        document.getElementById("response").innerText = "Erreur lors de l'ajout du jeu.";
    }
});
