import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

function getDbConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20,
    };
  }

  const isSupabasePooler = process.env.DB_HOST?.includes('pooler.supabase.com');
  const isSupabase = process.env.DB_HOST?.includes('supabase.co');
  
  const config: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT 
      ? Number(process.env.DB_PORT) 
      : (isSupabasePooler ? 6543 : 5432),
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  };

  if (isSupabase || process.env.NODE_ENV === 'production') {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

const pool = new Pool(getDbConfig());

pool.on('error', (err: Error) => {
  console.error('Database connection error:', err);
});

pool.query('SELECT NOW()')
  .catch((err: any) => {
    console.error('Database connection failed:', err.message);
  });

export default pool;