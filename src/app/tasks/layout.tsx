import { requireUser } from "@/lib/auth";

type TasksLayoutProps = {
  children: React.ReactNode;
};

export default async function asksLayout({ children }: TasksLayoutProps) {
  await requireUser();

  return <>{children}</>;
}