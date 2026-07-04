export interface Income {
  id?: number;
  source: string; // "Gaji", "Bonus", "Lainnya", dst
  amount: number;
  date: string; // ISO date (YYYY-MM-DD)
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncomeInput = Omit<Income, "id" | "createdAt" | "updatedAt">;
