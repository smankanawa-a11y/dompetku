import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import type { Expense } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
        Belum ada data pengeluaran. Tambahkan pengeluaran pertama Anda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Catatan</th>
            <th className="px-4 py-3 text-right">Nominal</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 font-medium">{expense.category}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{expense.note || "-"}</td>
              <td className="px-4 py-3 text-right font-semibold text-expense">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(expense)}
                  className="mr-2 text-balance hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense)}
                  className="text-expense hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
