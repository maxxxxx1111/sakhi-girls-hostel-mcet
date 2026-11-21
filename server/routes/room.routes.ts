import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public / Guest reads
router.get('/', RoomController.list);
router.get('/summary', RoomController.getSummary);

// Protected administrative operations
router.post('/allot', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('rooms:allocate'), RoomController.allot);
router.post('/vacate', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('rooms:vacate'), RoomController.vacate);

export default router;
