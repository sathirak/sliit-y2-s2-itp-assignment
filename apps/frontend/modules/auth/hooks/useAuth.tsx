"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/services/user";
import { useAuthStore } from '@/lib/stores/auth.store';
import { createClient } from "@/utils/supabase/client";


export type RedirectOptions = {
  authenticated?: string;
  unauthenticated?: string;
};

export const useAuth = () => {
  const supabase = createClient();



  const { user: storeUser, setUser, removeUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = await getUser();
          if (mounted) setUser(user);
        } else {
          if (mounted) setUser(null);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [setUser, supabase]);

  const logout = async () => {
    removeUser();
    await supabase.auth.signOut();
  };

  return {
    user: storeUser,
    isAuthorized: !!storeUser,
    isLoading,
    logout,
    error,
    isError: !!error,
  };
};
