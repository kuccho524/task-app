import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function projectsPage() {

  const projects = await prisma.project.findMany({
    include: {
      assignee: true,
      creator: true,
      priority: true,
      status: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="gap-2 flex justify-between">
        <Link href="/tasks" className="rounded bg-black px-4 py-2 text-sm text-white">タスク一覧へ</Link>
        <Link href="/projects/new" className="rounded bg-black px-4 py-2 text-sm text-white">新規作成</Link>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-600">プロジェクトがありません</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.projectId} className="rounded border p-4">
              <div className="mb-2 flex item-center justify-between">
                <Link href={`/projects/${project.projectId}`}>{project.projectName}</Link>
              </div>

              <div className="space-y-1 text-sm">
                <p>担当者：{project.assignee.userName}</p>
                <p>作成者：{project.creator.userName}</p>
                <p>優先度：{project.priority.priorityName}</p>
                <p>ステータス{project.status.statusName}</p>
                <p>期限：{project.deadline ? project.deadline.toLocaleDateString('ja-JP') : '未設定'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}