import { requireAppUser } from "@/lib/auth";

export default async function projetctsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAppUser();

  return <>{children}</>;
}