import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime } from '../dateFormat';

describe('formatDate', () => {
  it('dateがnullの場合fallbackを返す', () => {
    expect(formatDate(null)).toBe('未設定');
  });

  it('fallbackを指定できる', () => {
    expect(formatDate(null, '未完了')).toBe('未完了');
  });

  it('Dateをja-JP形式の日付文字列に変換する', () => {
    const date = new Date('2026-05-19T00:00:00');

    expect(formatDate(date)).toBe(date.toLocaleDateString('ja-JP'));
  });
});

describe('formatDateTime', () => {
  it('dateがnullの場合fallbackを返す', () => {
    expect(formatDateTime(null)).toBe('未設定');
  });

  it('Dateをja-JP形式の日時文字列に変換する', () => {
    const date = new Date('2026-05-19T10:30:00');

    expect(formatDateTime(date)).toBe(date.toLocaleString('ja-JP'));
  });
});