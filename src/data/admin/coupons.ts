import { Coupon } from '@/lib/admin-types';

export const coupons: Coupon[] = [
  { id: 'cpn_001', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minCartAmount: 25, expiryDate: '2026-12-31', usageLimit: 1000, usedCount: 234, active: true },
  { id: 'cpn_002', code: 'SUMMER20', discountType: 'percentage', discountValue: 20, minCartAmount: 50, expiryDate: '2026-08-31', usageLimit: 500, usedCount: 89, active: true },
  { id: 'cpn_003', code: 'FREESHIP', discountType: 'fixed', discountValue: 5.99, minCartAmount: 30, expiryDate: '2026-06-30', usageLimit: 300, usedCount: 156, active: true },
  { id: 'cpn_004', code: 'AUTO15', discountType: 'percentage', discountValue: 15, minCartAmount: 40, expiryDate: '2026-04-30', usageLimit: 200, usedCount: 178, active: true },
  { id: 'cpn_005', code: 'SAVE5', discountType: 'fixed', discountValue: 5, minCartAmount: 20, expiryDate: '2026-12-31', usageLimit: 0, usedCount: 412, active: true },
  { id: 'cpn_006', code: 'HOLIDAY25', discountType: 'percentage', discountValue: 25, minCartAmount: 75, expiryDate: '2025-12-31', usageLimit: 100, usedCount: 100, active: false },
  { id: 'cpn_007', code: 'VIPONLY', discountType: 'percentage', discountValue: 30, minCartAmount: 100, expiryDate: '2026-12-31', usageLimit: 50, usedCount: 12, active: true },
  { id: 'cpn_008', code: 'NEWAUTO', discountType: 'fixed', discountValue: 10, minCartAmount: 35, expiryDate: '2026-09-30', usageLimit: 250, usedCount: 67, active: true },
];

export function getCouponById(id: string): Coupon | undefined {
  return coupons.find((c) => c.id === id);
}
