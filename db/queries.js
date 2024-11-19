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

async function insertMessage(message, author) {
  const query = "INSERT INTO messages (message, author) VALUES ($1, $2)";
  await pool.query(query, [message, author]);
}

module.exports = { getAllMessages, insertMessage };
