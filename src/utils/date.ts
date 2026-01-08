/**
 * Date formatting utility
 * 
 * Supported patterns:
 * - YYYY: Full year (2026)
 * - MM: Zero-padded month (01-12)
 * - DD: Zero-padded day (01-31)
 * - M: Month without padding (1-12)
 * - D: Day without padding (1-31)
 * 
 * Examples:
 * - 'YYYY-MM-DD' -> '2026-01-08'
 * - 'YYYY/MM/DD' -> '2026/01/08'
 * - 'MM-DD-YYYY' -> '01-08-2026'
 * - 'YYYY年MM月DD日' -> '2026年01月08日'
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, month.toString().padStart(2, '0'))
    .replace(/DD/g, day.toString().padStart(2, '0'))
    .replace(/M/g, month.toString())
    .replace(/D/g, day.toString());
}
