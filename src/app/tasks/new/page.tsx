import TaskCreateForm from "./taskCreateForm";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function newTaskPage() {

  const priorities = await prisma.priority.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  
  const statuses = await prisma.status.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">タスク作成</h1>

      <TaskCreateForm priorities={priorities} statuses={statuses} />
    </main>
  );
}