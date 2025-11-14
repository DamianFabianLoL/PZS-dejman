
const { STYLE } = require('../../constants');

function errorHTML(title, msg, code = 500) {
  return `<!DOCTYPE html><html><head>${STYLE}</head>
    <body><h1>${title}</h1><p>${msg}</p><a href="/">Powrót</a></body></html>`;
}

function renderGuests(guests) {
  if (!guests.length) return '<p>Lista gości jest pusta.</p>';
  return `<ul>${guests.map(g => `<li>${g.name} (${g.date}, ${g.ip || 'brak IP'}) 
    <form method="POST" action="/delete" style="display:inline">
      <input type="hidden" name="name" value="${g.name}">
      <button type="submit">Usuń</button>
    </form></li>`).join('\n')}</ul>`;
}

function homeHTML(counter) {
  return `<!DOCTYPE html><html><head>${STYLE}</head>
    <body>
    <h1>Witaj na stronie!</h1>
    <p>Odwiedziłeś ją już <b>${counter}</b> razy.</p>
    <a href="/list">Lista gości</a>
    <a href="/stats" style="margin-left: 10px">Statystyki IP</a>
    <a href="/form" style="margin-left: 10px">Dodaj gościa (formularz)</a>
    </body></html>`;
}

function statsHTML(ipStats) {
  return `<!DOCTYPE html><html><head>${STYLE}</head>
    <body><h1>Statystyki adresów IP</h1>
    <ul>${Object.entries(ipStats).map(([ip, n]) => `<li>${ip}: ${n} odwiedzin</li>`).join('')}</ul>
    <a href="/">Powrót</a></body></html>`;
}

function formHTML() {
  return `<!DOCTYPE html><html><head>${STYLE}</head><body>
    <h1>Dodaj gościa</h1>
    <form action="/form" method="POST">
      <label>Imię: <input name="name" type="text" required maxlength="50"></label>
      <button type="submit">Dodaj</button>
    </form>
    <a href="/">Powrót</a>
  </body></html>`;
}
function addGuestHTML(name, date) {
  return `<!DOCTYPE html><html><head>${STYLE}</head><body>
    <p>Dodano: ${name} (${date})</p><a href="/list">Powrót do listy</a></body></html>`;
}

function clearGuestsHTML() {
  return `<!DOCTYPE html><html><head>${STYLE}</head>
    <body><h1>Wyczyszczono listę gości.</h1><a href="/list">Powrót do listy</a></body></html>`;
}

module.exports = { errorHTML, renderGuests, homeHTML, statsHTML, formHTML, addGuestHTML, clearGuestsHTML };