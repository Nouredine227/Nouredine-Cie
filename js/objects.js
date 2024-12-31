fetch("data/objects.json")
    .then(response => response.json())
    .then(data => {
        const objects = data.objects;
        const objectsList= document.getElementById("object-list");
        const searchInput = document.getElementById("object-search");
        const filterSelect = document.getElementById("object-filter");

        function displayObjects(filteredObject) {
            objectsList.innerHTML = "";
            filteredObjects.forEach(object => {
                const objectDiv = document.createElement("div");
                objectDiv.className = "object-item";
                objectDiv.innerHTML = `
                    <img src="assets/icons/${object.icon}" alt="${object.name}" width="360" height="200">
                    <h3>${object}</h3>
                    <p>${object.description}</p>
                    <a href="${object.downloadLink}" target="_blank" class="btn">Télécharger</a>
                `;
                objectsList.appendChild(objectDiv);
            });
        }
        
        function filterObjects() {
            const searchTerm = searchInput.value.toLowerCase();
            const filterValue = filterSelect.value;
            const filteredObjects = objects.filter(object => {
                const matchesSearch = object.name.toLowerCase().includes(searchTerm);
                const matchesFilter = filterValue === "all" || object.filter === filterValue;
                return matchesSearch && matchesFilter;
            });
            displayObjects(filteredObjects);
        }

        searchInput.addEventListener("input", filterObjects);
        filterSelect.addEventListener("change", filterObjects);

        displayObjects(objects);
    })
    .catch(error => console.error("Erreur de chargement des Items :", error));
