import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  totalDebtPaid: number;
  totalDebtRemaining: number;
  balance: number;
  isLoading: boolean;
}

/**
 * Live-query gabungan: setiap perubahan pada incomes/expenses/debtPayments/debts
 * akan otomatis memicu re-render komponen yang memakai hook ini (real-time).
 */
export function useBalance(): BalanceSummary {
  const result = useLiveQuery(async () => {
    const [incomes, expenses, debtPayments, debts] = await Promise.all([
      db.incomes.toArray(),
      db.expenses.toArray(),
      db.debtPayments.toArray(),
      db.debts.toArray(),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const totalDebtPaid = debtPayments.reduce((s, p) => s + p.amount, 0);
    const totalDebtRemaining = debts.reduce(
      (s, d) => s + (d.amount - d.paidAmount),
      0
    );

    return {
      totalIncome,
      totalExpense,
      totalDebtPaid,
      totalDebtRemaining,
      balance: totalIncome - totalExpense - totalDebtPaid,
    };
  }, []);

  return {
    totalIncome: result?.totalIncome ?? 0,
    totalExpense: result?.totalExpense ?? 0,
    totalDebtPaid: result?.totalDebtPaid ?? 0,
    totalDebtRemaining: result?.totalDebtRemaining ?? 0,
    balance: result?.balance ?? 0,
    isLoading: result === undefined,
  };
}
