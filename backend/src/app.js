// Express app
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection based on DB_TYPE
if (process.env.USE_MOCK === 'true') {
  console.log('Using mock data - no database connection needed');
} else if (process.env.DB_TYPE === 'mongo') {
  const connectMongo = require('./db/mongo');
  connectMongo();
} else if (process.env.DB_TYPE === 'sqlite') {
  const connectSQLite = require('./db/sqlite');
  connectSQLite();
  console.log('SQLite database initialized');
}

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));

// Error handling
app.use(require('./middlewares/errorMiddleware'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;