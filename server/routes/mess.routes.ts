import { Router } from 'express';
import { MessController } from '../controllers/mess.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public / Guest reads
router.get('/menu', MessController.getMenu);
router.get('/rebate', MessController.calculateRebate);

// Attendance tracking
router.get('/attendance', AuthMiddleware.optionalAuth, MessController.getAttendance);
router.post('/attendance', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('mess:attendance'), MessController.markAttendance);

export default router;
