// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Path to the Drizzle schema files
  schema: './src/db/schema.ts',
  // Directory where migration files will be generated
  out: './drizzle',
  // Target SQL dialect – Supabase runs PostgreSQL
  dialect: 'postgresql',
  // Database credentials – read from the environment (DATABASE_URL)
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
