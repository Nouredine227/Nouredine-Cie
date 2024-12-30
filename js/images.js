fetch("data/images.json")
    .then(response => response.json())
    .then(data => {
        const weapons = data.weapons;
        const weaponList = document.getElementById("weapon-list");
        const searchInput = document.getElementById("weapon-search");
        const filterSelect = document.getElementById("weapon-filter");

        function displayWeapons(filteredWeapons) {
            weaponList.innerHTML = "";
            filteredWeapons.forEach(weapon => {
                const weaponDiv = document.createElement("div");
                weaponDiv.className = "weapon-item";
                weaponDiv.innerHTML = `
                    <img src="assets/icons/${weapon.icon}" alt="${weapon.name}" width="360" height="200">
                    <h3>${weapon.name}</h3>
                    <p>${weapon.description}</p>
                    <a href="${weapon.downloadLink}" target="_blank" class="btn">Télécharger</a>
                `;
                weaponList.appendChild(weaponDiv);
            });
        }

        function filterWeapons() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterValue = filterSelect.value;
            const filteredWeapons = weapons.filter(weapon => {
                const matchesSearch = weapon.name.toLowerCase().includes(searchTerm);
                const matchesFilter = filterValue === "all" || weapon.range === filterValue;
                return matchesSearch && matchesFilter;
            });
            displayWeapons(filteredWeapons);
        }

        searchInput.addEventListener("input", filterWeapons);
        filterSelect.addEventListener("change", filterWeapons);

        displayWeapons(weapons);
    })
    .catch(error => console.error("Erreur de chargement des armes :", error));
