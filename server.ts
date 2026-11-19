import express from 'express';
import path from 'path';
import fs from 'fs';
import { checkDatabaseConnection, query } from './server/db';

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const PORT = 3000;

  app.use(express.json());

  // Health check API for container readiness and liveness probes
  app.get(['/api/health', '/healthz', '/health'], (_req, res) => {
    res.json({ status: 'ok', service: 'Nestos Campus Residence Hub' });
  });

  // MySQL Workbench & Database Connectivity Status API
  app.get('/api/db/status', async (_req, res) => {
    const status = await checkDatabaseConnection();
    res.json(status);
  });

  // Execute SQL Query directly against MySQL
  app.post('/api/db/query', async (req, res) => {
    const { sql } = req.body;
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ error: 'SQL query string is required' });
    }

    // Safety: prevent multiple destructive statements from raw client execution if unwanted
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('DROP DATABASE') || trimmed.startsWith('SHUTDOWN')) {
      return res.status(403).json({ error: 'Administrative command restricted' });
    }

    try {
      const startTime = performance.now();
      const results = await query(sql);
      const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));
      res.json({
        success: true,
        executionTimeMs,
        rowCount: Array.isArray(results) ? results.length : 1,
        results,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'SQL execution failed',
        code: err.code,
      });
    }
  });

  // Provide raw schema.sql for MySQL Workbench
  app.get('/api/db/schema-sql', (_req, res) => {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.sendFile(schemaPath);
    } else {
      res.status(404).send('schema.sql not found');
    }
  });

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nestos server listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
