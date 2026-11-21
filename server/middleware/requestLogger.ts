import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();

  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(1);
    const status = res.statusCode;
    const isError = status >= 400;

    // Suppress verbose dev asset logs, log only /api routes
    if (req.originalUrl.startsWith('/api')) {
      const logMsg = `[API] ${req.method} ${req.originalUrl} - ${status} (${duration}ms)`;
      if (isError) {
        console.warn(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  });

  next();
}
