import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createXenditInvoice } from '@/lib/payment/xendit'
import { getMidtransSnapToken } from '@/lib/payment/midtrans'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan, gateway = 'xendit' } = body

    // Plan pricing
    const planPricing: Record<string, number> = {
      professional: 299000,
      enterprise: 999000,
    }

    const amount = planPricing[plan] || 299000
    const externalId = `OASIS-${user.id}-${Date.now()}`

    // Get user details
    const { data: userData } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    let invoiceUrl = ''
    let invoiceId = ''
    let snapToken = ''

    if (gateway === 'xendit') {
      // Create Xendit Invoice
      const invoice = await createXenditInvoice({
        external_id: externalId,
        amount: amount,
        payer_email: userData?.email || user.email!,
        description: `OASIS BI PRO ${plan.toUpperCase()} Plan`,
        success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        customer: {
          given_names: userData?.full_name || 'Customer',
          email: userData?.email || user.email!,
        },
      })

      invoiceUrl = invoice.invoice_url
      invoiceId = invoice.id
    } else if (gateway === 'midtrans') {
      // Create Midtrans Snap Token
      snapToken = await getMidtransSnapToken({
        transaction_details: {
          order_id: externalId,
          gross_amount: amount,
        },
        customer_details: {
          first_name: userData?.full_name || 'Customer',
          email: userData?.email || user.email!,
        },
        item_details: [
          {
            id: plan,
            price: amount,
            quantity: 1,
            name: `OASIS BI PRO ${plan.toUpperCase()} Plan`,
          },
        ],
      })
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          transaction_id: externalId,
          external_id: externalId,
          amount: amount,
          currency: 'IDR',
          status: 'pending',
          payment_gateway: gateway,
          metadata: {
            plan: plan,
            invoice_id: invoiceId,
            snap_token: snapToken,
          },
        },
      ])
      .select()
      .single()

    if (txError) {
      console.error('Transaction creation error:', txError)
      return NextResponse.json(
        { error: 'Failed to create transaction record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction_id: externalId,
      invoice_url: invoiceUrl,
      snap_token: snapToken,
      gateway: gateway,
    })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment creation failed' },
      { status: 500 }
    )
  }
}
