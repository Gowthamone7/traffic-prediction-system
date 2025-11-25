# PostgreSQL Database Setup Guide

## Prerequisites
- PostgreSQL installed on your system
- psql command-line tool available

## Steps to Import Schema

### 1. Create the Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE traffic_db;

# Exit psql
\q
```

### 2. Place your schema.sql file
Copy your `schema.sql` file to this directory:
```
backend/database/schema.sql
```

### 3. Import the Schema

**Option A - Using psql command:**
```bash
cd backend/database
psql -U postgres -d traffic_db -f schema.sql
```

**Option B - Using PowerShell from project root:**
```powershell
cd backend\database
psql -U postgres -d traffic_db -f schema.sql
```

**Option C - From within psql:**
```bash
psql -U postgres -d traffic_db
\i schema.sql
```

### 4. Verify Import
```sql
-- Connect to database
psql -U postgres -d traffic_db

-- List all tables
\dt

-- Describe a specific table
\d table_name

-- Exit
\q
```

### 5. Configure Environment Variables
1. Copy `.env.example` to `.env` in the backend folder
2. Update with your actual PostgreSQL credentials

## Install PostgreSQL Client Libraries

### For Python Backend:
```bash
cd backend/python
pip install psycopg2-binary sqlalchemy
```

### For Node.js Backend:
```bash
cd backend
npm install pg
```

## Common Issues

**Connection refused:**
- Make sure PostgreSQL service is running
- Check if port 5432 is not blocked

**Authentication failed:**
- Verify username and password
- Check pg_hba.conf settings

**Permission denied:**
- Ensure user has CREATE privileges
- Try running as superuser (postgres)
