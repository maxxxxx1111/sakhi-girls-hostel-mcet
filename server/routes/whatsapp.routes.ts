import { Router } from 'express';
import { WhatsAppController } from '../controllers/whatsapp.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public Webhook Handlers for Meta WhatsApp Cloud API
router.get('/webhook', WhatsAppController.verifyWebhook);
router.post('/webhook', WhatsAppController.handleWebhook);

// Simulator endpoint (Accessible for developer testing & in-browser testing)
router.post('/simulate', WhatsAppController.simulateMessage);

// QR Code Linked Device Endpoints
router.get('/qr', WhatsAppController.getQrStatus);
router.post('/qr/start', WhatsAppController.startQrSession);
router.post('/qr/disconnect', WhatsAppController.disconnectQrSession);

// Protected Administration & Audit Endpoints
router.get('/config', AuthMiddleware.optionalAuth, WhatsAppController.getConfig);
router.put('/config', AuthMiddleware.authenticateToken, AuthMiddleware.requirePermission('users:roles'), WhatsAppController.updateConfig);
router.get('/messages', AuthMiddleware.optionalAuth, WhatsAppController.getMessages);
router.get('/templates', AuthMiddleware.optionalAuth, WhatsAppController.getTemplates);

export default router;
