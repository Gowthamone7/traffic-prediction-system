import { query } from '../utils/database';

export class AnalyticsService {
  async getTrafficSummary() {
    const result = await query(
      `SELECT 
        COUNT(DISTINCT route_id) as total_routes,
        COUNT(*) as total_data_points,
        AVG(avg_speed) as overall_avg_speed,
        AVG(congestion_index) as overall_congestion
       FROM traffic_data
       WHERE timestamp >= NOW() - INTERVAL '24 hours'`
    );
    return result.rows[0];
  }

  async getTrafficTrends(options: any) {
    const hours = options?.hours || 24;
    const result = await query(
      `SELECT 
        DATE_TRUNC('hour', timestamp) as hour,
        AVG(avg_speed) as avg_speed,
        AVG(congestion_index) as avg_congestion,
        COUNT(*) as data_points
       FROM traffic_data
       WHERE timestamp >= NOW() - INTERVAL '1 hour' * $1
       GROUP BY DATE_TRUNC('hour', timestamp)
       ORDER BY hour`,
      [hours]
    );
    return result.rows;
  }

  async getCongestionHeatmap(routeId?: string) {
    let sql = `SELECT * FROM hourly_traffic_patterns`;
    const params: any[] = [];
    
    if (routeId) {
      sql += ` WHERE route_id = $1`;
      params.push(routeId);
    }
    
    const result = await query(sql, params);
    return result.rows;
  }

  async compareRoutes(routeIds: string[]) {
    const result = await query(
      `SELECT 
        t.route_id,
        r.name,
        AVG(t.avg_speed) as avg_speed,
        AVG(t.congestion_index) as avg_congestion,
        COUNT(*) as data_points
       FROM traffic_data t
       JOIN routes r ON t.route_id = r.route_id
       WHERE t.route_id = ANY($1)
       AND t.timestamp >= NOW() - INTERVAL '24 hours'
       GROUP BY t.route_id, r.name`,
      [routeIds]
    );
    return result.rows;
  }

  async getHourlyPatterns(routeId?: string) {
    let sql = `SELECT * FROM hourly_traffic_patterns`;
    const params: any[] = [];
    
    if (routeId) {
      sql += ` WHERE route_id = $1`;
      params.push(routeId);
    }
    
    sql += ` ORDER BY route_id, hour`;
    const result = await query(sql, params);
    return result.rows;
  }

  async getRouteStatistics(routeId: string) {
    const result = await query(
      `SELECT * FROM daily_route_stats
       WHERE route_id = $1
       ORDER BY date DESC
       LIMIT 7`,
      [routeId]
    );
    return result.rows;
  }
}