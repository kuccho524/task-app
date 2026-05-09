'use client';
import { useActionState } from "react";
import { deleteTask, type DeleteTaskState } from "@/actions/taskActions";

type Props = {
  taskId: string,
};

const initialState: DeleteTaskState = {
  error: undefined,
};

export default function DeleteTaskForm({ taskId }: Props) {

  const [state, formAction, isPending] = useActionState(
    deleteTask,
    initialState
  );

  const handleDelete = async() => {
    if (window.confirm('本当に削除しますか')) {
      await deleteTask;
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <button type="submit" onClick={handleDelete} disabled={isPending} className="rounded bg-red-600 px-4 py-2 text-sm text-white">{isPending ? '削除中...' : '削除'}</button>
      {state.error && (
        <p className="mb-2 text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}