import { requireAppUser } from "@/lib/auth";

export default async function tasksLayout({ children, }: { children: React.ReactNode } ) {
  await requireAppUser();

  return <>{children}</>;
}