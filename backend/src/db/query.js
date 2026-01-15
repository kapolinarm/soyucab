const pool = require("./pool");

async function withClient(fn) {
  const client = await pool.connect();
  try {
    await client.query("SET search_path TO public;");
    return await fn(client);
  } finally {
    client.release();
  }
}

async function queryRows(sql, params = []) {
  return withClient(async (client) => {
    const r = await client.query(sql, params);
    return r.rows;
  });
}

async function queryOne(sql, params = []) {
  const rows = await queryRows(sql, params);
  return rows[0] || null;
}

async function exec(sql, params = []) {
  return withClient(async (client) => client.query(sql, params));
}

async function tx(fn) {
  return withClient(async (client) => {
    await client.query("BEGIN");
    try {
      const out = await fn(client);
      await client.query("COMMIT");
      return out;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}

module.exports = { queryRows, queryOne, exec, tx, withClient };
