'use server';

import { prisma } from '@/lib/prisma';
import { cacheTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CreateTaskState = {
  error?: string;
};

export type UpdateTaskState = {
  error?: string;
}

export type DeleteTaskState = {
  error?: string;
}

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

export async function updateTask (
  _prevState: UpdateTaskState,
  formData: FormData): Promise<UpdateTaskState> {
  const taskId = String(formData.get('taskId') ?? '');
  const taskName = String(formData.get('taskName') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!taskId) {
    return { error: 'タスクIDを取得できませんでした', };
  }

  if (!taskName) {
    return { error: 'タスク名は必須です。', }
  }

  try {
    await prisma.task.update ({
      where: {
        taskId,
      },
      data: {
        taskName,
        description: description || null,
      },
    });
  } catch(error) {
    console.log(error);
    return { error: 'タスク更新中にエラーが発生しました。' };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}
export async function deleteTask (_prevState: DeleteTaskState,
  formData: FormData): Promise<DeleteTaskState> {
  const taskId = String(formData.get('taskId') ?? '');

  if (!taskId) {
    return { error: 'タスクIDを取得できませんでした' };
  }

  try {
    await prisma.task.delete({
      where: {
        taskId,
      },
    });
  } catch (error) {
    console.error(error);

    return { error: 'タスク削除中にエラーが発生しました' };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}
