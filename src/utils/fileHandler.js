
const fs = require('fs');

function parseJSONFile(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function saveJSONFile(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    throw new Error(`Failed to save file ${file}: ${e.message}`);
  }
}

function readCounter(file) {
  try {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')).all || 0 : 0;
  } catch {
    return 0;
  }
}

function readIpStats(file) {
  try {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) || {} : {};
  } catch {
    return {};
  }
}

module.exports = { parseJSONFile, saveJSONFile, readCounter, readIpStats };