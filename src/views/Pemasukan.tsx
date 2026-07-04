import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IncomeForm } from "@/components/forms/IncomeForm";
import { IncomeTable } from "@/components/tables/IncomeTable";
import { useIncomes } from "@/hooks/useIncomes";
import { useToast } from "@/components/ui/Toast";
import { addIncome, deleteIncome, updateIncome } from "@/services/incomeService";
import type { Income, IncomeInput } from "@/types/income";

export default function Pemasukan() {
  const { incomes, isLoading } = useIncomes();
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const [deletingIncome, setDeletingIncome] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddForm = () => {
    setEditingIncome(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (income: Income) => {
    setEditingIncome(income);
    setIsFormOpen(true);
  };

  const handleSubmit = async (input: IncomeInput) => {
    try {
      if (editingIncome?.id) {
        await updateIncome(editingIncome.id, input);
        showToast("Pemasukan berhasil diperbarui.", "success");
      } else {
        await addIncome(input);
        showToast("Pemasukan berhasil ditambahkan.", "success");
      }
      setIsFormOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan pemasukan.", "error");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingIncome?.id) return;
    setIsDeleting(true);
    try {
      await deleteIncome(deletingIncome.id);
      showToast("Pemasukan berhasil dihapus.", "success");
      setDeletingIncome(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus pemasukan.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer title="Pemasukan">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Catat seluruh sumber pemasukan Anda di sini.
        </p>
        <Button onClick={openAddForm}>+ Tambah Pemasukan</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : (
        <IncomeTable incomes={incomes} onEdit={openEditForm} onDelete={setDeletingIncome} />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingIncome ? "Edit Pemasukan" : "Tambah Pemasukan"}
      >
        <IncomeForm
          initialData={editingIncome}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingIncome}
        title="Hapus Pemasukan"
        message={`Yakin ingin menghapus pemasukan "${deletingIncome?.source}"? Saldo akan disesuaikan otomatis.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingIncome(null)}
      />
    </PageContainer>
  );
}
