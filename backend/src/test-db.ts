import dotenv from 'dotenv';
import pool, { query } from './utils/database';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test basic connection
    const versionResult = await query('SELECT version()');
    console.log('✅ PostgreSQL Version:', versionResult.rows[0].version.split(',')[0]);
    
    // Check tables
    const tablesResult = await query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    );
    console.log('\n📋 Tables found:');
    tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
    
    // Check routes
    const routesResult = await query('SELECT COUNT(*) as count FROM routes');
    console.log(`\n🛣️  Routes: ${routesResult.rows[0].count}`);
    
    // Check traffic data
    const trafficResult = await query('SELECT COUNT(*) as count FROM traffic_data');
    console.log(`📊 Traffic Data Points: ${trafficResult.rows[0].count}`);
    
    // Latest traffic
    const latestResult = await query(
      `SELECT route_id, COUNT(*) as count 
       FROM traffic_data 
       WHERE timestamp >= NOW() - INTERVAL '24 hours'
       GROUP BY route_id`
    );
    console.log('\n📈 Traffic data (last 24h):');
    latestResult.rows.forEach(row => 
      console.log(`   ${row.route_id}: ${row.count} records`)
    );
    
    console.log('\n✅ Database connection successful!\n');
    
  } catch (error) {
    console.error('\n❌ Database connection error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
