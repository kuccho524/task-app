ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS user_code text;

CREATE SEQUENCE IF NOT EXISTS public.user_code_seq;

CREATE OR REPLACE FUNCTION public.generate_user_code()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN lpad(nextval('public.user_code_seq')::text, 6, '0');
END;
$$;

UPDATE public.users
SET user_code = lpad(nextval('public.user_code_seq')::text, 6, '0')
WHERE user_code IS NULL;

ALTER TABLE public.users
ALTER COLUMN user_code SET DEFAULT public.generate_user_code();

ALTER TABLE public.users
ALTER COLUMN user_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_user_code_key
ON public.users(user_code);