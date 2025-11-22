import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Function to parse DATABASE_URL if provided
function getDbConfig(): PoolConfig {
  // If DATABASE_URL is provided, use it (Railway/Heroku style)
  if (process.env.DATABASE_URL) {
    console.log('📦 Using DATABASE_URL connection string');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20,
    };
  }

  // Otherwise, use individual environment variables
  const isSupabasePooler = process.env.DB_HOST?.includes('pooler.supabase.com');
  const isSupabase = process.env.DB_HOST?.includes('supabase.co');
  
  const config: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // Supabase pooler uses port 6543, direct connection uses 5432
    port: process.env.DB_PORT 
      ? Number(process.env.DB_PORT) 
      : (isSupabasePooler ? 6543 : 5432),
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
  };

  // Supabase pooler and direct connections require SSL
  if (isSupabase || process.env.NODE_ENV === 'production') {
    config.ssl = { rejectUnauthorized: false };
    console.log('🔒 SSL enabled for database connection');
  }
  
  if (isSupabasePooler) {
    console.log('🌊 Using Supabase connection pooler');
  }

  // Log connection details (without password)
  console.log('📊 Database config:', {
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
    ssl: config.ssl ? 'enabled' : 'disabled',
  });

  return config;
}

const pool = new Pool(getDbConfig());

// Handle connection errors
pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Check your database credentials and connection settings');
  });

export default pool;