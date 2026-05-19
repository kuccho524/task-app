import { describe, expect, it } from 'vitest';
import {
  calculateProgressRate,
  countCompletedTasks,
  getTaskProgress,
} from '../progress';

describe('calculateProgressRate', () => {
  it('totalが0の場合は0を返す', () => {
    expect(calculateProgressRate(0, 0)).toBe(0);
  });

  it('2/5の場合は40を返す', () => {
    expect(calculateProgressRate(5, 2)).toBe(40);
  });

  it('2/3の場合は67を返す', () => {
    expect(calculateProgressRate(3, 2)).toBe(67);
  });
});

describe('countCompletedTasks', () => {
  it('完了済みTaskの件数を返す', () => {
    const tasks = [
      { status: { isCompleted: true } },
      { status: { isCompleted: false } },
      { status: { isCompleted: true } },
    ];

    expect(countCompletedTasks(tasks)).toBe(2);
  });
});

describe('getTaskProgress', () => {
  it('Taskの総数・完了数・未完了数・進捗率を返す', () => {
    const tasks = [
      { status: { isCompleted: true } },
      { status: { isCompleted: false } },
      { status: { isCompleted: true } },
    ];

    expect(getTaskProgress(tasks)).toEqual({
      totalTaskCount: 3,
      completedTaskCount: 2,
      incompleteTaskCount: 1,
      progressRate: 67,
    });
  });
});