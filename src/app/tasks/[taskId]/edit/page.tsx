import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TaskEditForm from "./taskEditForm";

type Props = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function taskEditPage({ params }: Props) {
  const { taskId } = await params;

  const task = await prisma.task.findUnique({
    where: {
      taskId,
    },
    include: {
      project: true,
      assignee: true,
      priority: true,
      status: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">タスク編集</h1>

      <TaskEditForm task={task} />
    </main>
  )
}