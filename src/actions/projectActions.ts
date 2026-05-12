'use server';

import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateProjectState = {
  error?: string;
};

export type UpdateProjectState = {
  error?: string;
};

export type DeleteProjectState = {
  error?: string;
};

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  
  const projectName = String(formData.get('projectName') ?? '');
  const priorityId = String(formData.get('priorityId') ?? '');
  const statusId = String(formData.get('statusId') ?? '');
  const startDateValue = String(formData.get('startDate') ?? '');
  const deadlineValue = String(formData.get('deadline') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!projectName) {
    return { error: 'プロジェクト名は必須です', };
  }

  if (!priorityId) {
    return { error: '優先度を選択してください', };
  }

  if (!statusId) {
    return { error: 'ステータスを選択してください', };
  }

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const deadline = deadlineValue ? new Date(deadlineValue) : null;

  if (startDate && deadline && startDate > deadline) {
    return { error: '開始日は期限日以前の日付を選択してください', };
  }

  const appUser = await requireAppUser();

  const status = await prisma.status.findUnique({
    where: {
      statusId,
    },
  });

  if (!status) {
    return { error: '選択されたステータスが存在しません', };
  }

  try {
    await prisma.project.create({
      data: {
        projectName,
        description: description || null,
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
    return { error: 'プロジェクト作成中にエラーが発生しました', };
  }

  revalidatePath('/prohects');
  redirect('/projects');

}

export async function updateProject(
  _prevState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {

  const projectId = String(formData.get('projectId') ?? '');
  const projectName = String(formData.get('projectName') ?? '');
  const priorityId = String(formData.get('priorityId') ?? '');
  const statusId = String(formData.get('statusId') ?? '');
  const startDateValue = String(formData.get('startDate') ?? '');
  const deadlineValue = String(formData.get('deadline') ?? '');
  const description = String(formData.get('description') ?? '');

  if (!projectId) {
    return { error: 'プロジェクトIDを取得できませんでした', };
  }

  if (!projectName) {
    return { error: 'プロジェクト名は必須です', };
  }

  if (!priorityId) {
    return { error: '優先度を選択してください', };
  }

  if (!statusId) {
    return { error: 'ステータスを選択してください', };
  }

  const appUser = await requireAppUser();

  const existingProject = await prisma.project.findUnique({
    where: {
      projectId,
    },
  });

  if (!existingProject) {
    return { error: '対象のプロジェクトがありません', };
  }

  if (existingProject.createdBy !== appUser.userId) {
    return { error: 'このプロジェクトを編集する権限がありません', };
  }

  const status = await prisma.status.findUnique({
    where: {
      statusId,
    },
  });

  if (!status) {
    return { error: 'ステータスが存在しません', };
  }

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const deadline = deadlineValue ? new Date(deadlineValue) : null;

  if (startDate && deadline && startDate > deadline) {
    return { error: '開始日は期限日以前の日付を指定してください', };
  }

  try {
    await prisma.project.update({
      where: {
        projectId,
      },
      data: {
        projectName,
        priorityId,
        statusId,
        startDate,
        deadline,
        completedAt: status.isCompleted ? new Date() : null,
        description: description || null,
      },
    });
  } catch (error) {
    console.error(error);
    return { error: 'プロジェクト更新中にエラーが発生しました' };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function deleteProject(
  _prevState: DeleteProjectState,
  formData: FormData
): Promise<DeleteProjectState> {
  const projectId = String(formData.get('projectId') ?? '');

  if (!projectId) {
    return {
      error: 'プロジェクトIDを取得できませんでした。',
    };
  }

  const appUser = await requireAppUser();

  const existingProject = await prisma.project.findUnique({
    where: {
      projectId,
    },
  });

  if (!existingProject) {
    return {
      error: '対象のプロジェクトが見つかりません。',
    };
  }

  if (existingProject.createdBy !== appUser.userId) {
    return {
      error: 'このプロジェクトを削除する権限がありません。',
    };
  }

  const taskCount = await prisma.task.count({
    where: {
      projectId,
    },
  });

  if (taskCount > 0) {
    return {
      error: 'このプロジェクトに紐づくタスクが存在するため削除できません。',
    };
  }

  try {
    await prisma.project.delete({
      where: {
        projectId,
      },
    });
  } catch (error) {
    console.error(error);

    return {
      error: 'プロジェクト削除中にエラーが発生しました。',
    };
  }

  revalidatePath('/projects');
  redirect('/projects');
}