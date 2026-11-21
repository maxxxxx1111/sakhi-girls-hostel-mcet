import { Router } from 'express';
import { RbacController } from '../controllers/rbac.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All RBAC endpoints require authenticated identity
router.use(AuthMiddleware.authenticateToken);

// Role & Permission Metadata (Audited and accessible to authority roles)
router.get('/roles', AuthMiddleware.requirePermission('users:read'), RbacController.getRoles);
router.get('/permissions', AuthMiddleware.requirePermission('users:read'), RbacController.getPermissions);

// User Accounts Roster
router.get('/users', AuthMiddleware.requirePermission('users:read'), RbacController.getUsers);

// Role Assignment (Strict Anti-Privilege Escalation)
router.put('/users/:id/role', AuthMiddleware.requirePermission('users:roles'), RbacController.updateUserRole);

// Account Lifecycle (Activate / Suspend / Deactivate)
router.put('/users/:id/status', AuthMiddleware.requirePermission('users:status'), RbacController.updateUserStatus);

// Security Audit Logs
router.get('/audit-logs', AuthMiddleware.requirePermission('audit:view_logs'), RbacController.getAuditLogs);

export default router;
