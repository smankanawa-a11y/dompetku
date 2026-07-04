import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import type { Income } from "@/types/income";

interface IncomeTableProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
}

export function IncomeTable({ incomes, onEdit, onDelete }: IncomeTableProps) {
  if (incomes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
        Belum ada data pemasukan. Tambahkan pemasukan pertama Anda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Sumber</th>
            <th className="px-4 py-3">Catatan</th>
            <th className="px-4 py-3 text-right">Nominal</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {incomes.map((income) => (
            <tr key={income.id}>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(income.date)}</td>
              <td className="px-4 py-3 font-medium">{income.source}</td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{income.note || "-"}</td>
              <td className="px-4 py-3 text-right font-semibold text-income">
                {formatCurrency(income.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(income)}
                  className="mr-2 text-balance hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(income)}
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
