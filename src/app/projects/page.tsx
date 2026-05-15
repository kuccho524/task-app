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

export default async function projectsPage() {
  const projects = await prisma.project.findMany({
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

  return (
    <main className="mx-auto max-w-5xl p-8">

      <AppNav />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>

        <Link
          href="/projects/new"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          新規作成
        </Link>
      </div>

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
              <div key={project.projectId} className="rounded border p-4">
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