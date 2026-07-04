import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  buildReportRows,
  exportReportToXlsx,
  groupReportByPeriod,
  type ReportPeriod,
  type ReportRow,
} from "@/services/reportService";

interface LaporanPageProps {
  title: string;
  period: ReportPeriod;
}

export function LaporanPage({ title, period }: LaporanPageProps) {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    buildReportRows()
      .then((r) => {
        if (isMounted) setRows(r);
      })
      .catch((err) => showToast(err instanceof Error ? err.message : "Gagal memuat laporan.", "error"))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => groupReportByPeriod(rows, period), [rows, period]);
  const periodKeys = useMemo(
    () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
    [grouped]
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportReportToXlsx(rows, period);
      showToast("Laporan berhasil diunduh (.xlsx).", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengekspor laporan.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageContainer title={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ringkasan transaksi dikelompokkan per {period === "harian" ? "hari" : period === "bulanan" ? "bulan" : "tahun"}.
        </p>
        <Button onClick={handleExport} isLoading={isExporting} disabled={rows.length === 0}>
          ⬇ Export ke Excel (.xlsx)
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Memuat laporan...</p>
      ) : periodKeys.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
          Belum ada transaksi untuk ditampilkan.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {periodKeys.map((key) => {
            const groupRows = grouped[key];
            const income = groupRows.filter((r) => r.jenis === "Pemasukan").reduce((s, r) => s + r.nominal, 0);
            const expense = groupRows.filter((r) => r.jenis === "Pengeluaran").reduce((s, r) => s + r.nominal, 0);
            const debtPaid = groupRows.filter((r) => r.jenis === "Pembayaran Hutang").reduce((s, r) => s + r.nominal, 0);

            return (
              <details key={key} className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" open={periodKeys[0] === key}>
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4 text-sm font-semibold">
                  <span>{key}</span>
                  <span className="flex gap-3 text-xs font-normal">
                    <span className="text-income">+{formatCurrency(income)}</span>
                    <span className="text-expense">-{formatCurrency(expense + debtPaid)}</span>
                    <span className="text-balance">Saldo periode: {formatCurrency(income - expense - debtPaid)}</span>
                  </span>
                </summary>
                <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-2">Tanggal</th>
                        <th className="px-4 py-2">Jenis</th>
                        <th className="px-4 py-2">Kategori/Sumber</th>
                        <th className="px-4 py-2">Keterangan</th>
                        <th className="px-4 py-2 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {groupRows.map((row, idx) => (
                        <tr key={`${key}-${idx}`}>
                          <td className="px-4 py-2 whitespace-nowrap">{row.tanggal}</td>
                          <td className="px-4 py-2">{row.jenis}</td>
                          <td className="px-4 py-2">{row.kategoriSumber}</td>
                          <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{row.keterangan || "-"}</td>
                          <td
                            className={`px-4 py-2 text-right font-medium ${
                              row.jenis === "Pemasukan" ? "text-income" : "text-expense"
                            }`}
                          >
                            {row.jenis === "Pemasukan" ? "+" : "-"}
                            {formatCurrency(row.nominal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
