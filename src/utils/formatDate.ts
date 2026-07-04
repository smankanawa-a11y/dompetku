export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
