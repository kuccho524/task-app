import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "./prisma";

export async function requireUser() {

  const supabase = await createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      redirect('/login');
    }

    return user;
}

export async function requireAppUser() {

  const supabase = await createClient();

  const { data: { user}, } = await supabase.auth.getUser();

  const appUser = await prisma.user.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!appUser) {
    throw new Error('アプリユーザー情報が見つかりません');
  }

  return appUser;
}