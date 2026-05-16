'use client';

import { useActionState } from "react";
import { createProject, type CreateProjectState } from '@/actions/projectActions';
import Link from "next/link";

type Priority = {
  priorityId: string;
  priorityName: string;
};

type Status = {
  statusId: string;
  statusName: string;
};

type ProjectCreateFormProps = {
  priorities: Priority[];
  statuses: Status[];
};

const initialState: CreateProjectState = {
  error: undefined,
};

export default function ProjectCreateForm({
  priorities,
  statuses,
}: ProjectCreateFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProject,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="app-error-message">
          {state.error}
        </div>
      )}

      <div>
        <label className="app-form-label">プロジェクト名</label>
        <input name="projectName" className="app-form-input" placeholder="プロジェクト名を入力" />
      </div>

      <div>
        <label className="app-form-label">優先度</label>
        <select name="priorityId" defaultValue="" className="app-form-input">
          <option value="">優先度を選択してください</option>
          {priorities.map((priority) => (
            <option key={priority.priorityId} value={priority.priorityId}>
              {priority.priorityName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="app-form-label">ステータス</label>
        <select name="statusId" defaultValue="" className="app-form-input">
          <option value="">ステータスを選択してください</option>
          {statuses.map((status) => (
            <option key={status.statusId} value={status.statusId}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="app-form-label">開始日</label>
        <input type="date" name="startDate" className="app-form-input" />
      </div>
      <div>
        <label className="app-form-label">期限日</label>
        <input type="date" name="deadline" className="app-form-input" />
      </div>

      <div>
        <label className="app-form-label">説明</label>
        <textarea name="description" className="app-form-input min-h-32" placeholder="説明を入力" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="app-btn-primary">
          {isPending ? '作成中...' : '作成'}
        </button>
        <Link href={'/projects'} className="app-btn-secondary">キャンセル</Link>
      </div>
    </form>
  )
}