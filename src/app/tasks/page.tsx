import { prisma } from "../../lib/prisma";
import Link from "next/link";
import AppNav from "@/components/AppNav";

export const dynamic = 'force-dynamic';

function formatDate(date: Date | null) {
  if (!date) return '未設定';

  return date.toLocaleDateString('ja-JP');
}

export default async function taskPage() {

  const tasks = await prisma.task.findMany({
    include: {
      project: true,
      assignee: true,
      creator: true,
      priority: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <main className="mx-auto max-w-5xl p-8">

      <AppNav />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスク一覧</h1>

        <Link
          href="/tasks/new"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          新規作成
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600">タスクがありません。</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.taskId} className="rounded border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{task.taskId}</p>
                  <Link
                    href={`/tasks/${task.taskId}`}
                    className="text-lg font-bold underline"
                  >
                    {task.taskName}
                  </Link>
                </div>

                <div className="text-right text-sm">
                  <p>{task.status.statusName}</p>
                  <p className="text-xs text-gray-500">
                    {task.priority.priorityName}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                <p>Project：{task.project.projectName}</p>
                <p>担当者：{task.assignee.userName}</p>
                <p>作成者：{task.creator.userName}</p>
                <p>開始日：{formatDate(task.startDate)}</p>
                <p>期限日：{formatDate(task.deadline)}</p>
                <p>完了日：{formatDate(task.completedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}