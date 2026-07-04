export type ThemeMode = "dark" | "light";

export interface AppSettings {
  id?: number;
  theme: ThemeMode;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  incomes: import("./income").Income[];
  expenses: import("./expense").Expense[];
  debts: import("./debt").Debt[];
  debtPayments: import("./debt").DebtPayment[];
  settings: AppSettings;
}
