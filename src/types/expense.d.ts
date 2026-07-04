export interface Expense {
  id?: number;
  category: string; // "Kebutuhan Rumah Tangga", "Transportasi", dst
  amount: number;
  date: string; // ISO date (YYYY-MM-DD)
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt">;
