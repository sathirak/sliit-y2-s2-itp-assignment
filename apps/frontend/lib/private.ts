"use client";

import { createClient } from '@/utils/supabase/client';
import ky from "ky";
export const apiPrivateClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = async (): Promise<string | undefined> => {
          const supabase = createClient();
          return (await supabase.auth.getSession()).data.session?.access_token;
        };

        const token = await accessToken();
        console.log("Adding auth token to request", token);

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
