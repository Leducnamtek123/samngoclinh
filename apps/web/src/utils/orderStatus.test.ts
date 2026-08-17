import { describe, it, expect } from 'vitest';
import { getOrderStatusInfo } from './orderStatus';

describe('orderStatus helper', () => {
  it('should return pending payment status info with canPay=true', () => {
    const info = getOrderStatusInfo('PENDING');
    expect(info.label).toBe('Chờ thanh toán');
    expect(info.canPay).toBeTruthy();
    expect(info.badgeClass).toContain('text-amber-800');
  });

  it('should return paid status info with canPay=false', () => {
    const info = getOrderStatusInfo('PAID');
    expect(info.label).toBe('Đã thanh toán');
    expect(info.canPay).toBeFalsy();
    expect(info.badgeClass).toContain('text-emerald-800');
  });

  it('should handle lowercase status strings seamlessly', () => {
    const info = getOrderStatusInfo('completed');
    expect(info.label).toBe('Đã giao / Hoàn thành');
    expect(info.canPay).toBeFalsy();
  });

  it('should return fallback info for undefined/unknown status', () => {
    const info = getOrderStatusInfo();
    expect(info.label).toBe('Không xác định');
    expect(info.canPay).toBeFalsy();
  });
});
