'use server';

import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateProjectState = {
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