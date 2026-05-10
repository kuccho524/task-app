import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectCreateForm from "./projectCreateForm";

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
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex item-center justify-between">
        <h1 className="text-2xl font-bold">プロジェクト作成</h1>

        <Link href="/projects" className="rounded border px-4 py-2 text-sm">一覧へ戻る</Link>
      </div>

      <ProjectCreateForm priorities={priorities} statuses={statuses} />
    </main>
  )
}