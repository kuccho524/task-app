'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type SignUpState = {
  error?: string;
};

export type LoginState = {
  error?: string;
};

export async function signUp(
  _prevState: SignUpState,
  formData: FormData
  ): Promise<SignUpState> {

  const userName = String(formData.get('userName') ?? '');
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!userName) {
    return { error: 'ユーザー名は必須です', };
  }

  if (!email) {
    return { error: 'emailは必須です', };
  }

  if (!password) {
    return { error: 'パスワードは必須です', };
  }

  if (password.length < 8) {
    return { error: 'パスワードは8文字以上で入力してください', };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/login');
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email) {
    return { error: 'emailは必須です', };
  }

  if (!password) {
    return { error: 'パスワードは必須です', };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {

    console.error(error);

    return { error: 'メールアドレスまたはパスワードが正しくありません', };
  }

  redirect('/tasks');
}

export async function logout() {

  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect('/login');
}