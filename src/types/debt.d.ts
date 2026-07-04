export type DebtStatus = "unpaid" | "partial" | "paid";

export interface Debt {
  id?: number;
  title: string; // Nama/keperluan hutang
  itemDescription: string; // Barang/keperluan yang dibeli
  lender: string; // Sumber/tempat hutang
  amount: number; // Total nominal hutang
  paidAmount: number; // Total yang sudah dibayar
  status: DebtStatus;
  date: string; // Tanggal hutang dibuat
  createdAt: string;
  updatedAt: string;
}

export type DebtInput = Omit<
  Debt,
  "id" | "paidAmount" | "status" | "createdAt" | "updatedAt"
>;

export interface DebtPayment {
  id?: number;
  debtId: number;
  amount: number;
  date: string; // ISO date (YYYY-MM-DD)
  note?: string;
  createdAt: string;
}

export type DebtPaymentInput = Omit<DebtPayment, "id" | "createdAt">;
