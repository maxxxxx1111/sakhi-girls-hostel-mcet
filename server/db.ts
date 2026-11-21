import mysql from 'mysql2/promise';
import { config } from './config';

export interface DbStatus {
  connected: boolean;
  host: string;
  port: number;
  user: string;
  database: string;
  error?: string;
  tables?: string[];
  serverVersion?: string;
}

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      multipleStatements: true,
    });
  }
  return pool;
}

/**
 * Checks connection status to MySQL and inspects existing tables
 */
export async function checkDatabaseConnection(): Promise<DbStatus> {
  const status: DbStatus = {
    connected: false,
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    database: config.db.name,
  };

  try {
    const activePool = getPool();
    const [versionRows] = await activePool.query('SELECT VERSION() AS version');
    const version = (versionRows as any[])[0]?.version;
    status.serverVersion = version;

    // Check tables in the database
    const [tableRows] = await activePool.query('SHOW TABLES');
    const tableList = (tableRows as any[]).map((r) => Object.values(r)[0] as string);
    status.tables = tableList;
    status.connected = true;
  } catch (err: any) {
    status.connected = false;
    status.error = err.message || 'Failed to connect to MySQL';
  }

  return status;
}

/**
 * Generic parameterized query executor
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const activePool = getPool();
  const [results] = await activePool.query(sql, params);
  return results as T;
}

/**
 * Transaction executor helper
 */
export async function transaction<T>(callback: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const activePool = getPool();
  const conn = await activePool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
