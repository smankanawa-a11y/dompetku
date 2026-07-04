import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { todayISO } from "@/utils/formatDate";
import type { Expense, ExpenseInput } from "@/types/expense";

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (input: ExpenseInput) => Promise<void>;
  onCancel: () => void;
}

export function ExpenseForm({ initialData, onSubmit, onCancel }: ExpenseFormProps) {
  const [category, setCategory] = useState(initialData?.category ?? "Kebutuhan Rumah Tangga");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [date, setDate] = useState(initialData?.date ?? todayISO());
  const [note, setNote] = useState(initialData?.note ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!category.trim()) return setError("Kategori pengeluaran wajib diisi.");
    if (!numericAmount || numericAmount <= 0)
      return setError("Nominal harus lebih besar dari 0.");
    if (!date) return setError("Tanggal wajib diisi.");

    setIsLoading(true);
    try {
      await onSubmit({ category: category.trim(), amount: numericAmount, date, note: note.trim() || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-lg bg-expense/10 p-2 text-sm text-expense">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Kategori Pengeluaran</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kebutuhan Rumah Tangga, Transportasi..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nominal (Rp)</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Catatan (opsional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan tambahan"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
