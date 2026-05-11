'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  updateProject,
  type UpdateProjectState,
} from '@/actions/projectActions';

type Priority = {
  priorityId: string;
  priorityName: string;
};

type Status = {
  statusId: string;
  statusName: string;
};

type ProjectEditFormProps = {
  project: {
    projectId: string;
    projectName: string;
    description: string | null;
    priorityId: string;
    statusId: string;
    startDate: Date | null;
    deadline: Date | null;
  };
  priorities: Priority[];
  statuses: Status[];
};

const initialState: UpdateProjectState = {
  error: undefined,
};

function formatDateForInput(date: Date | null) {
  if (!date) return '';

  return date.toISOString().split('T')[0];
}

export default function ProjectEditForm({
  project,
  priorities,
  statuses,
}: ProjectEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProject,
    initialState
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const result = window.confirm('本当に更新しますか？');

    if (!result) {
      event.preventDefault();
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      {state.error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="projectId" value={project.projectId} />

      <div>
        <label className="mb-1 block text-sm font-medium">プロジェクト名</label>
        <input
          name="projectName"
          defaultValue={project.projectName}
          className="w-full rounded border px-3 py-2"
          placeholder="プロジェクト名を入力"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">優先度</label>
        <select
          name="priorityId"
          defaultValue={project.priorityId}
          className="w-full rounded border px-3 py-2"
        >
          {priorities.map((priority) => (
            <option key={priority.priorityId} value={priority.priorityId}>
              {priority.priorityName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">ステータス</label>
        <select
          name="statusId"
          defaultValue={project.statusId}
          className="w-full rounded border px-3 py-2"
        >
          {statuses.map((status) => (
            <option key={status.statusId} value={status.statusId}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">開始日</label>
        <input
          type="date"
          name="startDate"
          defaultValue={formatDateForInput(project.startDate)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">期限日</label>
        <input
          type="date"
          name="deadline"
          defaultValue={formatDateForInput(project.deadline)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明</label>
        <textarea
          name="description"
          defaultValue={project.description ?? ''}
          className="w-full rounded border px-3 py-2"
          placeholder="説明を入力"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? '更新中...' : '更新'}
        </button>

        <Link
          href={`/projects/${project.projectId}`}
          className="rounded border px-4 py-2 text-sm"
        >
          詳細へ戻る
        </Link>
      </div>
    </form>
  );
}