import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  processMidtransWebhook,
  verifyMidtransSignature,
} from '@/lib/payment/midtrans'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const supabase = createServerSupabaseClient()

    // Verify signature
    const isValid = verifyMidtransSignature(
      payload.order_id,
      payload.status_code,
      payload.gross_amount,
      payload.signature_key
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Process webhook
    const webhookData = processMidtransWebhook(payload)

    // Update transaction status
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .update({
        status: webhookData.status,
        paid_at: webhookData.paidAt?.toISOString(),
        payment_method: payload.payment_type,
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
          payment_gateway: 'midtrans',
          payment_method: payload.payment_type,
          start_date: new Date().toISOString(),
          next_billing_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Midtrans webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
