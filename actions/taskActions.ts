'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CreateTaskState = {
  error?: string;
};

export async function createTask(
  _prevState: CreateTaskState,
  formData: FormData
): Promise<CreateTaskState> {
  const taskName = String(formData.get('taskName') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!taskName) {
    return {
      error: 'タスク名は必須です。',
    };
  }

  const user = await prisma.user.findFirst();
  const project = await prisma.project.findFirst();
  const priority = await prisma.priority.findFirst({
    orderBy: {
      sortOrder: 'asc',
    },
  });
  const status = await prisma.status.findFirst({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  if (!user || !project || !priority || !status) {
    return {
      error: 'タスク作成に必要な初期データが不足しています。',
    };
  }

  try {
    await prisma.task.create({
      data: {
        taskName,
        description: description || null,
        projectId: project.projectId,
        assigneeId: user.userId,
        priorityId: priority.priorityId,
        statusId: status.statusId,
        createdBy: user.userId,
      },
    });
  } catch (error) {
    console.error(error);

    return {
      error: 'タスクの作成中にエラーが発生しました。',
    };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}