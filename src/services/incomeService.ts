import { db } from "@/services/db";
import type { Income, IncomeInput } from "@/types/income";

/**
 * Semua operasi di sini idempoten terhadap error: jika Dexie melempar,
 * exception diteruskan ke caller (hook) agar bisa ditangani via try-catch
 * dan ditampilkan ke user lewat Toast.
 */
export async function addIncome(input: IncomeInput): Promise<number> {
  const now = new Date().toISOString();
  return db.incomes.add({ ...input, createdAt: now, updatedAt: now });
}

export async function updateIncome(
  id: number,
  input: Partial<IncomeInput>
): Promise<void> {
  await db.incomes.update(id, { ...input, updatedAt: new Date().toISOString() });
}

export async function deleteIncome(id: number): Promise<void> {
  await db.incomes.delete(id);
}

export async function getAllIncomes(): Promise<Income[]> {
  return db.incomes.orderBy("date").reverse().toArray();
}
