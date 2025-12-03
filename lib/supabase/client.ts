import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client for Client Components
 * Use this in React components (client-side)
 */
export const supabaseClient = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
})

/**
 * Supabase Client for Server Components
 * Use this for server-side operations
 */
export const supabaseServerClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Database Types
 */
export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier?: 'free' | 'professional' | 'enterprise'
  subscription_status?: 'active' | 'inactive' | 'trial' | 'cancelled'
  created_at: string
  updated_at?: string
}

export type Subscription = {
  id: string
  user_id: string
  plan: 'free' | 'professional' | 'enterprise'
  status: 'active' | 'inactive' | 'trial' | 'cancelled'
  start_date: string
  end_date?: string
  payment_method?: string
  amount?: number
  created_at: string
  updated_at?: string
}

export type Transaction = {
  id: string
  user_id: string
  subscription_id?: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  payment_gateway: 'xendit' | 'midtrans' | 'ipaymu' | 'duitku'
  payment_method: string
  transaction_id?: string
  metadata?: any
  created_at: string
  updated_at?: string
}
