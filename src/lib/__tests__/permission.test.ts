import { describe, expect, it } from 'vitest';
import { canDeleteProject, canEditResource } from '../permission';

describe('canEditResource', () => {
  it('作成者とログインユーザーが一致する場合trueを返す', () => {
    expect(canEditResource('user001', 'user001')).toBe(true);
  });

  it('作成者とログインユーザーが一致しない場合falseを返す', () => {
    expect(canEditResource('user001', 'user002')).toBe(false);
  });
});

describe('canDeleteProject', () => {
  it('関連Taskが0件の場合trueを返す', () => {
    expect(canDeleteProject(0)).toBe(true);
  });

  it('関連Taskが1件以上ある場合falseを返す', () => {
    expect(canDeleteProject(1)).toBe(false);
  });
});