import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { todayISO } from "@/utils/formatDate";
import type { Debt, DebtPaymentInput } from "@/types/debt";

interface DebtPaymentFormProps {
  debt: Debt;
  onSubmit: (input: DebtPaymentInput) => Promise<void>;
  onCancel: () => void;
}

export function DebtPaymentForm({ debt, onSubmit, onCancel }: DebtPaymentFormProps) {
  const remaining = debt.amount - debt.paidAmount;
  const [amount, setAmount] = useState(remaining.toString());
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0)
      return setError("Nominal pembayaran harus lebih besar dari 0.");
    if (numericAmount > remaining)
      return setError(`Nominal melebihi sisa hutang (${formatCurrency(remaining)}).`);

    setIsLoading(true);
    try {
      await onSubmit({
        debtId: debt.id!,
        amount: numericAmount,
        date,
        note: note.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Sisa hutang saat ini: <span className="font-semibold text-debt">{formatCurrency(remaining)}</span>
      </p>
      {error && (
        <p role="alert" className="rounded-lg bg-expense/10 p-2 text-sm text-expense">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Nominal Bayar (Rp)</label>
        <input
          type="number"
          min="0"
          max={remaining}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tanggal Bayar</label>
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Bayar Hutang
        </Button>
      </div>
    </form>
  );
}
