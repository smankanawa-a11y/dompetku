import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { todayISO } from "@/utils/formatDate";
import type { Debt, DebtInput } from "@/types/debt";

interface DebtFormProps {
  initialData?: Debt;
  onSubmit: (input: DebtInput) => Promise<void>;
  onCancel: () => void;
}

export function DebtForm({ initialData, onSubmit, onCancel }: DebtFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [itemDescription, setItemDescription] = useState(initialData?.itemDescription ?? "");
  const [lender, setLender] = useState(initialData?.lender ?? "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [date, setDate] = useState(initialData?.date ?? todayISO());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!title.trim()) return setError("Nama hutang wajib diisi.");
    if (!lender.trim()) return setError("Sumber/tempat hutang wajib diisi.");
    if (!numericAmount || numericAmount <= 0)
      return setError("Nominal harus lebih besar dari 0.");

    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        itemDescription: itemDescription.trim(),
        lender: lender.trim(),
        amount: numericAmount,
        date,
      });
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
        <label className="mb-1 block text-sm font-medium">Nama Hutang</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Misal: Pinjaman motor"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Barang/Keperluan yang Dibeli</label>
        <input
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          placeholder="Misal: Laptop kerja"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Sumber/Tempat Hutang</label>
        <input
          value={lender}
          onChange={(e) => setLender(e.target.value)}
          placeholder="Misal: Bank, Teman, Koperasi"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Total Nominal Hutang (Rp)</label>
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
