
const { parseJSONFile, saveJSONFile, readCounter, saveJSONFile } = require('../utils/fileHandler');
const { logAccess } = require('../utils/logger');
const { validateName } = require('../utils/validator');
const { errorHTML, renderGuests, homeHTML, addGuestHTML, clearGuestsHTML, formHTML } = require('../src/views/htmlRenderer');
const { GUESTS_FILE, COUNTER_FILE, IP_STATS_FILE } = require('../../constants');

let counter = readCounter(COUNTER_FILE);
let ipStats = readIpStats(IP_STATS_FILE);

function saveStats() {
  saveJSONFile(COUNTER_FILE, { all: counter });
  saveJSONFile(IP_STATS_FILE, ipStats);
}

function handleGuestRoutes(req, res, url, ip) {
  let statusCode = 200;

  if (req.method === 'GET' && url.pathname === '/') {
    counter++;
    ipStats[ip] = (ipStats[ip] || 0) + 1;
    saveStats();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(homeHTML(counter));
    logAccess(ip, url.pathname, 200);
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/add') {
    const name = url.searchParams.get('name');
    if (!validateName(name)) {
      statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(errorHTML('Błąd', 'Nieprawidłowe imię'));
      logAccess(ip, url.pathname, 400);
      return true;
    }
    try {
      const guests = parseJSONFile(GUESTS_FILE);
      const now = new Date().toLocaleString();
      guests.push({ name, date: now, ip });
      saveJSONFile(GUESTS_FILE, guests);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(addGuestHTML(name, now));
      logAccess(ip, url.pathname, 200);
    } catch (e) {
      statusCode = 500;
      res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(errorHTML('Błąd serwera', 'Nie można zapisać danych'));
      logAccess(ip, url.pathname, 500);
    }
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/list') {
    try {
      const guests = parseJSONFile(GUESTS_FILE);
      if (!guests.length) {
        statusCode = 204;
        res.writeHead(204, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(errorHTML('Brak gości', 'Lista gości jest pusta.'));
        logAccess(ip, url.pathname, 204);
        return true;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head>${require('../../constants').STYLE}</head>
        <body><h1>Lista gości</h1>${renderGuests(guests)}
        <a href="/">Powrót</a></body></html>`);
      logAccess(ip, url.pathname, 200);
    } catch (e) {
      statusCode = 500;
      res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(errorHTML('Błąd serwera', 'Nie można odczytać pliku.'));
      logAccess(ip, url.pathname, 500);
    }
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/clear') {
    try {
      saveJSONFile(GUESTS_FILE, []);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(clearGuestsHTML());
      logAccess(ip, url.pathname, 200);
    } catch (e) {
      statusCode = 500;
      res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(errorHTML('Błąd serwera', 'Nie udało się wyczyścić listy.'));
      logAccess(ip, url.pathname, 500);
    }
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/delete') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const name = decodeURIComponent(body.split('=')[1]);
      if (!validateName(name)) {
        statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(errorHTML('Błąd', 'Nieprawidłowe imię.'));
        logAccess(ip, url.pathname, 400);
        return;
      }
      try {
        let guests = parseJSONFile(GUESTS_FILE);
        guests = guests.filter(g => g.name !== name);
        saveJSONFile(GUESTS_FILE, guests);
        res.writeHead(302, { Location: '/list' });
        res.end();
        logAccess(ip, url.pathname, 302);
      } catch (e) {
        statusCode = 500;
        res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(errorHTML('Błąd serwera', 'Nie udało się usunąć gościa.'));
        logAccess(ip, url.pathname, 500);
      }
    });
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/form') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(formHTML());
    logAccess(ip, url.pathname, 200);
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/form') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const name = decodeURIComponent(body.split('=')[1]);
      if (!validateName(name)) {
        statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(errorHTML('Błąd', 'Nieprawidłowe imię.'));
        logAccess(ip, url.pathname, 400);
        return;
      }
      try {
        const guests = parseJSONFile(GUESTS_FILE);
        const now = new Date().toLocaleString();
        guests.push({ name, date: now, ip });
        saveJSONFile(GUESTS_FILE, guests);
        res.writeHead(302, { Location: '/list' });
        res.end();
        logAccess(ip, url.pathname, 302);
      } catch (e) {
        statusCode = 500;
        res.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(errorHTML('Błąd serwera', 'Nie udało się zapisać.'));
        logAccess(ip, url.pathname, 500);
      }
    });
    return true;
  }

  return false;
}

module.exports = { handleGuestRoutes, getCounter: () => counter, getIpStats: () => ipStats };