import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client.
 *
 * The Vercel Supabase integration currently exposes these variables with
 * NEXT_PUBLIC_ prefixes. This file is only imported by Route Handlers, so the
 * service-role key never needs to be sent to the browser.
 *
 * The old variable names are kept as fallbacks so local development continues
 * to work with an existing .env.local file.
 */
export function adminSupabase() {
  const url =
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase server environment variables are missing')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
