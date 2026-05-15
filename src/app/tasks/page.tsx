import { prisma } from "../../lib/prisma";
import Link from "next/link";
import AppNav from "@/components/AppNav";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{
    projectId?: string,
    statusId?: string,
    priorityId?: string,
    assigneeId?: string,
    keyword?: string,
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return '未設定';

  return date.toLocaleDateString('ja-JP');
}

export default async function taskPage({ searchParams }: Props) {

  const { projectId, statusId, priorityId, assigneeId, keyword } = await searchParams;

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const statuses = await prisma.status.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  const priorities = await prisma.priority.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  const users = await prisma.user.findMany({
    orderBy: {
      userName: 'asc',
    },
  });

  const where = {
    AND: [
      projectId ? { projectId } : {},
      statusId ? { statusId } : {},
      priorityId ? { priorityId } : {},
      assigneeId ? { assigneeId } : {},
      keyword ? {
        OR: [
          {
            taskName: {
              contains: keyword,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: keyword,
              mode: 'insensitive' as const,
            },
          },
        ],
      }
      : {},
    ],
  };


  const tasks = await prisma.task.findMany({
    where,
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

  const selectedProject = projects.find(
    (project) => project.projectId === projectId
  );

  const selectedStatus = statuses.find(
    (status) => status.statusId === statusId
  );

  const selectedPriority = priorities.find(
    (priority) => priority.priorityId === priorityId
  );

  const selectedAssignee = users.find(
    (user) => user.userId === assigneeId
  );

  const hasFilter = !!keyword || !!projectId || !!statusId || !!priorityId || !!assigneeId;

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

      <form method="get" key={`${keyword ?? ''}-${projectId ?? ''}-${statusId ?? ''}-${priorityId ?? ''}-${assigneeId ?? ''}`} className="mb-6 rounded border p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Project</label>
            <select
              name="projectId"
              defaultValue={projectId ?? ''}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">すべて</option>
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="statusId"
              defaultValue={statusId ?? ''}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">すべて</option>
              {statuses.map((status) => (
                <option key={status.statusId} value={status.statusId}>
                  {status.statusName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select
              name="priorityId"
              defaultValue={priorityId ?? ''}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">すべて</option>
              {priorities.map((priority) => (
                <option key={priority.priorityId} value={priority.priorityId}>
                  {priority.priorityName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">担当者</label>
            <select
              name="assigneeId"
              defaultValue={assigneeId ?? ''}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">すべて</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">キーワード</label>
          <input
            type="text"
            name="keyword"
            defaultValue={keyword ?? ''}
            className="w-full rounded border px-3 py-2"
            placeholder="タスク名・説明で検索"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            絞り込み
          </button>

          <Link
            href="/tasks"
            className="rounded border px-4 py-2 text-sm"
          >
            条件リセット
          </Link>
        </div>
      </form>

      {hasFilter && (
        <div className="mb-6 rounded border bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-bold">現在の絞り込み条件</p>

          <div className="flex flex-wrap gap-2">
            {keyword && (
              <span className="rounded border bg-white px-3 py-1">
                キーワード：{keyword}
              </span>
            )}

            {selectedProject && (
              <span className="rounded border bg-white px-3 py-1">
                Project：{selectedProject.projectName}
              </span>
            )}

            {selectedStatus && (
              <span className="rounded border bg-white px-3 py-1">
                Status：{selectedStatus.statusName}
              </span>
            )}

            {selectedPriority && (
              <span className="rounded border bg-white px-3 py-1">
                Priority：{selectedPriority.priorityName}
              </span>
            )}

            {selectedAssignee && (
              <span className="rounded border bg-white px-3 py-1">
                担当者：{selectedAssignee.userName}
              </span>
            )}
          </div>
        </div>
      )}

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