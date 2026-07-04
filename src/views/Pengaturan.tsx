import { useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useToast } from "@/components/ui/Toast";
import { downloadBackupFile, exportBackup, importBackup, resetApplication } from "@/services/backupService";

export default function Pengaturan() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const payload = await exportBackup();
      downloadBackupFile(payload);
      showToast("Backup database (.json) berhasil diunduh.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal membuat backup.", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setIsImportConfirmOpen(true);
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;
    setIsImporting(true);
    try {
      await importBackup(pendingFile);
      showToast("Database berhasil diimpor. Data lama telah digantikan.", "success");
      setIsImportConfirmOpen(false);
      setPendingFile(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengimpor database.", "error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetApplication();
      showToast("Aplikasi berhasil direset ke kondisi awal.", "success");
      setIsResetConfirmOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mereset aplikasi.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PageContainer title="Pengaturan">
      <div className="flex flex-col gap-4">
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-1 text-base font-semibold">Tampilan</h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Pilih tema terang atau gelap sesuai kenyamanan Anda.
          </p>
          <ThemeToggle />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-1 text-base font-semibold">Backup Database</h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Unduh seluruh data (pemasukan, pengeluaran, hutang, pengaturan) sebagai file JSON.
          </p>
          <Button onClick={handleBackup} isLoading={isBackingUp}>
            ⬇ Backup Database (.json)
          </Button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-1 text-base font-semibold">Import Database</h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Impor file backup JSON. <span className="font-medium text-expense">Seluruh data yang ada saat ini akan digantikan.</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileSelected}
            className="hidden"
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            ⬆ Pilih File Backup (.json)
          </Button>
        </section>

        <section className="rounded-xl border border-expense/30 bg-expense/5 p-4">
          <h2 className="mb-1 text-base font-semibold text-expense">Zona Berbahaya</h2>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            Reset aplikasi akan menghapus seluruh data pemasukan, pengeluaran, dan hutang secara permanen.
          </p>
          <Button variant="danger" onClick={() => setIsResetConfirmOpen(true)}>
            Reset Aplikasi
          </Button>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isImportConfirmOpen}
        title="Import Database"
        message={`File "${pendingFile?.name}" akan menggantikan seluruh data yang ada saat ini. Lanjutkan?`}
        confirmLabel="Import"
        isLoading={isImporting}
        onConfirm={handleConfirmImport}
        onCancel={() => {
          setIsImportConfirmOpen(false);
          setPendingFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Aplikasi"
        message="Tindakan ini tidak dapat dibatalkan. Seluruh data akan dihapus permanen. Pastikan Anda sudah membuat backup jika diperlukan."
        confirmLabel="Ya, Reset"
        isLoading={isResetting}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </PageContainer>
  );
}
