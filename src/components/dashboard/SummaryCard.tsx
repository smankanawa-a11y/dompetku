import { formatCurrency } from "@/utils/formatCurrency";

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: string;
  accent: "income" | "expense" | "debt" | "balance";
}

const accentClasses: Record<string, string> = {
  income: "border-income/30 bg-income/5 text-income",
  expense: "border-expense/30 bg-expense/5 text-expense",
  debt: "border-debt/30 bg-debt/5 text-debt",
  balance: "border-balance/30 bg-balance/5 text-balance",
};

export function SummaryCard({ label, amount, icon, accent }: SummaryCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${accentClasses[accent]} bg-white dark:bg-gray-900`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span aria-hidden="true" className="text-xl">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold">{formatCurrency(amount)}</p>
    </div>
  );
}
