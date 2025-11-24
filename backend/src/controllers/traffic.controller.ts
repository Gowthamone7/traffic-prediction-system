// src/controllers/traffic.controller.ts
import { Request, Response } from 'express';
import { ApiResponse, TrafficData } from '../types/traffic.types';

/**
 * Minimal inline TrafficService implementation to satisfy the controller while the real
 * service file is not present; replace this with the proper implementation at
 * src/services/traffic.service.ts when available.
 */
class TrafficService {
  async getAllTraffic(_: { route_id?: string; limit?: number; page?: number }): Promise<TrafficData[]> {
    return [];
  }

  async getTrafficByRoute(_: string, __: number): Promise<TrafficData[]> {
    return [];
  }

  async getLiveTraffic(): Promise<TrafficData[]> {
    return [];
  }

  async getTrafficByTimeRange(_: { route_id?: string; start_date?: Date; end_date?: Date }): Promise<TrafficData[]> {
    return [];
  }

  async addTrafficData(data: TrafficData): Promise<TrafficData> {
    return data;
  }

  async bulkInsertTraffic(data: TrafficData[]): Promise<number> {
    return data.length;
  }
}

export class TrafficController {
  private trafficService: TrafficService;

  constructor() {
    this.trafficService = new TrafficService();
  }

  getAllTrafficData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_id, limit = 100, page = 1 } = req.query;

      const data = await this.trafficService.getAllTraffic({
        route_id: route_id as string,
        limit: Number(limit),
        page: Number(page)
      });

      const response: ApiResponse<TrafficData[]> = {
        success: true,
        data,
        timestamp: new Date()
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch traffic data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  };

  getTrafficByRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const { hours = 24 } = req.query;

      const data = await this.trafficService.getTrafficByRoute(
        routeId,
        Number(hours)
      );

      res.json({
        success: true,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch route traffic data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  };

  getLiveTraffic = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.trafficService.getLiveTraffic();

      res.json({
        success: true,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch live traffic data',
        timestamp: new Date()
      });
    }
  };

  getTrafficByTimeRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_id, start_date, end_date } = req.query;

      const data = await this.trafficService.getTrafficByTimeRange({
        route_id: route_id as string,
        start_date: start_date ? new Date(start_date as string) : undefined,
        end_date: end_date ? new Date(end_date as string) : undefined
      });

      res.json({
        success: true,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch traffic data by time range',
        timestamp: new Date()
      });
    }
  };

  addTrafficData = async (req: Request, res: Response): Promise<void> => {
    try {
      const trafficData: TrafficData = req.body;

      if (!trafficData.route_id || !trafficData.avg_speed || !trafficData.vehicle_count) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
          timestamp: new Date()
        });
        return;
      }

      const result = await this.trafficService.addTrafficData(trafficData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Traffic data added successfully',
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to add traffic data',
        timestamp: new Date()
      });
    }
  };

  bulkInsertTraffic = async (req: Request, res: Response): Promise<void> => {
    try {
      const trafficDataArray: TrafficData[] = req.body;

      if (!Array.isArray(trafficDataArray) || trafficDataArray.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid data format',
          timestamp: new Date()
        });
        return;
      }

      const result = await this.trafficService.bulkInsertTraffic(trafficDataArray);

      res.status(201).json({
        success: true,
        data: { inserted: result },
        message: `${result} records inserted successfully`,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to bulk insert traffic data',
        timestamp: new Date()
      });
    }
  };
}