import express from 'express';
import path from 'path';
import fs from 'fs';
import { config } from './server/config';
import { requestLogger } from './server/middleware/requestLogger';
import { errorHandler } from './server/middleware/errorHandler';
import apiRouter from './server/routes/api.router';

async function startServer() {
  const app = express();
  const isProduction = config.env === 'production';

  // Core Middleware
  app.use(express.json());
  app.use(requestLogger);

  // Health check routes
  app.get(['/healthz', '/health'], (_req, res) => {
    res.json({ status: 'ok', service: 'Sakhi Girls Hostel Residential Hub' });
  });

  // Enterprise API Router
  app.use('/api', apiRouter);

  // Frontend SPA Integration (Vite Middleware in dev / Static hosting in prod)
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    const resolvedDist = fs.existsSync(path.join(distPath, 'index.html'))
      ? distPath
      : path.resolve(__dirname);

    app.use(express.static(resolvedDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(resolvedDist, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Sakhi Girls Hostel ERP server listening on http://0.0.0.0:${config.port} (${config.env})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
