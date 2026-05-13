import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requireAppUser } from "@/lib/auth";
import DeleteProjectForm from "./deleteProjectForm";

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

      <div className="mb-6 flex item-center justfy-between">
        <h1 className="text-2xl font-bold">プロジェクト詳細</h1>
      </div>

      <div className="flex gap-2">
        <Link href="/projects" className="rounded border px-4 py-2 text-sm">一覧へ戻る</Link>
        {canEdit && (
          <Link href={`/projects/${project.projectId}/edit`} className="rounded bg-black px-4 py-2 text-sm text-white">編集</Link>
        )}
        {canEdit && <DeleteProjectForm projectId={project.projectId} />}
      </div>
      <section className="mb-8 rounded border p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">{project.projectId}</p>
          <p className="text-xl font-bold">{project.projectName}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <p>説明：{project.description || '未設定'}</p>
            <p>担当者：{project.assignee.userName}</p>
            <p>作成者：{project.creator.userName}</p>
            <p>優先度：{project.priority.priorityName}</p>
            <p>ステータス：{project.status.statusName}</p>
            <p>開始日：{formatDate(project.startDate)}</p>
            <p>期限日：{formatDate(project.deadline)}</p>
            <p>完了日：{formatDate(project.completedAt)}</p>
            <p>作成日：{formatDate(project.createdAt)}</p>
            <p>更新日：{formatDate(project.updatedAt)}</p>
          </div>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-4 text-lg font-bold">タスク進捗</h2>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">関連タスク</p>
            <p className="text-xl font-bold">{totalTaskCount}件</p>
          </div>

          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">完了</p>
            <p className="text-xl font-bold">{completedTaskCount}件</p>
          </div>

          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">未完了</p>
            <p className="text-xl font-bold">{incompleteTaskCount}件</p>
          </div>

          <div className="rounded border p-3">
            <p className="text-xs text-gray-500">進捗率</p>
            <p className="text-xl font-bold">{progressRate}%</p>
          </div>
        </div>
      </section>

      <section className="rounded border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">関連タスク</h2>

          <Link
            href={`/tasks/new?projectId=${project.projectId}&redirectTo=/projects/${project.projectId}`}
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            このProjectにTaskを追加
          </Link>
        </div>

        {project.tasks.length === 0 ? (
          <p className="text-sm text-gray-600">
            このプロジェクトに紐づくタスクはありません。
          </p>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div key={task.taskId} className="rounded border p-4">
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