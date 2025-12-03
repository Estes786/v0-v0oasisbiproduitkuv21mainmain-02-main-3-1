// Supabase Edge Function: Get User Analytics
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Mock analytics data - Replace with real database queries
    const analytics = {
      revenue: {
        current: 45800000, // Rp 45.8 juta
        previous: 38200000,
        change: '+19.9%',
      },
      orders: {
        current: 128,
        previous: 98,
        change: '+30.6%',
      },
      customers: {
        current: 89,
        previous: 67,
        change: '+32.8%',
      },
      conversion: {
        current: 3.2,
        previous: 2.8,
        change: '+0.4%',
      },
      charts: {
        revenue: [
          { month: 'Jan', value: 12000000 },
          { month: 'Feb', value: 15000000 },
          { month: 'Mar', value: 18000000 },
          { month: 'Apr', value: 22000000 },
          { month: 'May', value: 28000000 },
          { month: 'Jun', value: 45800000 },
        ],
        orders: [
          { month: 'Jan', value: 45 },
          { month: 'Feb', value: 58 },
          { month: 'Mar', value: 72 },
          { month: 'Apr', value: 88 },
          { month: 'May', value: 102 },
          { month: 'Jun', value: 128 },
        ],
      },
    }

    return new Response(
      JSON.stringify({ success: true, data: analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
