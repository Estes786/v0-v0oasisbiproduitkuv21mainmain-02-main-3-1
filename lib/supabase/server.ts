import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Create Supabase Server Client
 * Use this in Server Components and Route Handlers
 */
export const createServerSupabaseClient = () => {
  return createServerComponentClient({
    cookies,
  })
}

/**
 * Get current session from server
 */
export const getServerSession = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user from server
 */
export const getServerUser = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
