// Configuration GitHub - Remplissez une fois ici
const githubConfig = {
  username: "Nouredine227",
  repo: "Nouredine-Cie",
  branch: "main",
  token: "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",
};

async function addGame() {
  const name = document.getElementById("game-name").value.trim();
  const platform = document.getElementById("game-platform").value.trim();
  const description = document.getElementById("game-description").value.trim();
  const downloadUrl = document.getElementById("game-download-url").value.trim();
  const iconFile = document.getElementById("game-icon").files[0];

  if (!name || !platform || !description || !downloadUrl || !iconFile) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    // Étape 1 : Télécharger l'icône
    const iconPath = `assets/icons/${name.replace(/\s+/g, "_")}.${iconFile.name.split('.').pop()}`;
    const iconBase64 = await fileToBase64(iconFile);
    await updateGitHubFile(iconPath, iconBase64);

    // Étape 2 : Ajouter les informations au fichier JSON
    const gamesDataPath = "data/games.json";
    const gamesData = await fetchGitHubFile(gamesDataPath);
    const games = JSON.parse(atob(gamesData.content));

    // Vérifier les doublons
    const existingGame = games.find((g) => g.name === name && g.platform === platform);
    if (existingGame) {
      alert("Ce jeu existe déjà pour cette plateforme !");
      return;
    }

    // Ajouter le nouveau jeu
    games.push({
      name,
      platform,
      description,
      download_url: downloadUrl,
      icon_url: iconPath,
    });

    // Mettre à jour le fichier JSON
    await updateGitHubFile(gamesDataPath, btoa(JSON.stringify(games, null, 2)));

    alert("Jeu ajouté avec succès !");
    location.reload();
  } catch (error) {
    console.error(error);
    alert("Une erreur s'est produite lors de l'ajout du jeu.");
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

async function fetchGitHubFile(path) {
  const response = await fetch(`https://api.github.com/repos/${githubConfig.username}/${githubConfig.repo}/contents/${path}?ref=${githubConfig.branch}`, {
    headers: {
      Authorization: `Bearer ${githubConfig.token}`,
    },
  });
  return response.json();
}

async function updateGitHubFile(path, content) {
  const fileData = await fetchGitHubFile(path).catch(() => null);
  const sha = fileData ? fileData.sha : undefined;

  await fetch(`https://api.github.com/repos/${githubConfig.username}/${githubConfig.repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${githubConfig.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Ajout ou mise à jour du fichier ${path}`,
      content,
      sha,
      branch: githubConfig.branch,
    }),
  });
}
