import Dexie, { type Table } from "dexie";
import type { Income } from "@/types/income";
import type { Expense } from "@/types/expense";
import type { Debt, DebtPayment } from "@/types/debt";
import type { AppSettings } from "@/types/settings";

export class DompetkuDB extends Dexie {
  incomes!: Table<Income, number>;
  expenses!: Table<Expense, number>;
  debts!: Table<Debt, number>;
  debtPayments!: Table<DebtPayment, number>;
  settings!: Table<AppSettings, number>;

  constructor() {
    super("dompetku-db");
    this.version(1).stores({
      incomes: "++id, source, date, createdAt",
      expenses: "++id, category, date, createdAt",
      debts: "++id, title, lender, status, date, createdAt",
      debtPayments: "++id, debtId, date, createdAt",
      settings: "++id",
    });
  }
}

export const db = new DompetkuDB();

/**
 * Memastikan selalu ada satu baris settings (singleton).
 * Dipanggil sekali saat aplikasi start.
 */
export async function ensureSettings(): Promise<AppSettings> {
  const existing = await db.settings.toCollection().first();
  if (existing) return existing;
  const id = await db.settings.add({ theme: "light" });
  return { id, theme: "light" };
}
