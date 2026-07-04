import { db } from "@/services/db";
import type { Expense, ExpenseInput } from "@/types/expense";

export async function addExpense(input: ExpenseInput): Promise<number> {
  const now = new Date().toISOString();
  return db.expenses.add({ ...input, createdAt: now, updatedAt: now });
}

export async function updateExpense(
  id: number,
  input: Partial<ExpenseInput>
): Promise<void> {
  await db.expenses.update(id, { ...input, updatedAt: new Date().toISOString() });
}

export async function deleteExpense(id: number): Promise<void> {
  await db.expenses.delete(id);
}

export async function getAllExpenses(): Promise<Expense[]> {
  return db.expenses.orderBy("date").reverse().toArray();
}
