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

  // 1. Renommer l'icône
  const iconName = `${name.replace(/\s+/g, "_")}.${iconFile.name.split('.').pop()}`; // Nom formaté
  const iconPath = `assets/images/${iconName}`;

  try {
    // 2. Télécharger l'icône sur GitHub
    const iconBase64 = await fileToBase64(iconFile);
    await uploadToGitHub(iconPath, iconBase64);

    // 3. Récupérer le fichier JSON depuis GitHub
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

    // 4. Sauvegarder le fichier JSON mis à jour sur GitHub
    await uploadToGitHub("data/games.json", JSON.stringify(gamesJson, null, 2));

    alert("Le jeu a été ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du jeu :", error);
    alert(`Une erreur s'est produite : ${error.message}`);
  }
}

// Fonction pour convertir un fichier en Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Fonction pour récupérer un fichier JSON depuis GitHub
async function getJsonFromGitHub(path) {
  const url = `https://api.github.com/repos/{Nouredine227}/{Nouredin-Cie}/contents/${path}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${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}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer le fichier JSON.");
  }

  const data = await response.json();
  return JSON.parse(atob(data.content));
}

// Fonction pour télécharger un fichier sur GitHub
async function uploadToGitHub(path, content) {
  const url = `https://api.github.com/repos/{Nouredine227}/{Nouredine-Cie}/contents/${path}`;
  const existingFile = await fetch(url, {
    headers: {
      Authorization: `Bearer ${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}`,
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
      Authorization: `Bearer ${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}`,
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
