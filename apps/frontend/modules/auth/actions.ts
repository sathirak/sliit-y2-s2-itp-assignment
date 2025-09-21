"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { error } = await supabase.auth.signInWithPassword({ 
    email, 
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
    redirect("/sign-in");
  }
  
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { error } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  
  if (error) {
    console.error("Sign up error:", error);
    redirect("/sign-up");
  }
  
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Sign out error:", error);
  }
  
  redirect("/");
}
    



 


