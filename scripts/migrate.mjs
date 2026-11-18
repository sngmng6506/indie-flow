import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
try {
  const body = await readFile(new URL('../sql/001_init.sql', import.meta.url), 'utf8');
  await sql.unsafe(body);
  console.log('Database schema ready');
} finally { await sql.end(); }
