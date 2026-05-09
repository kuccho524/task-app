'use client';
import { updateTask, type UpdateTaskState } from "@/actions/taskActions";
import { useActionState } from "react";
import Link from "next/link";

type TaskEditFormProps = {
  task: {
    taskId: string;
    taskName: string;
    description: string | null;
  };
};

const initialState: UpdateTaskState = {
  error: undefined,
};

export default function TaskEditForm({ task }: TaskEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTask,
    initialState
  );

  const handleUpdate = async() => {
    if (window.confirm('本当に更新しますか')) {
      await updateTask;
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-70">
          {state.error}
        </div>
      )}

      <input type="hidden" name="taskId" value={task.taskId} />

      <div>
        <label className="mb-1 block -text-sm font-medium">タスク名</label>
        <input name="taskName" defaultValue={task.taskName} className="w-full rounded border px-3 py-2" placeholder="タスク名を入力" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明</label>
        <textarea name="description" defaultValue={task.description ?? ''} className="w-full rounded border px-3 py-2" placeholder="説明を入力"></textarea>
      </div>

      <div className="flex gap-2">
        <button type="submit" onClick={handleUpdate} disabled={isPending} className="rounded bg-black px-4 px-2 text-white disabled:opacity-50">
        {isPending ? '更新中...' : '更新'}
      </button>

      <Link href={`/tasks/${task.taskId}`} className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50">詳細へ戻る</Link>
      </div>
    </form>
  );
}