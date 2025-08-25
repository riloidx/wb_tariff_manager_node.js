export function getTodayFormattedDate(): string {
  const today = new Date();
  const year = today.getFullYear();


  const month = String(today.getMonth() + 1).padStart(2, "0");


  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseWbNumber(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  const trimmed = String(input).trim();
  if (trimmed === "-" || trimmed === "") return null;
  const normalized = trimmed.replace(/\s+/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}