'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type SignUpState = {
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