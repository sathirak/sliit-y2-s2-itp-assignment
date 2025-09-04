import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ConfirmPage({ searchParams }: { searchParams: { token_hash?: string; type?: string } }) {
  if (!searchParams.token_hash || !searchParams.type) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">Invalid confirmation link.</div>;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: await cookies() }
  );

  const { error } = await supabase.auth.verifyOtp({
    type: searchParams.type as "email",
    token_hash: searchParams.token_hash,
  });

  if (error) {
    return <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">Confirmation failed: {error.message}</div>;
  }

  redirect("/sign-in");
}
