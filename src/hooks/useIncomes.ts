import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export function useIncomes() {
  const incomes = useLiveQuery(
    () => db.incomes.orderBy("date").reverse().toArray(),
    []
  );
  return { incomes: incomes ?? [], isLoading: incomes === undefined };
}
