// Supabase Edge Function: Generate Report
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { reportType, period } = await req.json()

    // Simulate report generation
    const report = {
      id: `report_${Date.now()}`,
      type: reportType || 'revenue',
      period: period || 'monthly',
      generatedAt: new Date().toISOString(),
      status: 'completed',
      data: {
        totalRevenue: 45800000,
        totalOrders: 128,
        averageOrderValue: 357812,
        topProducts: [
          { name: 'Professional Plan', revenue: 28800000, count: 48 },
          { name: 'Starter Plan', revenue: 12000000, count: 60 },
          { name: 'Enterprise Plan', revenue: 5000000, count: 20 },
        ],
      },
    }

    return new Response(
      JSON.stringify({ success: true, data: report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
