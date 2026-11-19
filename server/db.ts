import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mcet_hostel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Checks connection status to MySQL and inspects existing tables
 */
export async function checkDatabaseConnection(): Promise<DbStatus> {
  const status: DbStatus = {
    connected: false,
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
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
 * Generic query executor
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const activePool = getPool();
  const [results] = await activePool.query(sql, params);
  return results as T;
}
