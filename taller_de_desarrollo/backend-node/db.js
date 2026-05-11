const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'parking.db');

async function openDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS parking_spots (
      spot_code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      confidence REAL,
      last_seen TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS parking_detections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spot_code TEXT NOT NULL,
      status TEXT NOT NULL,
      confidence REAL,
      timestamp TEXT NOT NULL
    );
  `);

  return db;
}

module.exports = { openDb };
