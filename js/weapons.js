fetch('data/weapons.json')
    .then(response => response.json())
    .then(data => {
        const weaponList = document.getElementById('weapon-list');
        data.weapons.forEach(weapon => {
            const weaponItem = document.createElement('div');
            weaponItem.classList.add('weapon');
            weaponItem.innerHTML = `
                <img src="assets/images/${weapon.icon}" alt="${weapon.name}">
                <h2>${weapon.name}</h2>
                <p>Portée: ${weapon.range}m</p>
                <p>Cadence: ${weapon.rate} RPM</p>
            `;
            weaponList.appendChild(weaponItem);
        });
    });