import Link from 'next/link';
import { logout } from '@/actions/authActions';

export default function AppNav() {
  return (
    <nav className="mb-6 rounded border p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Link
            href="/projects"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Project一覧
          </Link>

          <Link
            href="/tasks"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Task一覧
          </Link>

          <Link
            href="/projects/new"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Project作成
          </Link>

          <Link
            href="/tasks/new"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Task作成
          </Link>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            ログアウト
          </button>
        </form>
      </div>
    </nav>
  );
}