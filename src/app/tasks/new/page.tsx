import TaskCreateForm from "./taskCreateForm";

export default function newTaskPage() {

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">タスク作成</h1>

      <TaskCreateForm />
    </main>
  );
}