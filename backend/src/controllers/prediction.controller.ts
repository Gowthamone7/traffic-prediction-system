// src/controllers/prediction.controller.ts
import { Request, Response } from 'express';
import { PredictionRequest } from '../types/traffic.types';

// Minimal local fallback for PredictionService to avoid missing-module errors during development.
// Replace this with the real implementation in ../services/prediction.service when available.
class PredictionService {
  async predict(request: any): Promise<any> {
    // return a simple stubbed prediction
    return { route_id: request.route_id, hour: request.hour, predicted_value: 0 };
  }

  async getPredictionsByRoute(routeId: string, hours: number): Promise<any[]> {
    // return an empty array as a stub
    return [];
  }

  async getHourlyPredictions(routeId: string, day_of_week: number): Promise<any[]> {
    // return hourly stub data
    return Array.from({ length: 24 }).map((_, hour) => ({ routeId, day_of_week, hour, predicted_value: 0 }));
  }

  async getAllRoutesPredictions(hour: number, day_of_week: number): Promise<any[]> {
    // return stubbed predictions for a few example routes
    const exampleRoutes = ['route-1', 'route-2', 'route-3'];
    return exampleRoutes.map(route_id => ({ route_id, hour, day_of_week, predicted_value: 0 }));
  }
}

export class PredictionController {
  private predictionService: PredictionService;

  constructor() {
    this.predictionService = new PredictionService();
  }

  getPrediction = async (req: Request, res: Response): Promise<void> => {
    try {
      const predictionRequest: PredictionRequest = req.body;

      if (!predictionRequest.route_id || predictionRequest.hour === undefined) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: route_id and hour',
          timestamp: new Date()
        });
        return;
      }

      const prediction = await this.predictionService.predict(predictionRequest);

      res.json({
        success: true,
        data: prediction,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Prediction failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  };

  getPredictionsByRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const { hours = 24 } = req.query;

      const predictions = await this.predictionService.getPredictionsByRoute(
        routeId,
        Number(hours)
      );

      res.json({
        success: true,
        data: predictions,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch predictions',
        timestamp: new Date()
      });
    }
  };

  getHourlyPredictions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const { day_of_week } = req.query;

      const predictions = await this.predictionService.getHourlyPredictions(
        routeId,
        day_of_week ? Number(day_of_week) : new Date().getDay()
      );

      res.json({
        success: true,
        data: predictions,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate hourly predictions',
        timestamp: new Date()
      });
    }
  };

  getAllRoutesPredictions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { hour, day_of_week } = req.body;

      const predictions = await this.predictionService.getAllRoutesPredictions(
        hour || new Date().getHours(),
        day_of_week || new Date().getDay()
      );

      res.json({
        success: true,
        data: predictions,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate predictions for all routes',
        timestamp: new Date()
      });
    }
  };
}