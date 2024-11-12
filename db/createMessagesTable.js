require("dotenv").config({ path: "../.env" });
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert some test data
INSERT INTO messages (message, author)
VALUES
  ('Hello, world!', 'Admin'),
  ('Welcome to the message board!', 'Moderator'),
  ('This is a sample message.', 'Alan');
`;

async function main() {
  console.log("Connecting to the database...");

  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });

  try {
    await client.connect();
    console.log("Connection successful");

    console.log("Creating table and seeding data...");
    await client.query(SQL);
    console.log("Table created, data seeded successfully.");
  } catch (error) {
    console.error("Error creating table or seeding data:", error);
  } finally {
    await client.end();
    console.log("Connection closed");
  }
}

main();
