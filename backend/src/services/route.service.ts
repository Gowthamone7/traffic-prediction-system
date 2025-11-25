import { Route } from '../types/traffic.types';
import { query } from '../utils/database';

export class RouteService {
  async getAllRoutes(): Promise<Route[]> {
    const result = await query(
      `SELECT * FROM routes ORDER BY name`
    );
    return result.rows;
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    const result = await query(
      `SELECT * FROM routes WHERE route_id = $1`,
      [routeId]
    );
    return result.rows[0] || null;
  }

  async createRoute(route: Route): Promise<Route> {
    const result = await query(
      `INSERT INTO routes 
       (route_id, name, start_lat, start_lng, end_lat, end_lng, distance_km, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        route.route_id,
        route.name,
        route.start_lat,
        route.start_lng,
        route.end_lat,
        route.end_lng,
        route.distance_km,
        route.description
      ]
    );
    return result.rows[0];
  }

  async updateRoute(routeId: string, route: Partial<Route>): Promise<Route> {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (route.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(route.name);
    }
    if (route.distance_km) {
      updates.push(`distance_km = $${paramCount++}`);
      values.push(route.distance_km);
    }
    if (route.description) {
      updates.push(`description = $${paramCount++}`);
      values.push(route.description);
    }

    values.push(routeId);

    const result = await query(
      `UPDATE routes SET ${updates.join(', ')} WHERE route_id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async deleteRoute(routeId: string): Promise<void> {
    await query(
      `DELETE FROM routes WHERE route_id = $1`,
      [routeId]
    );
  }
}