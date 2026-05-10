ALTER TABLE public.users
ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.projects
ALTER COLUMN updated_at SET DEFAULT now();