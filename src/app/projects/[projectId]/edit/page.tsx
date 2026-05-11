import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireAppUser } from "@/lib/auth";
import ProjectEditForm from "./projectEditForm";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise <{
    projectId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function ProjectCreatePage ({ params }: Props) {
  
  const { projectId } = await params;

  const appUser = await requireAppUser();

  const project = await prisma.project.findUnique({
    where: {
      projectId,
      createdBy: appUser.userId,
    },
  });

  if (!project) {
    notFound();
  }

  const priorities = await prisma.priority.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  const statuses = await prisma.status.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2zl font-bold">プロジェクト編集</h1>

      <ProjectEditForm project={project} priorities={priorities} statuses={statuses} />
    </main>
  )
}