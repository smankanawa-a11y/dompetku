import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DebtForm } from "@/components/forms/DebtForm";
import { DebtPaymentForm } from "@/components/forms/DebtPaymentForm";
import { DebtTable } from "@/components/tables/DebtTable";
import { useDebts } from "@/hooks/useDebts";
import { useToast } from "@/components/ui/Toast";
import { addDebt, deleteDebt, payDebt, updateDebt } from "@/services/debtService";
import type { Debt, DebtInput, DebtPaymentInput } from "@/types/debt";

export default function Hutang() {
  const { debts, isLoading } = useDebts();
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | undefined>();
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null);
  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddForm = () => {
    setEditingDebt(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (debt: Debt) => {
    setEditingDebt(debt);
    setIsFormOpen(true);
  };

  const handleSubmit = async (input: DebtInput) => {
    try {
      if (editingDebt?.id) {
        await updateDebt(editingDebt.id, input);
        showToast("Hutang berhasil diperbarui.", "success");
      } else {
        await addDebt(input);
        showToast("Hutang berhasil dicatat.", "success");
      }
      setIsFormOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan hutang.", "error");
      throw err;
    }
  };

  const handlePayment = async (input: DebtPaymentInput) => {
    try {
      await payDebt(input);
      showToast("Pembayaran hutang berhasil dicatat. Saldo diperbarui.", "success");
      setPayingDebt(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mencatat pembayaran.", "error");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingDebt?.id) return;
    setIsDeleting(true);
    try {
      await deleteDebt(deletingDebt.id);
      showToast("Hutang berhasil dihapus.", "success");
      setDeletingDebt(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus hutang.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer title="Hutang">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Catat hutang, keperluan pembelian, dan sumber hutang.
        </p>
        <Button onClick={openAddForm}>+ Tambah Hutang</Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : (
        <DebtTable
          debts={debts}
          onPay={setPayingDebt}
          onEdit={openEditForm}
          onDelete={setDeletingDebt}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingDebt ? "Edit Hutang" : "Tambah Hutang"}
      >
        <DebtForm
          initialData={editingDebt}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {payingDebt && (
        <Modal isOpen={!!payingDebt} onClose={() => setPayingDebt(null)} title={`Bayar: ${payingDebt.title}`}>
          <DebtPaymentForm
            debt={payingDebt}
            onSubmit={handlePayment}
            onCancel={() => setPayingDebt(null)}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deletingDebt}
        title="Hapus Hutang"
        message={`Yakin ingin menghapus hutang "${deletingDebt?.title}"? Seluruh riwayat pembayarannya akan ikut terhapus.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDebt(null)}
      />
    </PageContainer>
  );
}
