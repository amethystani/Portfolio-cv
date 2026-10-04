/** "02/25/26" -> "February 25, 2026" (two-digit years are read as 20xx). */
export function longDate(mmddyy: string): string {
  const [m, d, y] = mmddyy.split('/').map(Number);
  return new Date(Date.UTC(2000 + y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
