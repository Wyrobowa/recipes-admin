import { Pool } from 'pg';

let pool: Pool | null = null;

const getPool = () => {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const useSsl = connectionString.includes('neon.tech');

  pool = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
};

const connectPostgres = async () => {
  const client = await getPool().connect();

  try {
    await client.query('SELECT 1');
    console.log('PostgreSQL connected!');
  } finally {
    client.release();
  }
};

export { getPool, connectPostgres };
