function safeSort(req, allowed, defaultCol, defaultDir = "asc") {
  const sort = String(req.query.sort || defaultCol);
  const dir = String(req.query.dir || defaultDir).toLowerCase() === "desc" ? "desc" : "asc";
  const col = allowed.includes(sort) ? sort : defaultCol;
  return { col, dir };
}

module.exports = { safeSort };
