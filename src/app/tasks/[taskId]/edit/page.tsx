import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TaskEditForm from "./taskEditForm";
import { requireAppUser } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import Link from "next/link";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function taskEditPage({ params }: Props) {
  const { taskId } = await params;

  const appUser = await requireAppUser();

  const task = await prisma.task.findUnique({
    where: {
      taskId,
      createdBy: appUser.userId,
    },
  });

  if (!task) {
    notFound();
  }

  const priorities = await prisma.priority.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const statuses = await prisma.status.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <main className="app-page">
      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">タスク編集</h1>
          <p className="app-page-description">
            タスクの内容を編集します。
          </p>
        </div>

        <Link href={`/tasks/${task.taskId}`} className="app-btn-secondary">
          詳細へ戻る
        </Link>
      </div>

      <section className="app-card">
        <TaskEditForm task={task} priorities={priorities} statuses={statuses} />
      </section>
    </main>
  )
}