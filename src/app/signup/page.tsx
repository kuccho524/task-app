import SignUpForm from "./signUpForm";

export default function signUpPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">ユーザー登録</h1>
      <SignUpForm />
    </main>
  );
}