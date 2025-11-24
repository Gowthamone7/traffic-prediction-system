// src/controllers/analytics.controller.ts
import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const summary = await this.analyticsService.getTrafficSummary();

      res.json({
        success: true,
        data: summary,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch summary',
        timestamp: new Date()
      });
    }
  };

  getTrends = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_id, days = 7 } = req.query;

      const trends = await this.analyticsService.getTrafficTrends({
        route_id: route_id as string,
        days: Number(days)
      });

      res.json({
        success: true,
        data: trends,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trends',
        timestamp: new Date()
      });
    }
  };

  getHeatmap = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_id } = req.query;

      const heatmap = await this.analyticsService.getCongestionHeatmap(
        route_id as string
      );

      res.json({
        success: true,
        data: heatmap,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate heatmap',
        timestamp: new Date()
      });
    }
  };

  compareRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_ids } = req.body;

      if (!Array.isArray(route_ids) || route_ids.length === 0) {
        res.status(400).json({
          success: false,
          error: 'route_ids array is required',
          timestamp: new Date()
        });
        return;
      }

      const comparison = await this.analyticsService.compareRoutes(route_ids);

      res.json({
        success: true,
        data: comparison,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to compare routes',
        timestamp: new Date()
      });
    }
  };

  getHourlyPatterns = async (req: Request, res: Response): Promise<void> => {
    try {
      const { route_id } = req.query;

      const patterns = await this.analyticsService.getHourlyPatterns(
        route_id as string
      );

      res.json({
        success: true,
        data: patterns,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch hourly patterns',
        timestamp: new Date()
      });
    }
  };

  getRouteStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;

      const stats = await this.analyticsService.getRouteStatistics(routeId);

      res.json({
        success: true,
        data: stats,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch route statistics',
        timestamp: new Date()
      });
    }
  };
}