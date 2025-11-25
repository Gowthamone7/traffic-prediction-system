"""
Test database connection for Python backend
"""
import sys
sys.path.append('.')

from database import test_connection, fetch_all, fetch_one

def main():
    print("🔍 Testing PostgreSQL connection...\n")
    
    if not test_connection():
        print("\n❌ Failed to connect to database")
        return
    
    # Check routes
    routes = fetch_all("SELECT COUNT(*) as count FROM routes")
    print(f"\n🛣️  Routes: {routes[0][0]}")
    
    # Check traffic data
    traffic = fetch_all("SELECT COUNT(*) as count FROM traffic_data")
    print(f"📊 Traffic Data Points: {traffic[0][0]}")
    
    # Get all routes
    all_routes = fetch_all("SELECT route_id, name FROM routes ORDER BY name")
    print("\n📋 Available Routes:")
    for route in all_routes:
        print(f"   - {route[0]}: {route[1]}")
    
    # Latest traffic by route
    latest = fetch_all("""
        SELECT route_id, COUNT(*) as count 
        FROM traffic_data 
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        GROUP BY route_id
        ORDER BY route_id
    """)
    print("\n📈 Traffic data (last 24h):")
    for row in latest:
        print(f"   {row[0]}: {row[1]} records")
    
    print("\n✅ Database connection successful!\n")

if __name__ == "__main__":
    main()
