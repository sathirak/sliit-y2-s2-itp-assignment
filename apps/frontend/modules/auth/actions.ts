"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function SignIn(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { error } = await supabase.auth.signInWithPassword({ 
    email, 
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
    redirect("/sign-in?error=Could not authenticate user");
  }
  
  revalidatePath("/", "layout");
  redirect("/");
}

export async function SignUp(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { error } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  
  if (error) {
    console.error("Sign up error:", error);
    redirect("/sign-up?error=Could not create user");
  }
  
  revalidatePath("/", "layout");
  redirect("/auth/confirm");
}

export async function SignOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Sign out error:", error);
    redirect("/error");
  }
  
  revalidatePath("/", "layout");
  redirect("/");
}
    



 


