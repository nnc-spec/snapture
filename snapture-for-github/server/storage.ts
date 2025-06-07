import { memories, purchases, type Memory, type InsertMemory, type Purchase } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Memory operations
  createMemory(memory: Omit<InsertMemory, 'id'> & { generatedMemory: string; imageUrl?: string; isPremium?: boolean }): Promise<Memory>;
  getMemory(id: number): Promise<Memory | undefined>;
  updateMemoryPremiumStatus(id: number, isPremium: boolean): Promise<Memory | undefined>;
  updateMemoryImageUrl(id: number, imageUrl: string): Promise<Memory | undefined>;
  
  // Purchase operations
  createPurchase(purchase: Omit<Purchase, 'id' | 'createdAt'>): Promise<Purchase>;
  getPurchaseByMemoryId(memoryId: number): Promise<Purchase | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getMemory(id: number): Promise<Memory | undefined> {
    const [memory] = await db.select().from(memories).where(eq(memories.id, id));
    return memory || undefined;
  }

  async createMemory(memoryData: Omit<InsertMemory, 'id'> & { generatedMemory: string; imageUrl?: string; isPremium?: boolean }): Promise<Memory> {
    const [memory] = await db
      .insert(memories)
      .values({
        momentText: memoryData.momentText,
        style: memoryData.style,
        generatedMemory: memoryData.generatedMemory,
        imageUrl: memoryData.imageUrl,
        isPremium: memoryData.isPremium || false,
      })
      .returning();
    return memory;
  }

  async updateMemoryPremiumStatus(id: number, isPremium: boolean): Promise<Memory | undefined> {
    const [memory] = await db
      .update(memories)
      .set({ isPremium })
      .where(eq(memories.id, id))
      .returning();
    return memory || undefined;
  }

  async updateMemoryImageUrl(id: number, imageUrl: string): Promise<Memory | undefined> {
    const [memory] = await db
      .update(memories)
      .set({ imageUrl })
      .where(eq(memories.id, id))
      .returning();
    return memory || undefined;
  }

  async createPurchase(purchaseData: Omit<Purchase, 'id' | 'createdAt'>): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(purchaseData)
      .returning();
    return purchase;
  }

  async getPurchaseByMemoryId(memoryId: number): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.memoryId, memoryId));
    return purchase || undefined;
  }
}

export const storage = new DatabaseStorage();
