import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { ExpenseTable } from "@/components/tables/ExpenseTable";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/components/ui/Toast";
import { addExpense, deleteExpense, updateExpense } from "@/services/expenseService";
import type { Expense, ExpenseInput } from "@/types/expense";

export default function Pengeluaran() {
  const { expenses, isLoading } = useExpenses();
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddForm = () => {
    setEditingExpense(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleSubmit = async (input: ExpenseInput) => {
    try {
      if (editingExpense?.id) {
        await updateExpense(editingExpense.id, input);
        showToast("Pengeluaran berhasil diperbarui.", "success");
      } else {
        await addExpense(input);
        showToast("Pengeluaran berhasil ditambahkan.", "success");
      }
      setIsFormOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan pengeluaran.", "error");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingExpense?.id) return;
    setIsDeleting(true);
    try {
      await deleteExpense(deletingExpense.id);
      showToast("Pengeluaran berhasil dihapus.", "success");
      setDeletingExpense(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus pengeluaran.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer title="Pengeluaran">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Catat seluruh pengeluaran Anda di sini.
        </p>
        <Button onClick={openAddForm}>+ Tambah Pengeluaran</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : (
        <ExpenseTable expenses={expenses} onEdit={openEditForm} onDelete={setDeletingExpense} />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingExpense}
        title="Hapus Pengeluaran"
        message={`Yakin ingin menghapus pengeluaran "${deletingExpense?.category}"? Saldo akan disesuaikan otomatis.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingExpense(null)}
      />
    </PageContainer>
  );
}
