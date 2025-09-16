import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function PrivatePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: await cookies() }
  );
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/sign-in');
  }
  return <p>Hello {data.user.email}</p>;
}
