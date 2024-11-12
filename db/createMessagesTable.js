#!/usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO messages (message,author)
VALUES
 ('Hello,world!', 'Admin'),
 ('Welcome to the message board!,'Moderator'),
 ('This is a sample message.','Alan');
`;

async function main() {
  console.log("Seeding data...");

  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME",
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Table created, data seeded");
  } catch (error) {
    console.error("Error creating table or seeding data:", error);
  } finally {
    await client.end();
  }
}

main();
