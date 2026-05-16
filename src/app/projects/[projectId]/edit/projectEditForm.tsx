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
        <div className="app-error-message">
          {state.error}
        </div>
      )}

      <input type="hidden" name="projectId" value={project.projectId} />

      <div>
        <label className="app-form-label">プロジェクト名</label>
        <input
          name="projectName"
          defaultValue={project.projectName}
          className="app-form-input"
          placeholder="プロジェクト名を入力"
        />
      </div>

      <div>
        <label className="app-form-label">優先度</label>
        <select
          name="priorityId"
          defaultValue={project.priorityId}
          className="app-form-input"
        >
          {priorities.map((priority) => (
            <option key={priority.priorityId} value={priority.priorityId}>
              {priority.priorityName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="app-form-label">ステータス</label>
        <select
          name="statusId"
          defaultValue={project.statusId}
          className="app-form-input"
        >
          {statuses.map((status) => (
            <option key={status.statusId} value={status.statusId}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="app-form-label">開始日</label>
        <input
          type="date"
          name="startDate"
          defaultValue={formatDateForInput(project.startDate)}
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">期限日</label>
        <input
          type="date"
          name="deadline"
          defaultValue={formatDateForInput(project.deadline)}
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">説明</label>
        <textarea
          name="description"
          defaultValue={project.description ?? ''}
          className="app-form-input min-h-32"
          placeholder="説明を入力"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="app-btn-primary"
        >
          {isPending ? '更新中...' : '更新'}
        </button>

        <Link
          href={`/projects/${project.projectId}`}
          className="app-btn-secondary"
        >
          詳細へ戻る
        </Link>
      </div>
    </form>
  );
}