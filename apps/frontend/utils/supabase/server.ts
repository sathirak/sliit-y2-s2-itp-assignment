"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    'https://fcwuatyclrkywpvycrji.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd3VhdHljbHJreXdwdnljcmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTU5OTcsImV4cCI6MjA2OTc5MTk5N30.hqapsaaBfkzUQONNiCRLcr4O7KdgjTKhhKVS1a7IGQQ',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}