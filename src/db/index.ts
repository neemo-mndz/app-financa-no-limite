import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL is not defined. Please set it in your .env.local file.\n" +
          "Example: DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require"
      );
    }
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Lazy proxy: only connects to the database when a method is actually called
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    const instance = getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (instance as any)[prop];
  },
});
