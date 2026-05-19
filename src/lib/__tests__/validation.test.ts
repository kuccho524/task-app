import { describe, expect, it } from 'vitest';
import { isValidDateRange } from '../validation';

describe('isValidDateRange', () => {
  it('開始日と期限日が両方nullならtrueを返す', () => {
    expect(isValidDateRange(null, null)).toBe(true);
  });

  it('開始日のみ指定されている場合trueを返す', () => {
    expect(isValidDateRange(new Date('2026-05-01'), null)).toBe(true);
  });

  it('期限日のみ指定されている場合trueを返す', () => {
    expect(isValidDateRange(null, new Date('2026-05-10'))).toBe(true);
  });

  it('開始日が期限日以前ならtrueを返す', () => {
    expect(
      isValidDateRange(
        new Date('2026-05-01'),
        new Date('2026-05-10')
      )
    ).toBe(true);
  });

  it('開始日が期限日より後ならfalseを返す', () => {
    expect(
      isValidDateRange(
        new Date('2026-05-10'),
        new Date('2026-05-01')
      )
    ).toBe(false);
  });
});