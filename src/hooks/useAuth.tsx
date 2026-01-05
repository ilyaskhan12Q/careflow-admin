import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "doctor" | "pharmacist" | "lab_technician" | "receptionist" | "patient";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  roles: AppRole[];
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    roles: [],
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: false,
        }));

        // Fetch roles after auth state changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({ ...prev, roles: [] }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));

      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (!error && data) {
      setAuthState(prev => ({
        ...prev,
        roles: data.map((r) => r.role as AppRole),
      }));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      roles: [],
    });
  };

  const hasRole = (role: AppRole): boolean => {
    return authState.roles.includes(role);
  };

  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.some((role) => authState.roles.includes(role));
  };

  return {
    ...authState,
    signOut,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!authState.session,
  };
}
