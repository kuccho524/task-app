import Link from "next/link";
import { prisma } from "@/lib/prisma";
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

export default async function projectsPage({ searchParams }: Props) {

  const { statusId, priorityId, assigneeId, keyword }= await searchParams;

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
      statusId ? { statusId } : {},
      priorityId ? { priorityId } : {},
      assigneeId ? { assigneeId } : {},
      keyword ? {
        OR: [
          {
            projectName: {
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
      } : {},
    ],
  };

  const projects = await prisma.project.findMany({
    where,
    include: {
      assignee: true,
      creator: true,
      priority: true,
      status: true,
      tasks: {
        select: {
          taskId: true,
          status: {
            select: {
              isCompleted: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const selectedStatus = statuses.find(
    (status) => status.statusId === statusId
  );

  const selectedPriority = priorities.find(
    (priority) => priority.priorityId === priorityId
  );

  const selectedAssignee = users.find(
    (user) => user.userId === assigneeId
  );

  const hasFilter = !!keyword || !!statusId || !!priorityId || !!assigneeId;

  return (
    <main className="app-page">

      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">プロジェクト一覧</h1>
          <p className="app-page-description">
            登録済みプロジェクトの確認・検索・絞り込みができます。
          </p>
        </div>

        <Link href="/projects/new" className="app-btn-primary">
          新規作成
        </Link>
      </div>

      <form method="get" key={`${keyword ?? ''}-${statusId ?? ''}-${priorityId ?? ''}-${assigneeId ?? ''}`} className="app-filter-form">
        <div className="app-filter-grid">
          <div>
            <label className="app-form-label">キーワード</label>
            <input
              type="text"
              name="keyword"
              defaultValue={keyword ?? ''}
              className="app-form-input"
              placeholder="Project名・説明で検索"
            />
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

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="app-btn-primary"
          >
            絞り込み
          </button>

          <Link href="/projects" className="app-btn-secondary">
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

      {projects.length === 0 ? (
        <p className="text-sm text-gray-600">プロジェクトがありません。</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const totalTaskCount = project.tasks.length;

            const completedTaskCount = project.tasks.filter(
              (task) => task.status.isCompleted
            ).length;

            const progressRate =
              totalTaskCount === 0
                ? 0
                : Math.round((completedTaskCount / totalTaskCount) * 100);

            return (
              <div key={project.projectId} className="app-card">
                <div className="mb-2 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.projectId}`}
                    className="text-lg font-bold underline"
                  >
                    {project.projectName}
                  </Link>

                  <span className="text-sm text-gray-500">
                    {project.projectId}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <p>担当者：{project.assignee.userName}</p>
                  <p>作成者：{project.creator.userName}</p>
                  <p>優先度：{project.priority.priorityName}</p>
                  <p>ステータス：{project.status.statusName}</p>
                  <p>
                    タスク：{completedTaskCount} / {totalTaskCount} 完了
                  </p>
                  <p>進捗率：{progressRate}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}