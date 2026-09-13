/** 4-digit entry PIN generated on job confirmation — ARCHITECTURE.md §5. */
export function generateEntryPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
