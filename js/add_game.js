// Configuration GitHub (à modifier une seule fois)
const GITHUB_USERNAME = "Nouredine227";
const GITHUB_REPO = "Nouredine-Cie";
const GITHUB_TOKEN = "your_github_token";

// URL API GitHub (base)
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/`;

async function addGame() {
  const name = document.getElementById("game-name").value.trim();
  const platform = document.getElementById("game-platform").value.trim();
  const description = document.getElementById("game-description").value.trim();
  const downloadUrl = document.getElementById("game-download-url").value.trim();
  const iconFile = document.getElementById("game-icon").files[0];

  if (!name || !platform || !description || !downloadUrl || !iconFile) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // Renommer l'icône
  const iconName = `${name.replace(/\s+/g, "_")}.${iconFile.name.split('.').pop()}`; // Nom formaté
  const iconPath = `assets/images/${iconName}`;

  try {
    // Télécharger l'icône sur GitHub
    const iconBase64 = await fileToBase64(iconFile);
    await uploadToGitHub(iconPath, iconBase64);

    // Récupérer le fichier JSON
    const gamesJson = await getJsonFromGitHub("data/games.json");
    const existingGame = gamesJson.find(
      (game) => game.name === name && game.platform === platform
    );

    if (existingGame) {
      // Mise à jour du jeu existant
      existingGame.description = description;
      existingGame.download_url = downloadUrl;
      existingGame.icon_url = iconPath;
    } else {
      // Ajouter un nouveau jeu
      gamesJson.push({
        name,
        platform,
        description,
        download_url: downloadUrl,
        icon_url: iconPath,
      });
    }

    // Sauvegarder le fichier JSON mis à jour sur GitHub
    await uploadToGitHub("data/games.json", JSON.stringify(gamesJson, null, 2));

    alert("Le jeu a été ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du jeu :", error);
    alert(`Une erreur s'est produite : ${error.message}`);
  }
}

// Convertir un fichier en Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Récupérer un fichier JSON depuis GitHub
async function getJsonFromGitHub(path) {
  const url = `${GITHUB_API_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer le fichier JSON.");
  }

  const data = await response.json();
  return JSON.parse(atob(data.content));
}

// Télécharger un fichier sur GitHub
async function uploadToGitHub(path, content) {
  const url = `${GITHUB_API_URL}${path}`;
  const existingFile = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  let sha = null;
  if (existingFile.ok) {
    const fileData = await existingFile.json();
    sha = fileData.sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add or update ${path}`,
      content: btoa(content),
      sha: sha || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Impossible de télécharger le fichier sur GitHub.");
  }
}
