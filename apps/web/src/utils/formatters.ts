/**
 * Utility functions for date formatting, price formatting, and display string mapping.
 */

export function formatVNDPrice(amount?: number): string {
  return `${(amount || 0).toLocaleString('vi-VN')} đ`;
}

export function formatBirthDate(dateStr?: string, fallback = 'Chưa cập nhật'): string {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatInputDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return '';
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatGenderLabel(gender?: string, fallback = 'Chưa cập nhật', t?: (key: string) => string): string {
  if (!gender) return fallback;
  if (gender === 'male' || gender === 'Nam') return t ? t('male') : 'Nam';
  if (gender === 'female' || gender === 'Nữ') return t ? t('female') : 'Nữ';
  return gender;
}
