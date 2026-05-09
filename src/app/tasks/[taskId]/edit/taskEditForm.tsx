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
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="taskId" value={task.taskId} />

      <div>
        <label className="mb-1 block text-sm font-medium">タスク名</label>
        <input name="taskName" defaultValue={task.taskName} className="w-full rounded border px-3 py-2" placeholder="タスク名を入力" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">優先度</label>
        <select
          name="priorityId"
          defaultValue={task.priorityId}
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
          defaultValue={task.statusId}
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
          defaultValue={formatDateForInput(task.startDate)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">期限日</label>
        <input
          type="date"
          name="deadline"
          defaultValue={formatDateForInput(task.deadline)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明</label>
        <textarea name="description" defaultValue={task.description ?? ''} className="w-full rounded border px-3 py-2" placeholder="説明を入力"></textarea>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="rounded bg-black px-4 px-2 text-white disabled:opacity-50">
        {isPending ? '更新中...' : '更新'}
      </button>

      <Link href={`/tasks/${task.taskId}`} className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50">詳細へ戻る</Link>
      </div>
    </form>
  );
}