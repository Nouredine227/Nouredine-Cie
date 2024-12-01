fetch('./data/weapons.json')
  .then(response => response.json())
  .then(data => {
    const weaponsContainer = document.getElementById('weapons');
    data.weapons.forEach(weapon => {
      const weaponElement = `
        <div class="weapon">
          <img src="./images/${weapon.icon}" alt="${weapon.name}">
          <h3>${weapon.name}</h3>
          <p>Portée : ${weapon.range} mètres</p>
          <p>Cadence de Tir : ${weapon.fireRate}</p>
        </div>`;
      weaponsContainer.innerHTML += weaponElement;
    });
  });