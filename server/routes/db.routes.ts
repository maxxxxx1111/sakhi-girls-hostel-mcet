import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { checkDatabaseConnection, query } from '../db';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

const router = Router();

// MySQL status check
router.get('/status', async (_req, res, next) => {
  try {
    const status = await checkDatabaseConnection();
    return res.json(status);
  } catch (err) {
    next(err);
  }
});

// SQL Query execution sandbox
router.post('/query', async (req, res, next) => {
  try {
    const { sql } = req.body;
    if (!sql || typeof sql !== 'string') {
      throw ApiError.badRequest('SQL query string is required');
    }

    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('DROP DATABASE') || trimmed.startsWith('SHUTDOWN')) {
      throw ApiError.forbidden('Administrative command restricted');
    }

    const startTime = performance.now();
    const results = await query(sql);
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    return res.json({
      success: true,
      executionTimeMs,
      rowCount: Array.isArray(results) ? results.length : 1,
      results,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'SQL execution failed',
      code: err.code,
    });
  }
});

// Provide raw schema.sql
router.get('/schema-sql', (_req, res) => {
  const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(schemaPath);
  } else {
    res.status(404).send('schema.sql not found');
  }
});

export default router;
