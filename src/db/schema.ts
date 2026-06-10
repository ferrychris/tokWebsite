import { pgTable, serial, text, varchar, bigint, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const platformStats = pgTable('platform_stats', {
  id: bigint('id', { mode: 'number' }).primaryKey().default(1),
  streamsHosted: bigint('streams_hosted', { mode: 'number' }).notNull().default(0),
  averageGrowth: integer('average_growth').notNull().default(0),
  paidToCreators: bigint('paid_to_creators', { mode: 'number' }).notNull().default(0),
});
