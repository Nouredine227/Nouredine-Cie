const form = document.getElementById("gameForm");
const responseDiv = document.getElementById("response");

// Configurer vos informations GitHub
const githubToken = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN";
const repoOwner = "Nouredine227";
const repoName = "Nouredine-Cie";
const branchName = "main";
const iconsPath = "assets/images/";
const jsonPath = "data/games.json";

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    responseDiv.textContent = "Publication en cours...";

    const formData = new FormData(form);
    const iconFile = formData.get("icon");
    const gameName = formData.get("name");

    try {
        // 1. Uploader l'icône dans le dépôt
        const iconResponse = await uploadToGitHub(
            `${iconsPath}${gameName.replace(/\s+/g, "_")}.${getFileExtension(iconFile.name)}`,
            iconFile
        );

        if (!iconResponse) {
            responseDiv.textContent = "Erreur lors de l'upload de l'icône.";
            return;
        }

        // 2. Ajouter les données du jeu dans le fichier JSON
        const newGame = {
            name: gameName,
            platform: formData.get("platform"),
            description: formData.get("description"),
            download_url: formData.get("url"),
            icon_url: iconResponse.download_url,
        };

        const jsonUpdated = await updateJsonFile(newGame);
        if (jsonUpdated) {
            responseDiv.textContent = "Jeu publié avec succès !";
            form.reset();
        } else {
            responseDiv.textContent = "Erreur lors de la mise à jour du fichier JSON.";
        }
    } catch (error) {
        responseDiv.textContent = `Une erreur s'est produite : ${error.message}`;
    }
});

// Fonction pour uploader un fichier sur GitHub
async function uploadToGitHub(filePath, file) {
    const content = await file.text();
    const base64Content = btoa(content);

    const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${githubToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Ajout de l'icône : ${filePath}`,
                content: base64Content,
                branch: branchName,
            }),
        }
    );

    if (response.ok) {
        return response.json();
    } else {
        console.error("Erreur d'upload GitHub", response.statusText);
        return null;
    }
}

// Fonction pour mettre à jour le fichier JSON
async function updateJsonFile(newGame) {
    const jsonResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${jsonPath}`,
        {
            headers: { Authorization: `token ${githubToken}` },
        }
    );

    if (!jsonResponse.ok) {
        console.error("Erreur lors de la récupération du JSON", jsonResponse.statusText);
        return false;
    }

    const jsonData = await jsonResponse.json();
    const games = JSON.parse(atob(jsonData.content));

    // Vérifiez si le jeu existe déjà
    const existingGame = games.find(
        (game) =>
            game.name.toLowerCase() === newGame.name.toLowerCase() &&
            game.platform === newGame.platform
    );

    if (existingGame) {
        Object.assign(existingGame, newGame); // Mise à jour
    } else {
        games.push(newGame); // Ajout d'un nouveau jeu
    }

    const updatedContent = btoa(JSON.stringify(games, null, 2));

    const updateResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${jsonPath}`,
        {
            method: "PUT",
            headers: {
                Authorization: `token ${githubToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Mise à jour des jeux`,
                content: updatedContent,
                sha: jsonData.sha,
                branch: branchName,
            }),
        }
    );

    return updateResponse.ok;
}

// Obtenir l'extension du fichier
function getFileExtension(filename) {
    return filename.split(".").pop();
}
