// src/services/prediction.service.ts
import { PredictionRequest } from '../types/traffic.types';
import { query } from '../utils/database';

export class PredictionService {
  // returns a simple stubbed prediction based on the request
  async predict(req: PredictionRequest): Promise<any> {
    return {
      route_id: req.route_id,
      hour: req.hour,
      predicted_value: 0,
      note: 'stub prediction'
    };
  }

  // returns a list of stubbed predictions for the next `hours` hours
  async getPredictionsByRoute(routeId: string, hours: number): Promise<any[]> {
    const nowHour = new Date().getHours();
    return Array.from({ length: Math.max(0, Math.floor(hours)) }).map((_, i) => ({
      route_id: routeId,
      hour: (nowHour + i) % 24,
      predicted_value: 0
    }));
  }

  // returns 24 hourly stubbed predictions for the given day_of_week
  async getHourlyPredictions(routeId: string, day_of_week: number): Promise<any[]> {
    return Array.from({ length: 24 }).map((_, h) => ({
      route_id: routeId,
      hour: h,
      day_of_week,
      predicted_value: 0
    }));
  }

  // returns stubbed predictions for all routes for the given hour and day_of_week
  async getAllRoutesPredictions(hour: number, day_of_week: number): Promise<any[]> {
    const routes = await query(`SELECT route_id, name FROM routes`);
    
    return routes.rows.map(route => ({
      route_id: route.route_id,
      route_name: route.name,
      hour,
      day_of_week,
      predicted_value: Math.random() * 100 // Replace with actual ML prediction
    }));
  }
}