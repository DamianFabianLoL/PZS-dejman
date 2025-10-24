
const http = require('http');
const { PORT, LOG_FILE } = require('./constants');
const { logError, logAccess } = require('./utils/logger');
const { handleGuestRoutes, getCounter, getIpStats } = require('./src/routes/guestRoutes');
const { handleStatsRoute } = require('./routes/statsRoutes');
const { errorHTML } = require('./src/views/htmlRenderer');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (handleGuestRoutes(req, res, url, ip)) return;
  if (handleStatsRoute(req, res, url, ip, getIpStats())) return;

  res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end(errorHTML('404', 'Strona nie istnieje'));
  logAccess(ip, url.pathname, 404);
});

process.on('uncaughtException', err => {
  logError(LOG_FILE, `SERVER CRASH ERROR: ${err}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(LOG_FILE, `PROMISE REJECTION: ${reason}`);
});

server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});