const pool = require("./pool");

async function getAllMessages() {
  console.log("fetching messages...");
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
  console.log("fetched", result.rows);
  return result.rows;
}

async function insertMessage(message, title, user_id) {
  const query =
    "INSERT INTO messages (message, title, user_id) VALUES ($1, $2, $3)";
  await pool.query(query, [message, title, user_id]);
}

module.exports = { getAllMessages, insertMessage };
