'use client';

import { useActionState } from "react";
import { createTask, type CreateTaskState } from "@/actions/taskActions";
import Link from "next/link";

type Priority = {
  priorityId: string;
  priorityName: string;
};

type Status = {
  statusId: string;
  statusName: string;
};

type Project = {
  projectId: string;
  projectName: string;
};

type TaskCreateFormProps = {
  priorities: Priority[];
  statuses: Status[];
  projects: Project[];
  selectedProject: Project | null;
  redirectTo?: string;
};

const initialState: CreateTaskState = {
  error: undefined,
};

export default function TaskCreateForm({
  priorities,
  statuses,
  projects,
  selectedProject,
  redirectTo,
}: TaskCreateFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTask,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

      {state.error && (
        <div className="app-error-message">
          {state.error}
        </div>
      )}

      <div>
        <label className="app-form-label">タスク名</label>
        <input
          name="taskName"
          className="app-form-input"
          placeholder="タスク名を入力"
        />
      </div>

      {selectedProject ? (
        <div>
          <label className="app-form-label">プロジェクト</label>
          <p className="rounded border bg-gray-50 px-3 py-2 text-sm">
            {selectedProject.projectName}
          </p>
          <input
            type="hidden"
            name="projectId"
            value={selectedProject.projectId}
          />
        </div>
      ) : (
        <div>
          <label className="app-form-label">プロジェクト</label>
          <select
            name="projectId"
            defaultValue=""
            className="app-form-input"
          >
            <option value="">プロジェクトを選択してください</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="app-form-label">優先度</label>
        <select
          name="priorityId"
          defaultValue=""
          className="app-form-input"
        >
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
        <select
          name="statusId"
          defaultValue=""
          className="app-form-input"
        >
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
        <input
          type="date"
          name="startDate"
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">期限日</label>
        <input
          type="date"
          name="deadline"
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">説明</label>
        <textarea
          name="description"
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
          {isPending ? '作成中...' : '作成'}
        </button>

        <Link href={redirectTo || '/tasks'} className="app-btn-secondary">
          キャンセル
        </Link>
      </div>
    </form>
  );
}