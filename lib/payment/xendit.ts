/**
 * Xendit Payment Gateway Integration
 * For OASIS BI PRO - Full-Stack SaaS
 */

const XENDIT_API_URL = 'https://api.xendit.co/v2'
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || ''

export interface XenditInvoiceParams {
  external_id: string
  amount: number
  payer_email: string
  description: string
  invoice_duration?: number // in seconds
  currency?: string
  success_redirect_url?: string
  failure_redirect_url?: string
  payment_methods?: string[]
  customer?: {
    given_names?: string
    email?: string
    mobile_number?: string
  }
}

export interface XenditInvoiceResponse {
  id: string
  external_id: string
  user_id: string
  status: string
  merchant_name: string
  amount: number
  payer_email: string
  description: string
  expiry_date: string
  invoice_url: string
  available_banks: any[]
  available_retail_outlets: any[]
  available_ewallets: any[]
  should_exclude_credit_card: boolean
  should_send_email: boolean
  created: string
  updated: string
  currency: string
}

/**
 * Create Xendit Invoice
 */
export async function createXenditInvoice(
  params: XenditInvoiceParams
): Promise<XenditInvoiceResponse> {
  try {
    const response = await fetch(`${XENDIT_API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        external_id: params.external_id,
        amount: params.amount,
        payer_email: params.payer_email,
        description: params.description,
        invoice_duration: params.invoice_duration || 86400, // 24 hours default
        currency: params.currency || 'IDR',
        success_redirect_url: params.success_redirect_url,
        failure_redirect_url: params.failure_redirect_url,
        payment_methods: params.payment_methods || [
          'CREDIT_CARD',
          'BCA',
          'MANDIRI',
          'BNI',
          'BRI',
          'PERMATA',
          'OVO',
          'DANA',
          'LINKAJA',
          'QRIS',
        ],
        customer: params.customer,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create Xendit invoice')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Xendit invoice creation error:', error)
    throw error
  }
}

/**
 * Get Xendit Invoice by ID
 */
export async function getXenditInvoice(
  invoiceId: string
): Promise<XenditInvoiceResponse> {
  try {
    const response = await fetch(`${XENDIT_API_URL}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get Xendit invoice')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Xendit invoice fetch error:', error)
    throw error
  }
}

/**
 * Verify Xendit Callback Token
 */
export function verifyXenditCallback(callbackToken: string): boolean {
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN || ''
  return callbackToken === expectedToken
}

/**
 * Process Xendit Webhook
 */
export interface XenditWebhookPayload {
  id: string
  external_id: string
  user_id: string
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'
  amount: number
  paid_amount?: number
  currency: string
  payment_method?: string
  payment_channel?: string
  payment_id?: string
  paid_at?: string
}

export function processXenditWebhook(
  payload: XenditWebhookPayload
): {
  transactionId: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  amount: number
  paidAt?: Date
} {
  let status: 'pending' | 'success' | 'failed' | 'cancelled' = 'pending'

  switch (payload.status) {
    case 'PAID':
      status = 'success'
      break
    case 'EXPIRED':
    case 'FAILED':
      status = 'failed'
      break
    default:
      status = 'pending'
  }

  return {
    transactionId: payload.external_id,
    status,
    amount: payload.amount,
    paidAt: payload.paid_at ? new Date(payload.paid_at) : undefined,
  }
}
