import LoginForm from "./loginForm";

export default function loginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

      <LoginForm />
    </main>
  );
}