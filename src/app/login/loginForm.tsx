'use client';

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/actions/authActions";

const initialState: LoginState = {
  error: undefined,
};

export default function LoginForm() {

  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded border border-red-300 bgred-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">メールアドレス</label>
        <input type="email" name="email" className="w-full rounded border px-3 py-2" placeholder="test@example.com" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">パスワード</label>
        <input type="password" name="password" className="w-full rounded border px-3 py-2" placeholder="パスワード" />
      </div>

      <button type="submit" disabled={isPending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {isPending ? 'ログイン中...' : 'ログイン'}
      </button>

      <div className="text-sm">
        すでにアカウントをお持ちでない方は{' '}
        <Link href="/signup" className="text-blue-600 underline">ユーザー登録</Link>
      </div>
    </form>
  );
}