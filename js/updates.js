fetch('data/updates.json')
    .then(response => response.json())
    .then(data => {
        const updateLog = document.getElementById('updateLog');
        updateLog.innerHTML = data.updates.map(update => `
            <li>${update.date}: ${update.description}</li>
        `).join('');
    });
