export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded border px-3 py-2"
            placeholder="test@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            パスワード
          </label>
          <input
            type="password"
            name="password"
            className="w-full rounded border px-3 py-2"
            placeholder="password"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}