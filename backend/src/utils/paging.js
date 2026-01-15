function getPaging(req, defaults = { limit: 20, maxLimit: 100 }) {
  const limit = Math.min(parseInt(req.query.limit || defaults.limit, 10), defaults.maxLimit);
  const page = Math.max(parseInt(req.query.page || 1, 10), 1);
  const offset = (page - 1) * limit;
  return { limit, page, offset };
}

module.exports = { getPaging };
