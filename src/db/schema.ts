import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';


export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), 
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  summary: text('summary'), 
  tags: text('tags'),   
  createdAt: timestamp('created_at').defaultNow().notNull(),
});