// Fonction pour ajouter des interactions générales sur le site
document.addEventListener('DOMContentLoaded', () => {
    // Gestion de la navigation active
    const navLinks = document.querySelectorAll('header nav a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Message de bienvenue dans la console
    console.log("Bienvenue sur le site !");
});
