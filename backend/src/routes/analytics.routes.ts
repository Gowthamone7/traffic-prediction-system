// src/routes/analytics.routes.ts
import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

// Get traffic summary
router.get('/summary', analyticsController.getSummary);

// Get traffic trends
router.get('/trends', analyticsController.getTrends);

// Get congestion heatmap data
router.get('/heatmap', analyticsController.getHeatmap);

// Compare multiple routes
router.post('/compare', analyticsController.compareRoutes);

// Get hourly patterns
router.get('/patterns/hourly', analyticsController.getHourlyPatterns);

// Get route statistics
router.get('/stats/:routeId', analyticsController.getRouteStatistics);

export default router;