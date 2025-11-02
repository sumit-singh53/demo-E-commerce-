# Database Setup Guide

This project supports both MongoDB and SQLite databases. Choose the one that fits your needs.

## MongoDB Setup

### 1. Local MongoDB Installation

**Windows:**
- Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- Install and start the MongoDB service
- Default connection: `mongodb://127.0.0.1:27017/ecommerce`

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Environment Configuration

Update your `.env` file:
```env
DB_TYPE=mongo
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
USE_MOCK=false
```

### 3. MongoDB Atlas (Cloud)

For cloud deployment, use MongoDB Atlas:
1. Create account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 4. MongoDB with Authentication

If your MongoDB requires authentication:
```env
MONGO_URI=mongodb://username:password@127.0.0.1:27017/ecommerce
```

## SQLite Setup (Alternative)

For simpler setup without MongoDB:
```env
DB_TYPE=sqlite
USE_MOCK=false
```

SQLite database will be created automatically at `backend/data/ecomcart.db`

## Testing Without Database

For development/testing without setting up a database:
```env
USE_MOCK=true
```

## Troubleshooting

1. **Connection refused**: Ensure MongoDB service is running
2. **Authentication failed**: Check username/password in MONGO_URI
3. **Database not found**: MongoDB will create the database automatically
4. **Port conflicts**: Change port in MONGO_URI if 27017 is in use

## Verification

Start the server and look for:
- `MongoDB Connected: 127.0.0.1` (for successful MongoDB connection)
- `SQLite database initialized` (for SQLite)
- `Using mock data` (for mock mode)