// SQLite option (choose/make dynamic by env)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

const connectSQLite = () => {
  if (db) return db;
  
  const dbPath = path.join(__dirname, '../../data/ecomcart.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
      process.exit(1);
    }
    console.log('Connected to SQLite database');
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      stock INTEGER DEFAULT 0,
      category TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER,
      product_id INTEGER,
      qty INTEGER DEFAULT 1,
      FOREIGN KEY (cart_id) REFERENCES carts (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);
  });
  
  return db;
};

module.exports = connectSQLite;