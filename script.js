fetch('levels.json')
  .then(res => res.json())
  .then(levels => {
    const list = document.getElementById('level-list');

    levels.forEach(level => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="name">${level.name}</span>
        <span class="info">
          Created by ${level.creator}<br>
          Submitted by ${level.submitter}
        </span>
      `;
      list.appendChild(li);
    });
  });
