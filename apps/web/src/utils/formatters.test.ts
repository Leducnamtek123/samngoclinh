import { describe, it, expect } from 'vitest';
import { formatVNDPrice, formatBirthDate, formatGenderLabel } from './formatters';

describe('formatters utility', () => {
  it('should format VND currency string properly', () => {
    expect(formatVNDPrice(500000)).toContain('500.000');
    expect(formatVNDPrice(0)).toBe('0 đ');
    expect(formatVNDPrice(undefined)).toBe('0 đ');
  });

  it('should format birth date correctly in DD/MM/YYYY format', () => {
    expect(formatBirthDate('1995-08-15')).toBe('15/08/1995');
    expect(formatBirthDate(undefined)).toBe('Chưa cập nhật');
  });

  it('should format gender labels correctly', () => {
    expect(formatGenderLabel('male')).toBe('Nam');
    expect(formatGenderLabel('female')).toBe('Nữ');
    expect(formatGenderLabel('other')).toBe('other');
  });
});
