document.getElementById("game-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("game-name").value.trim();
  const platform = document.getElementById("game-platform").value;
  const description = document.getElementById("game-description").value.trim();
  const downloadUrl = document.getElementById("game-download-url").value.trim();
  const icon = document.getElementById("game-icon").files[0];

  // Vérification des champs
  if (!name || !platform || !description || !downloadUrl || !icon) {
    alert("Veuillez remplir tous les champs avant de publier.");
    return;
  }

  // Configuration GitHub
  const GITHUB_REPO = "Nouredine227/Nouredine-Cie";
  const GITHUB_TOKEN = "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";
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/games.json`;

  try {
    // 1. Chargement du fichier JSON existant
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Impossible de charger le fichier JSON.");

    const data = await response.json();
    const games = JSON.parse(atob(data.content)); // Décodage du contenu JSON

    // 2. Vérification des doublons
    const existingGame = games.find(
      (game) => game.name === name && game.platform === platform
    );
    if (existingGame) {
      alert("Un jeu avec le même nom et la même plateforme existe déjà.");
      return;
    }

    // 3. Téléchargement de l'icône
    const iconPath = `assets/images/${name.replace(/\s+/g, "_")}.${icon.name.split(".").pop()}`;
    await uploadFileToGitHub(iconPath, icon, GITHUB_REPO, GITHUB_TOKEN);

    // 4. Ajout du nouveau jeu
    games.push({
      name,
      platform,
      description,
      download_url: downloadUrl,
      icon_url: iconPath,
    });

    const updatedContent = btoa(JSON.stringify(games, null, 2)); // Encodage en base64

    // 5. Mise à jour du fichier JSON
    await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Ajout du jeu ${name}`,
        content: updatedContent,
        sha: data.sha, // SHA du fichier existant
      }),
    });

    alert("Le jeu a été ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    alert("Une erreur s'est produite lors de la publication du jeu.");
  }
});

// Fonction pour télécharger l'icône sur GitHub
async function uploadFileToGitHub(path, file, repo, token) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64File = reader.result.split(",")[1];
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo}/contents/${path}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Ajout de l'icône ${file.name}`,
              content: base64File,
            }),
          }
        );
        if (!response.ok) throw new Error("Échec du téléchargement de l'icône.");
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}
