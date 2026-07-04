import { PageContainer } from "@/components/layout/PageContainer";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { useBalance } from "@/hooks/useBalance";
import { useIncomes } from "@/hooks/useIncomes";
import { useExpenses } from "@/hooks/useExpenses";
import { useDebts } from "@/hooks/useDebts";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export default function Dashboard() {
  const balance = useBalance();
  const { incomes } = useIncomes();
  const { expenses } = useExpenses();
  const { debts } = useDebts();

  const recentActivity = [
    ...incomes.slice(0, 5).map((i) => ({
      id: `income-${i.id}`,
      label: i.source,
      amount: i.amount,
      date: i.date,
      type: "Pemasukan" as const,
    })),
    ...expenses.slice(0, 5).map((e) => ({
      id: `expense-${e.id}`,
      label: e.category,
      amount: -e.amount,
      date: e.date,
      type: "Pengeluaran" as const,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const activeDebts = debts.filter((d) => d.status !== "paid");

  return (
    <PageContainer title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Saldo" amount={balance.balance} icon="💼" accent="balance" />
        <SummaryCard label="Total Pendapatan" amount={balance.totalIncome} icon="💵" accent="income" />
        <SummaryCard label="Total Pengeluaran" amount={balance.totalExpense} icon="🧾" accent="expense" />
        <SummaryCard label="Sisa Hutang" amount={balance.totalDebtRemaining} icon="📋" accent="debt" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-base font-semibold">Aktivitas Terbaru</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum ada transaksi. Mulai catat pemasukan atau pengeluaran Anda.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type} • {formatDate(item.date)}
                    </p>
                  </div>
                  <span className={item.amount >= 0 ? "font-semibold text-income" : "font-semibold text-expense"}>
                    {item.amount >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(item.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-base font-semibold">Hutang Aktif</h2>
          {activeDebts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada hutang aktif. 🎉</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {activeDebts.map((debt) => (
                <li key={debt.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium">{debt.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{debt.lender}</p>
                  </div>
                  <span className="font-semibold text-debt">
                    {formatCurrency(debt.amount - debt.paidAmount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
