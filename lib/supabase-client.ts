import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database
export interface User {
  id: string
  email: string
  name?: string
  company?: string
  plan?: 'starter' | 'professional' | 'enterprise'
  created_at: string
  subscription_status?: 'active' | 'canceled' | 'expired'
}

export interface AnalyticsData {
  id: string
  user_id: string
  total_revenue: number
  total_users: number
  active_users: number
  conversion_rate: number
  created_at: string
}
