/**
 * Midtrans Payment Gateway Integration
 * For OASIS BI PRO - Full-Stack SaaS
 */

const MIDTRANS_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.midtrans.com/v2' 
  : 'https://api.sandbox.midtrans.com/v2'

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ''

export interface MidtransTransactionParams {
  transaction_details: {
    order_id: string
    gross_amount: number
  }
  customer_details: {
    first_name: string
    email: string
    phone?: string
  }
  item_details: {
    id: string
    price: number
    quantity: number
    name: string
  }[]
  enabled_payments?: string[]
}

export interface MidtransTransactionResponse {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  merchant_id: string
  gross_amount: string
  currency: string
  payment_type: string
  transaction_time: string
  transaction_status: string
  fraud_status: string
  redirect_url?: string
  token?: string
}

/**
 * Create Midtrans Snap Transaction
 */
export async function createMidtransTransaction(
  params: MidtransTransactionParams
): Promise<MidtransTransactionResponse> {
  try {
    const response = await fetch(`${MIDTRANS_API_URL}/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        payment_type: 'gopay',
        ...params,
        enabled_payments: params.enabled_payments || [
          'credit_card',
          'bca_va',
          'bni_va',
          'bri_va',
          'permata_va',
          'gopay',
          'shopeepay',
          'qris',
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.status_message || 'Failed to create Midtrans transaction')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Midtrans transaction creation error:', error)
    throw error
  }
}

/**
 * Get Midtrans Snap Token (for frontend)
 */
export async function getMidtransSnapToken(
  params: MidtransTransactionParams
): Promise<string> {
  try {
    const response = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
        },
        body: JSON.stringify(params),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.status_message || 'Failed to get Midtrans snap token')
    }

    const data = await response.json()
    return data.token
  } catch (error: any) {
    console.error('Midtrans snap token error:', error)
    throw error
  }
}

/**
 * Check Midtrans Transaction Status
 */
export async function getMidtransTransactionStatus(
  orderId: string
): Promise<MidtransTransactionResponse> {
  try {
    const response = await fetch(`${MIDTRANS_API_URL}/${orderId}/status`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.status_message || 'Failed to get Midtrans transaction status')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Midtrans transaction status error:', error)
    throw error
  }
}

/**
 * Verify Midtrans Notification Signature
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto')
  const serverKey = MIDTRANS_SERVER_KEY
  
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex')
  
  return hash === signatureKey
}

/**
 * Process Midtrans Webhook
 */
export interface MidtransWebhookPayload {
  transaction_time: string
  transaction_status: string
  transaction_id: string
  status_message: string
  status_code: string
  signature_key: string
  payment_type: string
  order_id: string
  merchant_id: string
  masked_card?: string
  gross_amount: string
  fraud_status: string
  currency: string
}

export function processMidtransWebhook(
  payload: MidtransWebhookPayload
): {
  transactionId: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  amount: number
  paidAt?: Date
} {
  let status: 'pending' | 'success' | 'failed' | 'cancelled' = 'pending'

  switch (payload.transaction_status) {
    case 'capture':
    case 'settlement':
      status = 'success'
      break
    case 'deny':
    case 'expire':
    case 'cancel':
      status = 'failed'
      break
    case 'pending':
      status = 'pending'
      break
    default:
      status = 'pending'
  }

  return {
    transactionId: payload.order_id,
    status,
    amount: parseFloat(payload.gross_amount),
    paidAt: payload.transaction_status === 'settlement' 
      ? new Date(payload.transaction_time) 
      : undefined,
  }
}
