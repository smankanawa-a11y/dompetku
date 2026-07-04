import { db } from "@/services/db";
import type { Debt, DebtInput, DebtPayment, DebtPaymentInput } from "@/types/debt";

function computeStatus(amount: number, paidAmount: number): Debt["status"] {
  if (paidAmount <= 0) return "unpaid";
  if (paidAmount >= amount) return "paid";
  return "partial";
}

export async function addDebt(input: DebtInput): Promise<number> {
  const now = new Date().toISOString();
  return db.debts.add({
    ...input,
    paidAmount: 0,
    status: "unpaid",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateDebt(
  id: number,
  input: Partial<DebtInput>
): Promise<void> {
  const debt = await db.debts.get(id);
  if (!debt) throw new Error("Hutang tidak ditemukan");
  const nextAmount = input.amount ?? debt.amount;
  await db.debts.update(id, {
    ...input,
    status: computeStatus(nextAmount, debt.paidAmount),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Menghapus hutang beserta seluruh riwayat pembayarannya.
 * Dibungkus transaksi agar atomik (tidak menyisakan payment yatim).
 */
export async function deleteDebt(id: number): Promise<void> {
  await db.transaction("rw", db.debts, db.debtPayments, async () => {
    await db.debtPayments.where("debtId").equals(id).delete();
    await db.debts.delete(id);
  });
}

export async function getAllDebts(): Promise<Debt[]> {
  return db.debts.orderBy("date").reverse().toArray();
}

export async function getPaymentsForDebt(debtId: number): Promise<DebtPayment[]> {
  return db.debtPayments.where("debtId").equals(debtId).reverse().sortBy("date");
}

export async function getAllDebtPayments(): Promise<DebtPayment[]> {
  return db.debtPayments.orderBy("date").reverse().toArray();
}

/**
 * Mencatat pembayaran hutang. Ini adalah operasi kritikal yang:
 * 1. Menambah baris di debtPayments (yang otomatis mengurangi saldo dashboard).
 * 2. Memperbarui paidAmount & status pada Debt terkait.
 * Dibungkus dalam satu transaksi Dexie supaya atomik: jika salah satu
 * langkah gagal, tidak ada perubahan parsial yang tersimpan.
 */
export async function payDebt(input: DebtPaymentInput): Promise<void> {
  await db.transaction("rw", db.debts, db.debtPayments, async () => {
    const debt = await db.debts.get(input.debtId);
    if (!debt) throw new Error("Hutang tidak ditemukan");

    const remaining = debt.amount - debt.paidAmount;
    if (input.amount > remaining) {
      throw new Error(
        `Pembayaran melebihi sisa hutang (sisa: ${remaining.toLocaleString("id-ID")})`
      );
    }

    await db.debtPayments.add({ ...input, createdAt: new Date().toISOString() });

    const newPaidAmount = debt.paidAmount + input.amount;
    await db.debts.update(input.debtId, {
      paidAmount: newPaidAmount,
      status: computeStatus(debt.amount, newPaidAmount),
      updatedAt: new Date().toISOString(),
    });
  });
}

export async function deleteDebtPayment(payment: DebtPayment): Promise<void> {
  await db.transaction("rw", db.debts, db.debtPayments, async () => {
    const debt = await db.debts.get(payment.debtId);
    if (!debt) throw new Error("Hutang tidak ditemukan");
    if (payment.id) await db.debtPayments.delete(payment.id);

    const newPaidAmount = Math.max(0, debt.paidAmount - payment.amount);
    await db.debts.update(payment.debtId, {
      paidAmount: newPaidAmount,
      status: computeStatus(debt.amount, newPaidAmount),
      updatedAt: new Date().toISOString(),
    });
  });
}
