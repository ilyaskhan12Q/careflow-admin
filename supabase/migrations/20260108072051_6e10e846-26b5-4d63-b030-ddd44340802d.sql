-- Drop the policy that allows users to insert their own role (security vulnerability)
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- Create policy so only admins can insert roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));