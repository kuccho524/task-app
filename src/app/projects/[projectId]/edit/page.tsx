import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireAppUser } from "@/lib/auth";
import ProjectEditForm from "./projectEditForm";
import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
import Link from "next/link";

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
    <main className="app-page">
      <AppNav />

      <div className="app-page-header">
        <div>
          <h1 className="app-page-title">プロジェクト編集</h1>
          <p className="app-page-description">
            プロジェクト内容を編集します。
          </p>
        </div>

        <Link href={`/projects/${project.projectId}`} className="app-btn-secondary">
          詳細へ戻る
        </Link>
      </div>

      <section className="app-card">
        <ProjectEditForm project={project} priorities={priorities} statuses={statuses} />
      </section>
    </main>
  )
}