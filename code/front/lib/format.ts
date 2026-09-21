export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "2026-11-05" ou "2026-11-05T10:35:00-03:00" -> "05/11" (sem converter fuso). */
export function formatDay(iso: string): string {
  const [, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}`;
}

/** "2026-11-05T10:35:00-03:00" -> "10:35" (horário local do aeroporto, como vem da API). */
export function formatTime(iso: string): string {
  return iso.slice(11, 16);
}
