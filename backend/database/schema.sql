-- ============================================================================
-- TRAFFIC FLOW PREDICTION DATABASE SCHEMA
-- PostgreSQL Database Setup
-- ============================================================================

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS traffic_data CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- ROUTES TABLE
-- Stores information about different routes/roads in the system
-- ============================================================================
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_lat DECIMAL(10, 8),
    start_lng DECIMAL(11, 8),
    end_lat DECIMAL(10, 8),
    end_lng DECIMAL(11, 8),
    distance_km DECIMAL(10, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRAFFIC DATA TABLE
-- Stores historical and real-time traffic data
-- ============================================================================
CREATE TABLE traffic_data (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL REFERENCES routes(route_id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    avg_speed DECIMAL(5, 2) NOT NULL,
    vehicle_count INTEGER NOT NULL,
    congestion_index DECIMAL(5, 2) NOT NULL,
    congestion_level VARCHAR(20) NOT NULL CHECK (congestion_level IN ('Low', 'Medium', 'High')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    weather_condition VARCHAR(50),
    temperature DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PREDICTIONS TABLE
-- Stores ML model predictions for future traffic conditions
-- ============================================================================
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL REFERENCES routes(route_id) ON DELETE CASCADE,
    prediction_time TIMESTAMP NOT NULL,
    predicted_for TIMESTAMP NOT NULL,
    congestion_index DECIMAL(5, 2) NOT NULL,
    congestion_level VARCHAR(20) NOT NULL CHECK (congestion_level IN ('Low', 'Medium', 'High')),
    confidence DECIMAL(5, 2),
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- USERS TABLE (Optional - for authentication)
-- Stores user accounts and authentication information
-- ============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'analyst')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Traffic data indexes
CREATE INDEX idx_traffic_route_id ON traffic_data(route_id);
CREATE INDEX idx_traffic_timestamp ON traffic_data(timestamp);
CREATE INDEX idx_traffic_route_time ON traffic_data(route_id, timestamp DESC);
CREATE INDEX idx_traffic_congestion_level ON traffic_data(congestion_level);

-- Predictions indexes
CREATE INDEX idx_predictions_route_id ON predictions(route_id);
CREATE INDEX idx_predictions_predicted_for ON predictions(predicted_for);
CREATE INDEX idx_predictions_route_time ON predictions(route_id, predicted_for);

-- Routes indexes
CREATE INDEX idx_routes_route_id ON routes(route_id);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for routes table
CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for latest traffic data by route
CREATE OR REPLACE VIEW latest_traffic_by_route AS
SELECT DISTINCT ON (route_id)
    t.route_id,
    r.name as route_name,
    t.timestamp,
    t.avg_speed,
    t.vehicle_count,
    t.congestion_index,
    t.congestion_level
FROM traffic_data t
JOIN routes r ON t.route_id = r.route_id
ORDER BY route_id, timestamp DESC;

-- View for hourly traffic patterns
CREATE OR REPLACE VIEW hourly_traffic_patterns AS
SELECT 
    route_id,
    EXTRACT(HOUR FROM timestamp) as hour,
    AVG(avg_speed) as avg_speed,
    AVG(vehicle_count) as avg_vehicles,
    AVG(congestion_index) as avg_congestion
FROM traffic_data
GROUP BY route_id, EXTRACT(HOUR FROM timestamp)
ORDER BY route_id, hour;

-- View for daily route statistics
CREATE OR REPLACE VIEW daily_route_stats AS
SELECT 
    route_id,
    DATE(timestamp) as date,
    COUNT(*) as data_points,
    AVG(avg_speed) as avg_speed,
    MIN(avg_speed) as min_speed,
    MAX(avg_speed) as max_speed,
    AVG(vehicle_count) as avg_vehicles,
    AVG(congestion_index) as avg_congestion,
    SUM(CASE WHEN congestion_level = 'High' THEN 1 ELSE 0 END) as high_congestion_count
FROM traffic_data
GROUP BY route_id, DATE(timestamp)
ORDER BY date DESC;

-- ============================================================================
-- SEED DATA - INSERT SAMPLE ROUTES
-- ============================================================================

INSERT INTO routes (route_id, name, start_lat, start_lng, end_lat, end_lng, distance_km, description)
VALUES 
    ('Route_A', 'Highway 1 North', 12.9716, 77.5946, 12.9856, 77.6114, 5.2, 'Main highway connecting north district'),
    ('Route_B', 'Main Street Downtown', 12.9726, 77.6006, 12.9886, 77.6184, 3.8, 'Primary downtown arterial road'),
    ('Route_C', 'City Center Loop', 12.9656, 77.5986, 12.9756, 77.6064, 2.1, 'Inner city circular route'),
    ('Route_D', 'East-West Express', 12.9616, 77.5856, 12.9816, 77.6256, 8.5, 'Major east-west connector'),
    ('Route_E', 'Airport Road', 12.9416, 77.5656, 13.0016, 77.6456, 12.3, 'Route to international airport');

-- ============================================================================
-- SEED DATA - INSERT SAMPLE TRAFFIC DATA
-- ============================================================================

-- Insert sample traffic data for the last 7 days
INSERT INTO traffic_data (route_id, timestamp, avg_speed, vehicle_count, congestion_index, congestion_level, latitude, longitude)
SELECT 
    r.route_id,
    CURRENT_TIMESTAMP - (INTERVAL '1 hour' * generate_series),
    CASE 
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 7 AND 9 
        THEN 25 + random() * 15
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 17 AND 19 
        THEN 20 + random() * 15
        ELSE 40 + random() * 10
    END as avg_speed,
    CASE 
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 7 AND 9 
        THEN 100 + floor(random() * 50)::integer
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 17 AND 19 
        THEN 110 + floor(random() * 50)::integer
        ELSE 50 + floor(random() * 30)::integer
    END as vehicle_count,
    CASE 
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 7 AND 9 
        THEN 70 + random() * 20
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 17 AND 19 
        THEN 75 + random() * 20
        ELSE 25 + random() * 25
    END as congestion_index,
    CASE 
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 7 AND 9 
        THEN 'High'
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 17 AND 19 
        THEN 'High'
        WHEN EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series)) BETWEEN 10 AND 16 
        THEN 'Medium'
        ELSE 'Low'
    END as congestion_level,
    12.9716 + random() * 0.04,
    77.5946 + random() * 0.04
FROM 
    routes,
    generate_series(0, 168) -- Last 7 days (168 hours)
CROSS JOIN LATERAL (SELECT route_id FROM routes) r;

-- ============================================================================
-- SEED DATA - INSERT SAMPLE USER (Optional)
-- Password: 'password123' hashed with bcrypt
-- ============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES 
    ('admin@traffic.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'admin'),
    ('analyst@traffic.com', '$2a$10$YourHashedPasswordHere', 'John', 'Analyst', 'analyst'),
    ('user@traffic.com', '$2a$10$YourHashedPasswordHere', 'Regular', 'User', 'user');

-- ============================================================================
-- USEFUL QUERIES FOR TESTING
-- ============================================================================

-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Count records in each table
SELECT 'routes' as table_name, COUNT(*) as count FROM routes
UNION ALL
SELECT 'traffic_data', COUNT(*) FROM traffic_data
UNION ALL
SELECT 'predictions', COUNT(*) FROM predictions
UNION ALL
SELECT 'users', COUNT(*) FROM users;

-- View latest traffic data
SELECT * FROM latest_traffic_by_route;

-- View hourly patterns
SELECT * FROM hourly_traffic_patterns LIMIT 20;

-- Get traffic summary for last 24 hours
SELECT 
    t.route_id,
    r.name,
    COUNT(*) as data_points,
    AVG(t.avg_speed) as avg_speed,
    AVG(t.congestion_index) as avg_congestion,
    MAX(t.congestion_index) as max_congestion
FROM traffic_data t
JOIN routes r ON t.route_id = r.route_id
WHERE t.timestamp > CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY t.route_id, r.name
ORDER BY avg_congestion DESC;

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Delete old traffic data (older than 90 days)
-- Run this periodically to prevent table bloat
-- DELETE FROM traffic_data WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days';

-- Delete old predictions (older than 7 days)
-- DELETE FROM predictions WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days';

-- Vacuum and analyze tables for performance
-- VACUUM ANALYZE traffic_data;
-- VACUUM ANALYZE predictions;

-- ============================================================================
-- GRANTS (Optional - adjust based on your security needs)
-- ============================================================================

-- Create a read-only user for reporting
-- CREATE USER traffic_readonly WITH PASSWORD 'your_password';
-- GRANT CONNECT ON DATABASE traffic_db TO traffic_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO traffic_readonly;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO traffic_readonly;

-- Create an application user with full access
-- CREATE USER traffic_app WITH PASSWORD 'your_password';
-- GRANT ALL PRIVILEGES ON DATABASE traffic_db TO traffic_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO traffic_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO traffic_app;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Traffic Flow Prediction Database Setup Complete!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Created Tables:';
    RAISE NOTICE '  - routes';
    RAISE NOTICE '  - traffic_data';
    RAISE NOTICE '  - predictions';
    RAISE NOTICE '  - users';
    RAISE NOTICE '';
    RAISE NOTICE 'Created Indexes: 10+';
    RAISE NOTICE 'Created Views: 3';
    RAISE NOTICE 'Inserted Sample Data: Yes';
    RAISE NOTICE '================================================';
END $$;