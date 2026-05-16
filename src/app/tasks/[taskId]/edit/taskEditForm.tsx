'use client';
import { updateTask, type UpdateTaskState } from "@/actions/taskActions";
import React, { useActionState } from "react";
import Link from "next/link";

type Priority = {
  priorityId: string;
  priorityName: string;
};

type Status = {
  statusId: string;
  statusName: string;
};

type TaskEditFormProps = {
  task: {
    taskId: string;
    taskName: string;
    description: string | null;
    priorityId: string;
    statusId: string;
    startDate: Date | null;
    deadline: Date | null;
  };
  priorities: Priority[];
  statuses: Status[];
};

const initialState: UpdateTaskState = {
  error: undefined,
};

function formatDateForInput(date: Date | null) {
  if (!date) return '';

  return date.toISOString().split('T')[0];
}

export default function TaskEditForm({ task, priorities, statuses }: TaskEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTask,
    initialState
  );

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    const result = window.confirm('本当に更新しますか？');

    if (!result) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleUpdate} className="space-y-4">
      {state.error && (
        <div className="app-error-message">
          {state.error}
        </div>
      )}

      <input type="hidden" name="taskId" value={task.taskId} />

      <div>
        <label className="app-form-label">タスク名</label>
        <input name="taskName" defaultValue={task.taskName} className="app-form-input" placeholder="タスク名を入力" />
      </div>

      <div>
        <label className="app-form-label">優先度</label>
        <select
          name="priorityId"
          defaultValue={task.priorityId}
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
          defaultValue={task.statusId}
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
          defaultValue={formatDateForInput(task.startDate)}
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">期限日</label>
        <input
          type="date"
          name="deadline"
          defaultValue={formatDateForInput(task.deadline)}
          className="app-form-input"
        />
      </div>

      <div>
        <label className="app-form-label">説明</label>
        <textarea name="description" defaultValue={task.description ?? ''} className="app-form-input min-h-32" placeholder="説明を入力"></textarea>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="app-btn-primary">
        {isPending ? '更新中...' : '更新'}
      </button>

      <Link href={`/tasks/${task.taskId}`} className="app-btn-secondary">詳細へ戻る</Link>
      </div>
    </form>
  );
}