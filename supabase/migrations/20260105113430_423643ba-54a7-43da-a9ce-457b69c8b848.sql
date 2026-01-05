-- Enable realtime for user_roles table (ignore if already exists)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Enable realtime for profiles table (ignore if already exists)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Enable realtime for patients table (ignore if already exists)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Enable realtime for doctors table (ignore if already exists)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add admin policy to update user roles
DROP POLICY IF EXISTS "Admins can update all roles" ON public.user_roles;
CREATE POLICY "Admins can update all roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin policy to delete user roles
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));