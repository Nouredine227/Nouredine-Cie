fetch("data/images.json")
    .then(response => response.json())
    .then(data => {
        const objects = data.objects;
        const objetsList= document.getElementById("object-list");
        const searchInput = document.getElementById("object-search");
        const filterSelect = document.getElementById("object-filter");

        function displayObjects(filteredObject) {
            objectsList.innerHTML = "";
            filteredWeapons.forEach(object => {
                const objectDiv = document.createElement("div");
                objectDiv.className = "object-item";
                objectDiv.innerHTML = `
                    <img src="assets/icons/${object.icon}" alt="${object.name}" width="360" height="200">
                    <h3>${object}</h3>
                    <p>${object.description}</p>
                    <a href="${object.downloadLink}" target="_blank" class="btn">Télécharger</a>
                `;
                objectList.appendChild(objectDiv);
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
