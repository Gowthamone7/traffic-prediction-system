// src/routes/prediction.routes.ts
import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';

const router = Router();
const predictionController = new PredictionController();

// Get congestion prediction
router.post('/', predictionController.getPrediction);

// Get predictions for specific route
router.get('/route/:routeId', predictionController.getPredictionsByRoute);

// Get hourly predictions for next 24 hours
router.get('/hourly/:routeId', predictionController.getHourlyPredictions);

// Get predictions for all routes at specific time
router.post('/all-routes', predictionController.getAllRoutesPredictions);

export default router;