import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectCreateForm from "./projectCreateForm";
import AppNav from "@/components/AppNav";

export const dynamic = 'force-dynamic';

export default async function newProjectPage() {

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
          <h1 className="app-page-title">プロジェクト作成</h1>
          <p className="app-page-description">
            新しいプロジェクトを登録します。
          </p>
        </div>

        <Link href="/tasks" className="app-btn-secondary">
          一覧へ戻る
        </Link>
      </div>

      <section className="app-card">
        <ProjectCreateForm priorities={priorities} statuses={statuses} />
      </section>
    </main>
  )
}