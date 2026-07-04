import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export function useExpenses() {
  const expenses = useLiveQuery(
    () => db.expenses.orderBy("date").reverse().toArray(),
    []
  );
  return { expenses: expenses ?? [], isLoading: expenses === undefined };
}
