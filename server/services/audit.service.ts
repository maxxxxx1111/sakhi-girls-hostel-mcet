import { query } from '../db';
import { AuditSeverity, SecurityAuditLogEntry } from '../types/auth.types';

// In-memory buffer fallback
const inMemoryAuditLogs: SecurityAuditLogEntry[] = [];

export interface LogAuditOptions {
  userId?: string | null;
  eventType: string;
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  details?: Record<string, any>;
}

export class AuditService {
  /**
   * Records a security audit event in the database
   */
  static async logEvent(options: LogAuditOptions): Promise<void> {
    const logId = `sec-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const severity = options.severity || 'INFO';
    const timestamp = new Date().toISOString();

    const entry: SecurityAuditLogEntry = {
      log_id: logId,
      user_id: options.userId || null,
      event_type: options.eventType,
      severity,
      ip_address: options.ipAddress,
      user_agent: options.userAgent,
      endpoint: options.endpoint,
      details: options.details,
      created_at: timestamp,
    };

    inMemoryAuditLogs.unshift(entry);
    if (inMemoryAuditLogs.length > 500) {
      inMemoryAuditLogs.pop();
    }

    try {
      await query(
        `INSERT INTO security_audit_logs 
          (log_id, user_id, event_type, severity, ip_address, user_agent, endpoint, details) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          logId,
          options.userId || null,
          options.eventType,
          severity,
          options.ipAddress || null,
          options.userAgent || null,
          options.endpoint || null,
          options.details ? JSON.stringify(options.details) : null,
        ]
      );
    } catch (err: any) {
      console.warn('[AuditService] Failed to persist audit log to MySQL:', err.message);
    }
  }

  /**
   * Retrieves security audit logs for administrators
   */
  static async getLogs(limit = 100, severity?: string): Promise<SecurityAuditLogEntry[]> {
    try {
      let sql = 'SELECT * FROM security_audit_logs';
      const params: any[] = [];

      if (severity) {
        sql += ' WHERE severity = ?';
        params.push(severity);
      }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const rows = await query<any[]>(sql, params);
      if (Array.isArray(rows) && rows.length > 0) {
        return (rows as any[]).map((r) => ({
          ...r,
          details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details,
        }));
      }
    } catch (err: any) {
      console.warn('[AuditService] Reading logs from MySQL failed, falling back to buffer:', err.message);
    }

    return inMemoryAuditLogs.slice(0, limit);
  }
}
