import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// List leaves (audited or filtered by role)
router.get('/', AuthMiddleware.optionalAuth, LeaveController.list);

// Apply for leave (Requires resident/student authorization)
router.post('/', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('leaves:apply'), LeaveController.create);

// Review leaves (Requires Warden/Admin approval permission)
router.post('/:id/approve', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('leaves:approve'), LeaveController.approve);
router.post('/:id/reject', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('leaves:approve'), LeaveController.reject);

// Sentry gate token verification (Available to security post / scanner)
router.get('/verify/:code', LeaveController.verifyPass);

export default router;
