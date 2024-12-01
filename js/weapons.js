fetch('data/weapons.json')
    .then(response => response.json())
    .then(data => {
        const weapons = data.weapons;
        const weaponList = document.getElementById('weaponList');

        function displayWeapons(filter = '') {
            const filteredWeapons = weapons.filter(weapon =>
                weapon.name.toLowerCase().includes(filter.toLowerCase())
            );

            weaponList.innerHTML = filteredWeapons.map(weapon => `
                <div class="weapon-item">
                    <h3>${weapon.name}</h3>
                    <p>Portée : ${weapon.range}m</p>
                    <p>Cadence de tir : ${weapon.fireRate}/s</p>
                </div>
            `).join('');
        }

        document.getElementById('searchBar').addEventListener('input', (e) => {
            displayWeapons(e.target.value);
        });

        displayWeapons();
    });
