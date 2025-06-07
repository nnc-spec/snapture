import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  momentText: text("moment_text").notNull(),
  style: text("style").notNull(),
  generatedMemory: text("generated_memory").notNull(),
  imageUrl: text("image_url"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  memoryId: integer("memory_id").references(() => memories.id),
  amount: integer("amount").notNull(), // in cents
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memoriesRelations = relations(memories, ({ many }) => ({
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  memory: one(memories, {
    fields: [purchases.memoryId],
    references: [memories.id],
  }),
}));

export const insertMemorySchema = createInsertSchema(memories).pick({
  momentText: true,
  style: true,
});

export const generateMemorySchema = z.object({
  momentText: z.string().min(10, "Moment must be at least 10 characters").max(200, "Moment must be less than 200 characters"),
  style: z.enum(["nostalgic", "funny", "absurd", "poetic"]),
  intensity: z.number().min(1).max(5).default(3),
});

export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type GenerateMemoryRequest = z.infer<typeof generateMemorySchema>;
