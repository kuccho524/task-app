import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteTaskForm from './deleteTaskForm';

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export const dynamic = `force-dynamic`;

export default async function taskDetailPage({ params }: Props) {

  const { taskId } = await params;

  const task = await prisma.task.findUnique({
    where: {
      taskId,
    },
    include: {
      project: true,
      assignee: true,
      creator: true,
      priority: true,
      status: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex item-center justfy-between">
        <h1 className="text-2xl font-bold">タスク詳細</h1>
      </div>
      <section className="rounded border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">{task.taskName}</h2>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">説明：</span>
            <span>{task.description || '未入力'}</span>
          </div>

          <div>
            <span className="font-medium">プロジェクト：</span>
            <span>{task.project.projectName}</span>
          </div>

          <div>
            <span className="font-medium">担当者：</span>
            <span>{task.assignee.userName}</span>
          </div>

          <div>
            <span className="font-medium">作成者：</span>
            <span>{task.creator.userName}</span>
          </div>

          <div>
            <span className="font-medium">優先度：</span>
            <span>{task.priority.priorityName}</span>
          </div>

          <div>
            <span className="font-medium">ステータス：</span>
            <span>{task.status.statusName}</span>
          </div>

          <div>
            <span className="font-medium">開始日：</span>
            <span>
              {task.startDate
                ? task.startDate.toLocaleDateString('ja-JP')
                : '未設定'}
            </span>
          </div>

          <div>
            <span className="font-medium">期限：</span>
            <span>
              {task.deadline
                ? task.deadline.toLocaleDateString('ja-JP')
                : '未設定'}
            </span>
          </div>

          <div>
            <span className="font-medium">完了日：</span>
            <span>
              {task.completedAt
                ? task.completedAt.toLocaleDateString('ja-JP')
                : '未完了'}
            </span>
          </div>

          <div>
            <span className="font-medium">作成日時：</span>
            <span>{task.createdAt.toLocaleString('ja-JP')}</span>
          </div>

          <div>
            <span className="font-medium">更新日時：</span>
            <span>{task.updatedAt.toLocaleString('ja-JP')}</span>
          </div>

          <div className="flex gap-3">
            <Link href="/tasks" className="rounded border px-4 py-2 text-sm hover:bg-gray-50">
              一覧へ戻る
            </Link>

            <Link href={`/tasks/${task.taskId}/edit`} className="rounded bg-black px-4 py-2 text-sm text-white">編集</Link>
          </div>
          <DeleteTaskForm taskId={task.taskId} />
        </div>
      </section>
    </main>
  )
}