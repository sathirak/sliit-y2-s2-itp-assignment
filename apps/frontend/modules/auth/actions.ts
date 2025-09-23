import { createClient } from '@/utils/supabase/client';

export async function signIn(data: { email: string; password: string }) {
  const supabase = createClient();
  
  const { email, password } = data;
  
  const { error, data: { user } } = await supabase.auth.signInWithPassword({ 
    email, 
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signUp(data: { email: string; password: string }) {
  const supabase = await createClient();
  
  const { email, password } = data;
  
  const { error } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  
  if (error) {
    console.error("Sign up error:", error);
    return { error: error.message };
  }
  
  return { success: true, message: "Check your email for verification link" };
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Sign out error:", error);
    return { error: error.message };
  }
}
    



 


