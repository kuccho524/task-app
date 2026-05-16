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
    <main className="app-page">

      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">タスク一覧</h1>
          <p className="app-page-description">
            登録済みタスクの確認・検索・絞り込みができます。
          </p>
        </div>

        <Link href="/tasks/new" className="app-btn-primary">
          新規作成
        </Link>
      </div>

      <form method="get" key={`${keyword ?? ''}-${projectId ?? ''}-${statusId ?? ''}-${priorityId ?? ''}-${assigneeId ?? ''}`} className="app-filter-form">
        <div className="app-filter-grid">
          <div>
            <label className="app-form-label">Project</label>
            <select
              name="projectId"
              defaultValue={projectId ?? ''}
              className="app-form-input"
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
            <label className="app-form-label">Status</label>
            <select
              name="statusId"
              defaultValue={statusId ?? ''}
              className="app-form-input"
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
            <label className="app-form-label">Priority</label>
            <select
              name="priorityId"
              defaultValue={priorityId ?? ''}
              className="app-form-input"
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
            <label className="app-form-label">担当者</label>
            <select
              name="assigneeId"
              defaultValue={assigneeId ?? ''}
              className="app-form-input"
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
          <label className="app-form-label">キーワード</label>
          <input
            type="text"
            name="keyword"
            defaultValue={keyword ?? ''}
            className="app-form-input"
            placeholder="タスク名・説明で検索"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="app-btn-primary"
          >
            絞り込み
          </button>

          <Link
            href="/tasks"
            className="app-btn-secondary"
          >
            条件リセット
          </Link>
        </div>
      </form>

      {hasFilter && (
        <div className="app-condition-box">
          <p className="mb-2 font-bold">現在の絞り込み条件</p>

          <div className="flex flex-wrap gap-2">
            {keyword && (
              <span className="app-condition-tag">
                キーワード：{keyword}
              </span>
            )}

            {selectedProject && (
              <span className="app-condition-tag">
                Project：{selectedProject.projectName}
              </span>
            )}

            {selectedStatus && (
              <span className="app-condition-tag">
                Status：{selectedStatus.statusName}
              </span>
            )}

            {selectedPriority && (
              <span className="app-condition-tag">
                Priority：{selectedPriority.priorityName}
              </span>
            )}

            {selectedAssignee && (
              <span className="app-condition-tag">
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
            <div key={task.taskId} className="app-card">
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