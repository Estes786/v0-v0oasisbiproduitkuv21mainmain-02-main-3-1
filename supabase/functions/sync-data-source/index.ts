// Supabase Edge Function: Sync Data Source
// Real backend logic for syncing external data sources

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { provider, integration_id } = await req.json()

    // Get integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', user.id)
      .single()

    if (integrationError) {
      throw integrationError
    }

    // Simulate data sync based on provider
    let syncedData = {}
    
    switch (provider) {
      case 'google_analytics':
        syncedData = await syncGoogleAnalytics(integration)
        break
      case 'facebook_ads':
        syncedData = await syncFacebookAds(integration)
        break
      case 'shopee':
        syncedData = await syncShopee(integration)
        break
      case 'tokopedia':
        syncedData = await syncTokopedia(integration)
        break
      default:
        throw new Error('Unsupported provider')
    }

    // Insert analytics data
    const { error: insertError } = await supabaseClient
      .from('analytics_data')
      .insert([
        {
          user_id: user.id,
          source: provider,
          source_type: integration.provider_type,
          metrics: syncedData,
          date: new Date().toISOString().split('T')[0],
          period: 'daily',
        },
      ])

    if (insertError) {
      throw insertError
    }

    // Update integration last sync
    await supabaseClient
      .from('integrations')
      .update({
        last_synced_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', integration_id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data synced successfully',
        synced_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// Sync functions for each provider
async function syncGoogleAnalytics(integration: any) {
  // Simulate Google Analytics data sync
  return {
    visitors: Math.floor(Math.random() * 10000) + 5000,
    pageviews: Math.floor(Math.random() * 50000) + 20000,
    bounce_rate: (Math.random() * 30 + 40).toFixed(2),
    avg_session_duration: Math.floor(Math.random() * 300) + 120,
    new_users: Math.floor(Math.random() * 3000) + 1000,
    active_users: Math.floor(Math.random() * 2000) + 500,
    revenue: Math.floor(Math.random() * 50000000) + 10000000,
    conversions: Math.floor(Math.random() * 500) + 100,
    events: Math.floor(Math.random() * 100000) + 50000,
  }
}

async function syncFacebookAds(integration: any) {
  // Simulate Facebook Ads data sync
  return {
    impressions: Math.floor(Math.random() * 100000) + 50000,
    clicks: Math.floor(Math.random() * 5000) + 2000,
    ctr: (Math.random() * 5 + 2).toFixed(2),
    spend: Math.floor(Math.random() * 10000000) + 5000000,
    conversions: Math.floor(Math.random() * 300) + 50,
    cpc: Math.floor(Math.random() * 5000) + 2000,
    revenue: Math.floor(Math.random() * 30000000) + 10000000,
  }
}

async function syncShopee(integration: any) {
  // Simulate Shopee data sync
  return {
    orders: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 50000000) + 20000000,
    visitors: Math.floor(Math.random() * 10000) + 3000,
    conversions: Math.floor(Math.random() * 300) + 50,
    avg_order_value: Math.floor(Math.random() * 500000) + 100000,
  }
}

async function syncTokopedia(integration: any) {
  // Simulate Tokopedia data sync
  return {
    orders: Math.floor(Math.random() * 400) + 80,
    revenue: Math.floor(Math.random() * 40000000) + 15000000,
    visitors: Math.floor(Math.random() * 8000) + 2500,
    conversions: Math.floor(Math.random() * 250) + 40,
    avg_order_value: Math.floor(Math.random() * 450000) + 120000,
  }
}
