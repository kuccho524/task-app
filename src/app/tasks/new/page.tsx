import Link from "next/link";
import TaskCreateForm from "./taskCreateForm";
import { prisma } from "@/lib/prisma";

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
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">タスク作成</h1>
      <Link href={redirectTo || '/tasks'} className="rounded border px-4 py-2 text-sm">
        戻る
      </Link>
      <TaskCreateForm priorities={priorities} statuses={statuses} projects={projects} selectedProject={selectedProject} redirectTo={redirectTo} />
    </main>
  );
}