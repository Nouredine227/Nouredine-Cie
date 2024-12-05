// Gestion du mode sombre/clair
const toggleThemeButton = document.querySelector(".toggle-theme");
toggleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
});

// Charger le thème choisi
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});
