CREATE SEQUENCE IF NOT EXISTS public.task_id_seq;

CREATE OR REPLACE FUNCTION public.generate_task_id()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'tsk' || lpad(nextval('public.task_id_seq')::text, 6, '0');
END;
$$;

SELECT setval(
  'public.task_id_seq',
  COALESCE(
    (
      SELECT MAX(SUBSTRING(task_id FROM 4)::int)
      FROM public.tasks
      WHERE task_id ~ '^tsk[0-9]{6}$'
    ),
    1
  ),
  EXISTS (
    SELECT 1
    FROM public.tasks
    WHERE task_id ~ '^tsk[0-9]{6}$'
  )
);

ALTER TABLE public.tasks
ALTER COLUMN task_id SET DEFAULT public.generate_task_id();