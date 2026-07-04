import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export function useDebts() {
  const debts = useLiveQuery(() => db.debts.orderBy("date").reverse().toArray(), []);
  return { debts: debts ?? [], isLoading: debts === undefined };
}
