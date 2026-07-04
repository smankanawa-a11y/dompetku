import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import type { Debt } from "@/types/debt";

interface DebtTableProps {
  debts: Debt[];
  onPay: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

const statusLabel: Record<Debt["status"], string> = {
  unpaid: "Belum Dibayar",
  partial: "Sebagian",
  paid: "Lunas",
};

const statusClass: Record<Debt["status"], string> = {
  unpaid: "bg-expense/10 text-expense",
  partial: "bg-debt/10 text-debt",
  paid: "bg-income/10 text-income",
};

export function DebtTable({ debts, onPay, onEdit, onDelete }: DebtTableProps) {
  if (debts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
        Belum ada catatan hutang.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Nama Hutang</th>
            <th className="px-4 py-3">Sumber</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Sisa</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {debts.map((debt) => {
            const remaining = debt.amount - debt.paidAmount;
            return (
              <tr key={debt.id}>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(debt.date)}</td>
                <td className="px-4 py-3 font-medium">
                  {debt.title}
                  {debt.itemDescription && (
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {debt.itemDescription}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">{debt.lender}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(debt.amount)}</td>
                <td className="px-4 py-3 text-right font-semibold text-debt">
                  {formatCurrency(remaining)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[debt.status]}`}>
                    {statusLabel[debt.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {debt.status !== "paid" && (
                    <button onClick={() => onPay(debt)} className="mr-2 text-income hover:underline">
                      Bayar
                    </button>
                  )}
                  <button onClick={() => onEdit(debt)} className="mr-2 text-balance hover:underline">
                    Edit
                  </button>
                  <button onClick={() => onDelete(debt)} className="text-expense hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
