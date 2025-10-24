
const fs = require('fs');

function logAccess(file, ip, path, code) {
  const line = `[${new Date().toISOString()}] ${ip} ${path} ${code}\n`;
  fs.appendFile(file, line, () => {});
}

function logError(file, message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(file, line, () => {});
}

module.exports = { logAccess, logError };