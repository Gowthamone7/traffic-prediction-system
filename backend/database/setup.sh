#!/bin/bash
# ============================================================================
# Traffic Prediction System - Database Setup Script for Linux/Mac
# ============================================================================

echo "================================================"
echo "Traffic Flow Prediction Database Setup"
echo "================================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "ERROR: PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first"
    exit 1
fi

echo "[1/4] Checking PostgreSQL connection..."
if ! psql -U postgres -c "SELECT version();" &> /dev/null; then
    echo "ERROR: Cannot connect to PostgreSQL"
    echo "Please ensure PostgreSQL is running and you have the correct credentials"
    exit 1
fi

echo "[2/4] Creating database 'traffic_db'..."
psql -U postgres -c "DROP DATABASE IF EXISTS traffic_db;"
psql -U postgres -c "CREATE DATABASE traffic_db;"

echo "[3/4] Importing schema.sql..."
psql -U postgres -d traffic_db -f schema.sql

echo "[4/4] Verifying setup..."
psql -U postgres -d traffic_db -c "\dt"

echo ""
echo "================================================"
echo "Database setup completed successfully!"
echo "================================================"
echo "Database: traffic_db"
echo "Tables created: routes, traffic_data, predictions, users"
echo "Sample data: Inserted"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your PostgreSQL password"
echo "2. Run: cd backend/python && pip install psycopg2-binary sqlalchemy"
echo "3. Start your application"
echo "================================================"
