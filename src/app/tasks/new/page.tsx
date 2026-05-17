import Link from "next/link";
import TaskCreateForm from "./taskCreateForm";
import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";

type Props = {
  searchParams: Promise<{
    projectId?: string;
    redirectTo?: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function newTaskPage({ searchParams }: Props) {

  const { projectId, redirectTo } = await searchParams;

  const priorities = await prisma.priority.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  
  const statuses = await prisma.status.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const selectedProject = projectId ? await prisma.project.findUnique({
    where: {
      projectId,
    },
  }) : null;

  return (
    <main className="app-page">
      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">タスク作成</h1>
          <p className="app-page-description">
            新しいタスクを登録します。
          </p>
        </div>

        <Link href="/tasks" className="app-btn-secondary">
          一覧へ戻る
        </Link>
      </div>

      <section className="app-card">
        <TaskCreateForm priorities={priorities} statuses={statuses} projects={projects} selectedProject={selectedProject} redirectTo={redirectTo} />
      </section>
    </main>
  );
}