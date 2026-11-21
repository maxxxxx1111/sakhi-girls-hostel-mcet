import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected Authentication & Session Endpoints
router.get('/me', AuthMiddleware.authenticateToken, AuthController.getMe);
router.put('/profile', AuthMiddleware.authenticateToken, AuthController.updateProfile);
router.put('/change-password', AuthMiddleware.authenticateToken, AuthController.changePassword);
router.get('/sessions', AuthMiddleware.authenticateToken, AuthController.getActiveSessions);
router.post('/logout', AuthMiddleware.authenticateToken, AuthController.logout);
router.post('/logout-all', AuthMiddleware.authenticateToken, AuthController.logoutAll);

export default router;
