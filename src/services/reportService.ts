import * as XLSX from "xlsx";
import { getAllIncomes } from "@/services/incomeService";
import { getAllExpenses } from "@/services/expenseService";
import { getAllDebtPayments, getAllDebts } from "@/services/debtService";

export type ReportPeriod = "harian" | "bulanan" | "tahunan";

export interface ReportRow {
  tanggal: string;
  jenis: "Pemasukan" | "Pengeluaran" | "Pembayaran Hutang";
  kategoriSumber: string;
  keterangan: string;
  nominal: number;
}

function periodKey(date: string, period: ReportPeriod): string {
  // date format: YYYY-MM-DD
  if (period === "harian") return date;
  if (period === "bulanan") return date.slice(0, 7); // YYYY-MM
  return date.slice(0, 4); // YYYY
}

/**
 * Mengumpulkan seluruh transaksi (pemasukan, pengeluaran, pembayaran hutang)
 * menjadi satu daftar baris laporan yang seragam, diurutkan berdasarkan tanggal.
 */
export async function buildReportRows(): Promise<ReportRow[]> {
  const [incomes, expenses, debtPayments, debts] = await Promise.all([
    getAllIncomes(),
    getAllExpenses(),
    getAllDebtPayments(),
    getAllDebts(),
  ]);

  const debtMap = new Map(debts.map((d) => [d.id, d]));

  const rows: ReportRow[] = [
    ...incomes.map((i) => ({
      tanggal: i.date,
      jenis: "Pemasukan" as const,
      kategoriSumber: i.source,
      keterangan: i.note ?? "",
      nominal: i.amount,
    })),
    ...expenses.map((e) => ({
      tanggal: e.date,
      jenis: "Pengeluaran" as const,
      kategoriSumber: e.category,
      keterangan: e.note ?? "",
      nominal: e.amount,
    })),
    ...debtPayments.map((p) => ({
      tanggal: p.date,
      jenis: "Pembayaran Hutang" as const,
      kategoriSumber: debtMap.get(p.debtId)?.title ?? "Hutang",
      keterangan: p.note ?? "",
      nominal: p.amount,
    })),
  ];

  return rows.sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

export function groupReportByPeriod(
  rows: ReportRow[],
  period: ReportPeriod
): Record<string, ReportRow[]> {
  const grouped: Record<string, ReportRow[]> = {};
  for (const row of rows) {
    const key = periodKey(row.tanggal, period);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  }
  return grouped;
}

/**
 * Export seluruh baris laporan ke file .xlsx. Setiap periode (hari/bulan/tahun)
 * mendapat sheet tersendiri, ditambah sheet "Ringkasan" berisi total per periode.
 */
export function exportReportToXlsx(rows: ReportRow[], period: ReportPeriod): void {
  const grouped = groupReportByPeriod(rows, period);
  const workbook = XLSX.utils.book_new();

  const summary: Array<{ Periode: string; Pemasukan: number; Pengeluaran: number; "Bayar Hutang": number; Saldo: number }> = [];

  for (const [key, groupRows] of Object.entries(grouped)) {
    const sheetData = groupRows.map((r) => ({
      Tanggal: r.tanggal,
      Jenis: r.jenis,
      "Kategori/Sumber": r.kategoriSumber,
      Keterangan: r.keterangan,
      Nominal: r.nominal,
    }));
    const sheet = XLSX.utils.json_to_sheet(sheetData);
    // Nama sheet Excel maksimal 31 karakter
    XLSX.utils.book_append_sheet(workbook, sheet, key.slice(0, 31));

    const pemasukan = groupRows.filter((r) => r.jenis === "Pemasukan").reduce((s, r) => s + r.nominal, 0);
    const pengeluaran = groupRows.filter((r) => r.jenis === "Pengeluaran").reduce((s, r) => s + r.nominal, 0);
    const bayarHutang = groupRows.filter((r) => r.jenis === "Pembayaran Hutang").reduce((s, r) => s + r.nominal, 0);
    summary.push({
      Periode: key,
      Pemasukan: pemasukan,
      Pengeluaran: pengeluaran,
      "Bayar Hutang": bayarHutang,
      Saldo: pemasukan - pengeluaran - bayarHutang,
    });
  }

  const summarySheet = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `laporan-${period}-dompetku-${stamp}.xlsx`);
}
