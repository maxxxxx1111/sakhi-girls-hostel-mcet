import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', AnalyticsController.getOverview);
router.get('/departments', AnalyticsController.getDepartments);
router.get('/years', AnalyticsController.getYears);

export default router;
