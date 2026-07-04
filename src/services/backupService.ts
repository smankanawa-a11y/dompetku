import { db, ensureSettings } from "@/services/db";
import type { BackupPayload } from "@/types/settings";

const BACKUP_VERSION = 1;

export async function exportBackup(): Promise<BackupPayload> {
  const [incomes, expenses, debts, debtPayments, settings] = await Promise.all([
    db.incomes.toArray(),
    db.expenses.toArray(),
    db.debts.toArray(),
    db.debtPayments.toArray(),
    ensureSettings(),
  ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    incomes,
    expenses,
    debts,
    debtPayments,
    settings,
  };
}

export function downloadBackupFile(payload: BackupPayload): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dompetku-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function isValidBackup(data: unknown): data is BackupPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.incomes) &&
    Array.isArray(d.expenses) &&
    Array.isArray(d.debts) &&
    Array.isArray(d.debtPayments) &&
    typeof d.settings === "object"
  );
}

/**
 * Import database dari file JSON. Menimpa (replace) seluruh data yang ada
 * agar konsisten -- dibungkus transaksi supaya atomik.
 */
export async function importBackup(file: File): Promise<void> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("File JSON tidak valid.");
  }
  if (!isValidBackup(parsed)) {
    throw new Error("Format file backup tidak sesuai skema Dompetku.");
  }

  await db.transaction(
    "rw",
    db.incomes,
    db.expenses,
    db.debts,
    db.debtPayments,
    db.settings,
    async () => {
      await Promise.all([
        db.incomes.clear(),
        db.expenses.clear(),
        db.debts.clear(),
        db.debtPayments.clear(),
        db.settings.clear(),
      ]);
      await db.incomes.bulkAdd(parsed.incomes);
      await db.expenses.bulkAdd(parsed.expenses);
      await db.debts.bulkAdd(parsed.debts);
      await db.debtPayments.bulkAdd(parsed.debtPayments);
      await db.settings.add(parsed.settings);
    }
  );
}

/**
 * Reset total aplikasi: mengosongkan seluruh tabel data,
 * lalu memastikan baris settings default tersedia kembali.
 */
export async function resetApplication(): Promise<void> {
  await db.transaction(
    "rw",
    db.incomes,
    db.expenses,
    db.debts,
    db.debtPayments,
    db.settings,
    async () => {
      await Promise.all([
        db.incomes.clear(),
        db.expenses.clear(),
        db.debts.clear(),
        db.debtPayments.clear(),
        db.settings.clear(),
      ]);
    }
  );
  await ensureSettings();
}
