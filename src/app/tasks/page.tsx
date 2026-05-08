import { prisma } from "../../lib/prisma";

export default async function taskPage() {
  const tasks = await prisma.task.findMany({
    include: {
      project: true,
      assignee: true,
      priority: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-bold">タスク一覧</h1>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.taskId} className="rounded border p-4">
            <div className="text-lg font-semibold">{task.taskName}</div>

            <div className="mt-2 text-sm text-gray-600">
              <div>プロジェクト：{task.project.projectName}</div>
              <div>担当者：{task.assignee.userName}</div>
              <div>優先度：{task.priority.priorityName}</div>
              <div>ステータス：{task.status.statusName}</div>
            </div>

            {task.description && (
              <p className="mt-3 text-sm">{task.description}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}