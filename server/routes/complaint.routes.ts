import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', AuthMiddleware.optionalAuth, ComplaintController.list);

// Create complaint: Requires resident submission right
router.post('/', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('complaints:create'), ComplaintController.create);

// Update status: Requires resolution right (Moderator / Admin)
router.patch('/:id/status', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('complaints:resolve'), ComplaintController.updateStatus);

export default router;
