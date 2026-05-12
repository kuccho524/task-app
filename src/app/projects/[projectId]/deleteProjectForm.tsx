'use client';
import React, { useActionState } from "react";
import { deleteProject, type DeleteProjectState } from "@/actions/projectActions";

type DeleteProjectFormProps = {
  projectId: string;
};

const initialState: DeleteProjectState = {
  error: undefined,
};

export default function DeleteProjectForm({ projectId }: DeleteProjectFormProps) {

  const [state, formAction, isPending] = useActionState(deleteProject, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    const result = window.confirm('本当に削除しますか？');

    if (!result) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      {state.error && (
        <p className="mb-2 text-sm text-red-600">{state.error}</p>
      )}

      <input type="hidden" name="projectId" value={projectId} />
      <button type="submit" disabled={isPending} className="rounded bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50">
        {isPending ? '削除中...' : '削除'}
      </button>
    </form>
  );
}