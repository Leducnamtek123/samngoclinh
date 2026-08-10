/**
 * Format ISO/UTC date-time string or Date object into user's local timezone format.
 * Format: DD/MM/YYYY HH:mm (or according to browser locale)
 */
export function formatLocalDateTime(value?: string | Date | number | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
