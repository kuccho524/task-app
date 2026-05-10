'use client';

import { useActionState } from "react";
import { signUp, type SignUpState } from "@/actions/authActions";
import Link from "next/link";

const initialState: SignUpState = {
  error: undefined,
};

const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {

  const result = window.confirm('ユーザー登録を実行します。よろしいですか？');

  if (!result) {
    event.preventDefault();
  }
}

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  return (
    <form action={formAction} onSubmit={handleSignUp} className="space-y-4">
      {state.error && (
        <div className="rounded border order-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-smm font-medium">ユーザー名</label>
        <input name="userName" className="w-full rounded border px-3 py-2" placeholder="ユーザー名を入力" />
      </div>

      <div>
        <label className="mb-1 block text-smm font-medium">メールアドレス</label>
        <input type="email" name="email" className="w-full rounded border px-3 py-2" placeholder="test@example.com" />
      </div>

      <div>
        <label className="mb-1 block text-smm font-medium">パスワード</label>
        <input type="password" name="password" className="w-full rounded border px-3 py-2" placeholder="8文字以上" />
      </div>

      <button type="submit" disabled={isPending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {isPending ? '登録中...' : '登録'}
      </button>

      <div className="text-sm">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" className="text-blue-600 underline">ログイン</Link>
      </div>
    </form>
  )
}