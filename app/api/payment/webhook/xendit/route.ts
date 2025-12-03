import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { processXenditWebhook, verifyXenditCallback } from '@/lib/payment/xendit'

export async function POST(request: NextRequest) {
  try {
    const callbackToken = request.headers.get('x-callback-token') || ''
    
    // Verify callback token
    if (!verifyXenditCallback(callbackToken)) {
      return NextResponse.json(
        { error: 'Invalid callback token' },
        { status: 401 }
      )
    }

    const payload = await request.json()
    const supabase = createServerSupabaseClient()

    // Process webhook
    const webhookData = processXenditWebhook(payload)

    // Update transaction status
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .update({
        status: webhookData.status,
        paid_at: webhookData.paidAt?.toISOString(),
        gateway_response: payload,
        updated_at: new Date().toISOString(),
      })
      .eq('external_id', webhookData.transactionId)
      .select()
      .single()

    if (txError) {
      console.error('Transaction update error:', txError)
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    // If payment successful, update user subscription
    if (webhookData.status === 'success' && transaction) {
      const plan = transaction.metadata?.plan || 'professional'
      
      // Update user subscription tier
      await supabase
        .from('users')
        .update({
          subscription_tier: plan,
          subscription_status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.user_id)

      // Create subscription record
      await supabase.from('subscriptions').insert([
        {
          user_id: transaction.user_id,
          plan: plan,
          status: 'active',
          amount: transaction.amount,
          currency: transaction.currency,
          payment_gateway: 'xendit',
          payment_method: payload.payment_method || 'unknown',
          start_date: new Date().toISOString(),
          next_billing_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Xendit webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
