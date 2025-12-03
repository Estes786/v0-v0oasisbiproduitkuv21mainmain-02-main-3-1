// Supabase Edge Function: Get User Integrations
// Real backend logic for data source connections

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

    // Get user's integrations
    const { data: integrations, error: integrationsError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)

    if (integrationsError) {
      throw integrationsError
    }

    // Format response
    const formattedIntegrations = integrations.map((integration) => ({
      id: integration.id,
      provider: integration.provider,
      provider_type: integration.provider_type,
      status: integration.status,
      last_synced: integration.last_synced_at,
      sync_frequency: integration.sync_frequency,
      settings: integration.settings,
    }))

    return new Response(JSON.stringify(formattedIntegrations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
