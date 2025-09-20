"use server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function SignIn(formData: FormData) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: await cookies() }
  );
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function SignUp(formData: FormData) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: await cookies() }
  );
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}
    



 


