
function validateName(name) {
  if (!name || name.length === 0 || name.length > 50) return false;
  if (/[^\wąćęłńóśźż -]/.test(name)) return false;
  return true;
}

module.exports = { validateName };