-- This is an empty migration.CREATE SEQUENCE IF NOT EXISTS public.project_id_seq;

CREATE OR REPLACE FUNCTION public.generate_project_id()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'prj' || lpad(nextval('public.project_id_seq')::text, 6, '0');
END;
$$;

SELECT setval(
  'public.project_id_seq',
  COALESCE(
    (
      SELECT MAX(SUBSTRING(project_id FROM 4)::int)
      FROM public.projects
      WHERE project_id ~ '^prj[0-9]{6}$'
    ),
    1
  ),
  EXISTS (
    SELECT 1
    FROM public.projects
    WHERE project_id ~ '^prj[0-9]{6}$'
  )
);

ALTER TABLE public.projects
ALTER COLUMN project_id SET DEFAULT public.generate_project_id();

ALTER TABLE public.users
ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.projects
ALTER COLUMN updated_at SET DEFAULT now();