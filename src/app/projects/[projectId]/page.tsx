import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAppUser } from "@/lib/auth";
import DeleteProjectForm from "./deleteProjectForm";
import AppNav from "@/components/AppNav";

type Props = {
  params: Promise<{
    projectId: string;
  }>
};

export const dynamic = 'force-dynamic';

function formatDate(date: Date | null) {

  if (!date) return '未設定';

  return date.toLocaleDateString('ja-JP');
}

export default async function projectDetailPage({params}: Props) {

  const { projectId } = await params;

  const appUser = await requireAppUser();

  const project = await prisma.project.findUnique({
    where: {
      projectId,
    },
    include: {
      assignee: true,
      creator: true,
      priority: true,
      status: true,
      tasks: {
        include: {
          assignee: true,
          priority: true,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const canEdit = project.createdBy === appUser.userId;

  const totalTaskCount = project.tasks.length;

  const completedTaskCount = project.tasks.filter(
    (task) => task.status.isCompleted
  ).length;

  const incompleteTaskCount = totalTaskCount - completedTaskCount;

  const progressRate = totalTaskCount === 0 ? 0 : Math.round((completedTaskCount / totalTaskCount) * 100);

  return (
    <main>

      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">プロジェクト詳細</h1>
          <p className="app-page-description">
            Projectの詳細情報と関連Taskを確認できます。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/projects" className="app-btn-secondary">
            一覧へ戻る
          </Link>

          {canEdit && (
            <Link
              href={`/projects/${project.projectId}/edit`}
              className="app-btn-primary"
            >
              編集
            </Link>
          )}

          {canEdit && <DeleteProjectForm projectId={project.projectId} />}
        </div>
      </div>

      <section className="app-card mb-6">
        <div className="mb-4">
          <p className="text-xs text-gray-500">{project.projectId}</p>
          <h2 className="text-xl font-bold">{project.projectName}</h2>
        </div>

        <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <p>説明：{project.description || '未設定'}</p>
          <p>担当者：{project.assignee.userName}</p>
          <p>作成者：{project.creator.userName}</p>
          <p>優先度：{project.priority.priorityName}</p>
          <p>ステータス：{project.status.statusName}</p>
          <p>開始日：{formatDate(project.startDate)}</p>
          <p>期限日：{formatDate(project.deadline)}</p>
          <p>完了日：{formatDate(project.completedAt)}</p>
        </div>
      </section>

      <section className="app-card mb-6">
        <h2 className="mb-4 text-lg font-bold">タスク進捗</h2>

        <div className="grid gap-3 sm:grid-cols -4">
          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">関連タスク</p>
            <p className="text-xl font-bold">{totalTaskCount}件</p>
          </div>

          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">完了</p>
            <p className="text-xl font-bold">{completedTaskCount}件</p>
          </div>

          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">未完了</p>
            <p className="text-xl font-bold">{incompleteTaskCount}件</p>
          </div>

          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs text-gray-500">進捗率</p>
            <p className="text-xl font-bold">{progressRate}%</p>
          </div>
        </div>
      </section>

      <section className="app-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">関連タスク</h2>

          <Link
            href={`/tasks/new?projectId=${project.projectId}&redirectTo=/projects/${project.projectId}`}
            className="app-btn-primary"
          >
            このProjectにTaskを追加
          </Link>
        </div>

        {project.tasks.length === 0 ? (
          <p className="app-empty-message">
            このプロジェクトに紐づくタスクはありません。「このProjectにTaskを追加」から登録してください。
          </p>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div key={task.taskId} className="rounded-lg border bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{task.taskId}</p>
                    <Link
                      href={`/tasks/${task.taskId}`}
                      className="text-base font-bold underline"
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
                  <p>担当者：{task.assignee.userName}</p>
                  <p>
                    期限日：
                    {task.deadline
                      ? task.deadline.toLocaleDateString('ja-JP')
                      : '未設定'}
                  </p>
                  <p>
                    完了日：
                    {task.completedAt
                      ? task.completedAt.toLocaleDateString('ja-JP')
                      : '未完了'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}