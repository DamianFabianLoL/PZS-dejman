
const { logAccess } = require('../utils/logger');
const { statsHTML } = require('../src/views/htmlRenderer');

function handleStatsRoute(req, res, url, ip, ipStats) {
  if (req.method === 'GET' && url.pathname === '/stats') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(statsHTML(ipStats));
    logAccess(ip, url.pathname, 200);
    return true;
  }
  return false;
}

module.exports = { handleStatsRoute };