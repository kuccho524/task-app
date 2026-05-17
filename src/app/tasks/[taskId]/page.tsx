import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteTaskForm from "./deleteTaskForm";
import { requireAppUser } from "@/lib/auth";
import AppNav from "@/components/AppNav";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export const dynamic = "force-dynamic";

function formatDate(date: Date | null, fallback = "未設定") {
  if (!date) return fallback;

  return date.toLocaleDateString("ja-JP");
}

function formatDateTime(date: Date) {
  return date.toLocaleString("ja-JP");
}

export default async function taskDetailPage({ params }: Props) {
  const { taskId } = await params;

  const appUser = await requireAppUser();

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

  const canEdit = task.createdBy === appUser.userId;

  return (
    <main className="app-page">
      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">タスク詳細</h1>
          <p className="app-page-description">
            タスクの詳細情報を確認できます。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/tasks" className="app-btn-secondary">
            一覧へ戻る
          </Link>

          {canEdit && (
            <Link
              href={`/tasks/${task.taskId}/edit`}
              className="app-btn-primary"
            >
              編集
            </Link>
          )}

          {canEdit && <DeleteTaskForm taskId={task.taskId} />}
        </div>
      </div>

      <section className="app-card mb-6">
        <div className="mb-4">
          <p className="text-xs text-gray-500">{task.taskId}</p>
          <h2 className="text-xl font-bold">{task.taskName}</h2>
        </div>

        <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <p>Project：{task.project.projectName}</p>
          <p>説明：{task.description || "未設定"}</p>
          <p>担当者：{task.assignee.userName}</p>
          <p>作成者：{task.creator.userName}</p>
          <p>優先度：{task.priority.priorityName}</p>
          <p>ステータス：{task.status.statusName}</p>
          <p>開始日：{formatDate(task.startDate)}</p>
          <p>期限日：{formatDate(task.deadline)}</p>
          <p>完了日：{formatDate(task.completedAt, "未完了")}</p>
          <p>作成日：{formatDateTime(task.createdAt)}</p>
          <p>更新日：{formatDateTime(task.updatedAt)}</p>
        </div>
      </section>
    </main>
  );
}