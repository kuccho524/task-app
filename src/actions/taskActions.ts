'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAppUser } from '@/lib/auth';

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
  const priorityId = String(formData.get('priorityId') ?? '');
  const statusId = String(formData.get('statusId') ?? '');
  const startDateValue = String(formData.get('startDate') ?? '');
  const deadlineValue = String(formData.get('deadline') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!taskName) {
    return {
      error: 'タスク名は必須です。',
    };
  }

  if (!priorityId) {
    return { error: '優先度を選択してください', };
  }

  if (!statusId) {
    return { error: 'ステータスを選択してください', };
  }

  const appUser = await requireAppUser();
  const project = await prisma.project.findFirst();

  if (!project) {
    return {
      error: 'タスク作成に必要な初期データが不足しています。',};
  }

  const status = await prisma.status.findUnique({
    where: {
      statusId,
    },
  });

  if (!status) {
    return { error: '選択されたステータスが存在しません', };
  }

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const deadline = deadlineValue ? new Date(deadlineValue) : null;

  if (startDate && deadline && startDate > deadline) {
    return { error: '開始日は期限日以前の日付を指定してください。', };
  }

  try {
    await prisma.task.create({
      data: {
        taskName,
        description: description || null,
        projectId: project.projectId,
        assigneeId: appUser.userId,
        priorityId,
        statusId,
        startDate,
        deadline,
        completedAt: status.isCompleted ? new Date() : null,
        createdBy: appUser.userId,
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
  const priorityId = String(formData.get('priorityId') ?? '');
  const statusId = String(formData.get('statusId') ?? '');
  const startDateValue = String(formData.get('startDate') ?? '');
  const deadlineValue = String(formData.get('deadline') ?? '');
  const description = String(formData.get('description') ?? '');

  const appUser = await requireAppUser();

  const existingTask = await prisma.task.findUnique({
    where: { taskId, },
  });

  if (!existingTask) {
    return { error: '対象のタスクが見つかりません', };
  }

  if (existingTask.createdBy !== appUser.userId) {
    return { error: 'このタスクを編集する権限がありません', };
  }

  if (!taskId) {
    return { error: 'タスクIDを取得できませんでした', };
  }

  if (!taskName) {
    return { error: 'タスク名は必須です', }
  }

  if (!priorityId) {
    return { error: '優先度を選択してください', };
  }

  if (!statusId) {
    return { error: 'ステータスを選択してください', };
  }

  const status = await prisma.status.findUnique({
    where: { statusId },
  });

  if (!status) {
    return { error: '選択されたステータスが存在しません', };
  }

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const deadline = deadlineValue ? new Date(deadlineValue) : null;

  if (startDate && deadline && startDate > deadline) {
    return { error: '開始日は期限日以前の日付を指定してください。', };
  }

  try {
    await prisma.task.update ({
      where: {
        taskId,
      },
      data: {
        taskName,
        priorityId,
        statusId,
        startDate,
        deadline,
        completedAt: status.isCompleted ? new Date() : null,
        description: description || null,
      },
    });
  } catch(error) {
    console.log(error);
    return { error: 'タスク更新中にエラーが発生しました。' };
  }

  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);
  redirect(`/tasks/${taskId}`);
}
export async function deleteTask (_prevState: DeleteTaskState,
  formData: FormData): Promise<DeleteTaskState> {
  
  const appUser = await requireAppUser();

  const taskId = String(formData.get('taskId') ?? '');

  const existingTask = await prisma.task.findUnique({
    where: { taskId, },
  });

  if (!existingTask) {
    return { error: '対象のタスクが見つかりません', };
  }

  if (existingTask.createdBy !== appUser.userId) {
    return { error: 'このタスクを編集する権限がありません', };
  }

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
