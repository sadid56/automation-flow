import { Router } from 'express';
import healthRoutes from './health.routes.js';
import automationRoutes from './automation.routes.js';

const router: Router = Router();

router.use('/health', healthRoutes);
router.use('/automations', automationRoutes);

export default router;
