document.addEventListener('DOMContentLoaded', () => {
    console.log('Bienvenue sur le site !');

    // Animation d'arrière-plan
    const background = document.getElementById('background');
    setInterval(() => {
        background.style.backgroundPosition = `${Math.random() * 1000}px ${Math.random() * 1000}px`;
    }, 1000);
});