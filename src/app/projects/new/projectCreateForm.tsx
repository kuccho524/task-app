'use client';

import { useActionState } from "react";
import { createProject, type CreateProjectState } from '@/actions/projectActions';
import { error } from "console";

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
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">プロジェクト名</label>
        <input name="projectName" className="w-full rounded border px-3 py-2" placeholder="プロジェクト名を入力" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">優先度</label>
        <select name="priorityId" defaultValue="" className="w-full rounded border px-3 py-2">
          <option value="">優先度を選択してください</option>
          {priorities.map((priority) => (
            <option key={priority.priorityId} value={priority.priorityId}>
              {priority.priorityName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">ステータス</label>
        <select name="statusId" defaultValue="" className="w-full rounded border px-3 py-2">
          <option value="">ステータスを選択してください</option>
          {statuses.map((status) => (
            <option key={status.statusId} value={status.statusId}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">開始日</label>
        <input type="date" name="startDate" className="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">期限日</label>
        <input type="date" name="deadline" className="w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明</label>
        <textarea name="description" className="w-full rounded border px-3 py-2" placeholder="説明を入力" />
      </div>

      <button type="submit" disabled={isPending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {isPending ? '作成中...' : '作成'}
      </button>
    </form>
  )
}