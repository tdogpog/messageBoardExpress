const pool = require("./pool");

async function getAllMessages() {
  const result = await pool.query(`
    SELECT 
      messages.title,
      messages.message AS content,
      messages.timestamp,
      users.username
    FROM 
      messages
    INNER JOIN 
      users
    ON 
      messages.user_id = users.id;
  `);
  return result.rows;
}

async function insertMessage(message, title, user_id) {
  const query =
    "INSERT INTO messages (message, title, user_id) VALUES ($1, $2, $3)";
  await pool.query(query, [message, title, user_id]);
}

module.exports = { getAllMessages, insertMessage };
