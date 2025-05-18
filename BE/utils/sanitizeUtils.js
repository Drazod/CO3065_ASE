exports.sanitizeInput = (input) => {
  return String(input).replace(/[\"\'<>;]/g, '').trim();
};
