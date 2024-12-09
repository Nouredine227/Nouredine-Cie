document.addEventListener('DOMContentLoaded', async () => {
    const orgContainer = document.getElementById('organization-info');
    const dataUrl = 'https://example.com/organizations.json'; // URL du fichier JSON contenant les données

    try {
        // Chargement des données
        const response = await fetch(dataUrl);
        const organizations = await response.json();

        // Génération du contenu pour chaque organisation
        organizations.forEach(org => {
            const section = document.createElement('section');
            section.className = 'organization';

            section.innerHTML = `
                <h2>${org.name}</h2>
                <img src="${org.image_url}" alt="Logo ${org.name}" class="organization-logo">
                <details>
                    <summary>Voir plus de détails</summary>
                    <p>${org.description}</p>
                    <ul>
                        ${org.highlights.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    ${org.donation_url ? `<a href="${org.donation_url}" class="donation-link">Faire un don</a>` : ''}
                </details>
            `;

            orgContainer.appendChild(section);
        });
    } catch (error) {
        orgContainer.innerHTML = `<p class="error">Impossible de charger les informations pour le moment.</p>`;
        console.error('Erreur lors du chargement des informations:', error);
    }
});
