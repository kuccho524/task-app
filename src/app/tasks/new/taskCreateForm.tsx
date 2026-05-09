'use client';

import { useActionState } from "react";
import { createTask, type CreateTaskState } from "@/actions/taskActions";

const initialState: CreateTaskState = {
  error: undefined,
};

export default function TaskCreateForm() {

  const [state, formAction, isPending] = useActionState(
    createTask,
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
        <label className="mb-1 block text-sm font-medium">タスク名</label>
        <input name="taskName" className="w-full rounded border px-3 py-2" placeholder="タスク名を入力" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明</label>
        <textarea name="description" className="w-full rounded border px-3 py-2" placeholder="説明を入力" />
      </div>

      <button type="submit" disabled={isPending} className="rounded bg-black px-4 py-2 text-white">
        {isPending ? '作成中...' : '作成'}
      </button>
    </form>
  );
}