import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { getPool } from '../postgres';

dotenv.config();

const MIGRATIONS_DIR = path.join(__dirname, 'sql');

const runMigrations = async () => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = (await fs.readdir(MIGRATIONS_DIR))
      .filter((file) => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      const { rowCount } = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [file]);

      if (rowCount) {
        continue;
      }

      const migrationSql = await fs.readFile(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      await client.query(migrationSql);
      await client.query('INSERT INTO schema_migrations(version) VALUES ($1)', [file]);
      await client.query('COMMIT');

      console.log(`Applied migration: ${file}`);
    }

    console.log('Migrations completed.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => null);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
