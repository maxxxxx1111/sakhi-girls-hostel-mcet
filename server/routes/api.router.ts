import { Router } from 'express';
import authRoutes from './auth.routes';
import rbacRoutes from './rbac.routes';
import studentRoutes from './student.routes';
import roomRoutes from './room.routes';
import leaveRoutes from './leave.routes';
import complaintRoutes from './complaint.routes';
import messRoutes from './mess.routes';
import analyticsRoutes from './analytics.routes';
import dbRoutes from './db.routes';
import whatsappRoutes from './whatsapp.routes';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Sakhi Girls Hostel Collegiate ERP',
    version: '4.8.0',
    timestamp: new Date().toISOString(),
  });
});

// Authentication & RBAC Authorization Subsystem
apiRouter.use('/auth', authRoutes);
apiRouter.use('/rbac', rbacRoutes);

// Domain Routes
apiRouter.use('/students', studentRoutes);
apiRouter.use('/rooms', roomRoutes);
apiRouter.use('/leaves', leaveRoutes);
apiRouter.use('/complaints', complaintRoutes);
apiRouter.use('/mess', messRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/db', dbRoutes);
apiRouter.use('/whatsapp', whatsappRoutes);

export default apiRouter;
