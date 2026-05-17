import Link from 'next/link';
import { logout } from '@/actions/authActions';

export default function AppNav() {
  return (
    <nav className="mb-8 app-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold">Task App</p>
          <p className="text-xs text-gray-500">Project / Task Management</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/projects" className="app-btn-secondary">
            Project一覧
          </Link>

          <Link href="/tasks" className="app-btn-secondary">
            Task一覧
          </Link>

          <Link href="/projects/new" className="app-btn-primary">
            Project作成
          </Link>

          <Link href="/tasks/new" className="app-btn-primary">
            Task作成
          </Link>

          <form action={logout}>
            <button type="submit" className="app-btn-secondary">
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}