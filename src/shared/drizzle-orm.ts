import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

export async function getDb() {
  if (db) return db;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("Connected to Postgres");
  } catch (err) {
    console.error("Failed to connect to Postgres", err);
    process.exit(1);
  }

  db = drizzle(pool, { schema });
  return db;
}

export type Database = NonNullable<Awaited<ReturnType<typeof getDb>>>;

export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
    console.log("Database connection closed");
  }
}

process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);
