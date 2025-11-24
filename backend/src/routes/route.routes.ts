// src/routes/route.routes.ts
import { Router } from 'express';
import { RouteController } from '../controllers/route.controller';

const router = Router();
const routeController = new RouteController();

// Get all routes
router.get('/', routeController.getAllRoutes);

// Get specific route
router.get('/:routeId', routeController.getRouteById);

// Create new route
router.post('/', routeController.createRoute);

// Update route
router.put('/:routeId', routeController.updateRoute);

// Delete route
router.delete('/:routeId', routeController.deleteRoute);

export default router;