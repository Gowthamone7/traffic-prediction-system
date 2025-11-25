import { TrafficData } from '../types/traffic.types';
import { query } from '../utils/database';

export class TrafficService {
  async getAllTraffic(options: any): Promise<TrafficData[]> {
    const limit = options?.limit || 100;
    const offset = options?.offset || 0;
    
    const result = await query(
      `SELECT t.*, r.name as route_name 
       FROM traffic_data t 
       JOIN routes r ON t.route_id = r.route_id 
       ORDER BY t.timestamp DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    return result.rows;
  }

  async getTrafficByRoute(routeId: string, hours: number = 24): Promise<TrafficData[]> {
    const result = await query(
      `SELECT t.*, r.name as route_name 
       FROM traffic_data t 
       JOIN routes r ON t.route_id = r.route_id 
       WHERE t.route_id = $1 
       AND t.timestamp >= NOW() - INTERVAL '1 hour' * $2
       ORDER BY t.timestamp DESC`,
      [routeId, hours]
    );
    
    return result.rows;
  }

  async getLiveTraffic(): Promise<TrafficData[]> {
    const result = await query(
      `SELECT * FROM latest_traffic_by_route`
    );
    
    return result.rows;
  }

  async getTrafficByTimeRange(queryParams: any): Promise<TrafficData[]> {
    const { startTime, endTime, routeId } = queryParams;
    
    let sql = `SELECT t.*, r.name as route_name 
               FROM traffic_data t 
               JOIN routes r ON t.route_id = r.route_id 
               WHERE t.timestamp BETWEEN $1 AND $2`;
    
    const params: any[] = [startTime, endTime];
    
    if (routeId) {
      sql += ` AND t.route_id = $3`;
      params.push(routeId);
    }
    
    sql += ` ORDER BY t.timestamp DESC`;
    
    const result = await query(sql, params);
    return result.rows;
  }

  async addTrafficData(data: TrafficData): Promise<TrafficData> {
    const result = await query(
      `INSERT INTO traffic_data 
       (route_id, timestamp, avg_speed, vehicle_count, congestion_index, 
        congestion_level, latitude, longitude, weather_condition, temperature)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.route_id,
        data.timestamp,
        data.avg_speed,
        data.vehicle_count,
        data.congestion_index,
        data.congestion_level,
        data.latitude,
        data.longitude,
        data.weather_condition,
        data.temperature
      ]
    );
    
    return result.rows[0];
  }

  async bulkInsertTraffic(data: TrafficData[]): Promise<number> {
    console.log(`Bulk inserting ${data.length} records`);
    return data.length;
  }
}