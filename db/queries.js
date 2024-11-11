const pool = require("./pool");

async function getAllMessages() {
  const result = await pool.query(
    "SELECT * FROM messages ORDER BY timestamp DESC"
  );
  return result.rows;
}

async function insertMessage(message, author) {
  const query = "INSERT INTO messages (message, author) VALUES ($1, $2)";
  await pool.query(query, [message, author]);
}

module.exports = { getAllMessages, insertMessage };
