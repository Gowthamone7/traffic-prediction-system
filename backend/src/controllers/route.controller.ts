// src/controllers/route.controller.ts
import { Request, Response } from 'express';
import { RouteService } from '../services/route.service';
import { Route } from '../types/traffic.types';

export class RouteController {
  private routeService: RouteService;

  constructor() {
    this.routeService = new RouteService();
  }

  getAllRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const routes = await this.routeService.getAllRoutes();

      res.json({
        success: true,
        data: routes,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch routes',
        timestamp: new Date()
      });
    }
  };

  getRouteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const route = await this.routeService.getRouteById(routeId);

      if (!route) {
        res.status(404).json({
          success: false,
          error: 'Route not found',
          timestamp: new Date()
        });
        return;
      }

      res.json({
        success: true,
        data: route,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch route',
        timestamp: new Date()
      });
    }
  };

  createRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const routeData: Route = req.body;
      const result = await this.routeService.createRoute(routeData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Route created successfully',
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create route',
        timestamp: new Date()
      });
    }
  };

  updateRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const routeData: Partial<Route> = req.body;

      const result = await this.routeService.updateRoute(routeId, routeData);

      res.json({
        success: true,
        data: result,
        message: 'Route updated successfully',
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update route',
        timestamp: new Date()
      });
    }
  };

  deleteRoute = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      await this.routeService.deleteRoute(routeId);

      res.json({
        success: true,
        message: 'Route deleted successfully',
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete route',
        timestamp: new Date()
      });
    }
  };
}