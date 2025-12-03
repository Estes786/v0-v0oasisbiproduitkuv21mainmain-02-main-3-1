/**
 * DUITKU Payment Gateway Integration
 * API Documentation: https://docs.duitku.com/
 */

import crypto from 'crypto';
import axios from 'axios';

// Duitku Configuration - Updated with NEW merchant credentials
const DUITKU_CONFIG = {
  merchantCode: process.env.NEXT_PUBLIC_DUITKU_MERCHANT_CODE || 'DS26335',
  apiKey: process.env.DUITKU_API_KEY || '78cb96d8cb9ea9dc40d1c77068a659f6',
  sandboxMode: true, // Always sandbox for testing
  sandboxUrl: 'https://sandbox.duitku.com/webapi/api',
  productionUrl: 'https://passport.duitku.com/webapi/api',
};

// Get base URL based on mode
export const getDuitkuBaseUrl = () => {
  return DUITKU_CONFIG.sandboxMode
    ? DUITKU_CONFIG.sandboxUrl
    : DUITKU_CONFIG.productionUrl;
};

// Generate signature for API requests
export const generateSignature = (params: {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
}) => {
  const { merchantCode, amount, merchantOrderId } = params;
  const signature = crypto
    .createHash('md5')
    .update(`${merchantCode}${amount}${merchantOrderId}${DUITKU_CONFIG.apiKey}`)
    .digest('hex');
  return signature;
};

// Duitku Payment Methods
export interface DuitkuPaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

// Payment Request Interface
export interface DuitkuPaymentRequest {
  merchantOrderId: string;
  productDetails: string;
  paymentAmount: number;
  paymentMethod: string;
  customerVaName: string;
  email: string;
  phoneNumber?: string;
  itemDetails?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customerDetail?: {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
  };
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod?: number; // in minutes
}

// Payment Response Interface
export interface DuitkuPaymentResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  vaNumber?: string;
  qrString?: string;
  statusCode: string;
  statusMessage: string;
}

/**
 * Get Available Payment Methods
 * Returns list of payment methods with fees
 */
export const getPaymentMethods = async (amount: number): Promise<DuitkuPaymentMethod[]> => {
  try {
    const merchantCode = DUITKU_CONFIG.merchantCode;
    const datetime = new Date().getTime();
    
    // Generate signature for inquiry
    const signature = crypto
      .createHash('md5')
      .update(`${merchantCode}${amount}${datetime}${DUITKU_CONFIG.apiKey}`)
      .digest('hex');

    const response = await axios.post(
      `${getDuitkuBaseUrl()}/merchant/paymentmethod/getpaymentmethod`,
      {
        merchantcode: merchantCode,
        amount: amount,
        datetime: datetime,
        signature: signature,
      }
    );

    if (response.data.responseCode === '00') {
      return response.data.paymentFee;
    }

    throw new Error(response.data.responseMessage || 'Failed to fetch payment methods');
  } catch (error: any) {
    console.error('Duitku Get Payment Methods Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create Payment Transaction
 * Initiates payment and returns payment URL
 */
export const createPayment = async (
  paymentData: DuitkuPaymentRequest
): Promise<DuitkuPaymentResponse> => {
  try {
    const merchantCode = DUITKU_CONFIG.merchantCode;
    const {
      merchantOrderId,
      productDetails,
      paymentAmount,
      paymentMethod,
      customerVaName,
      email,
      phoneNumber,
      itemDetails,
      customerDetail,
      callbackUrl,
      returnUrl,
      expiryPeriod = 1440, // 24 hours default
    } = paymentData;

    // Generate signature
    const signature = generateSignature({
      merchantCode,
      amount: paymentAmount.toString(),
      merchantOrderId,
    });

    // Prepare request payload
    const payload = {
      merchantCode: merchantCode,
      paymentAmount: paymentAmount,
      paymentMethod: paymentMethod,
      merchantOrderId: merchantOrderId,
      productDetails: productDetails,
      customerVaName: customerVaName,
      email: email,
      phoneNumber: phoneNumber || '',
      itemDetails: itemDetails || [],
      customerDetail: customerDetail || {
        firstName: customerVaName,
        email: email,
      },
      callbackUrl: callbackUrl,
      returnUrl: returnUrl,
      signature: signature,
      expiryPeriod: expiryPeriod,
    };

    console.log('Creating Duitku Payment:', {
      merchantOrderId,
      amount: paymentAmount,
      method: paymentMethod,
    });

    const response = await axios.post(
      `${getDuitkuBaseUrl()}/merchant/v2/inquiry`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.statusCode === '00') {
      return response.data;
    }

    throw new Error(response.data.statusMessage || 'Payment creation failed');
  } catch (error: any) {
    console.error('Duitku Create Payment Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Check Transaction Status
 * Verify payment status from Duitku
 */
export const checkTransactionStatus = async (merchantOrderId: string) => {
  try {
    const merchantCode = DUITKU_CONFIG.merchantCode;
    
    // Generate signature
    const signature = crypto
      .createHash('md5')
      .update(`${merchantCode}${merchantOrderId}${DUITKU_CONFIG.apiKey}`)
      .digest('hex');

    const response = await axios.post(
      `${getDuitkuBaseUrl()}/merchant/transactionStatus`,
      {
        merchantCode: merchantCode,
        merchantOrderId: merchantOrderId,
        signature: signature,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Duitku Check Status Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Verify Callback Signature
 * Validate callback from Duitku to ensure authenticity
 */
export const verifyCallbackSignature = (
  merchantCode: string,
  amount: string,
  merchantOrderId: string,
  signature: string
): boolean => {
  const expectedSignature = crypto
    .createHash('md5')
    .update(`${merchantCode}${amount}${merchantOrderId}${DUITKU_CONFIG.apiKey}`)
    .digest('hex');

  return signature === expectedSignature;
};

/**
 * Payment Method Helpers
 */
export const PAYMENT_METHOD_CODES = {
  // Virtual Account
  BCA: 'BV',
  MANDIRI: 'VA',
  BNI: 'I1',
  BRI: 'BR',
  PERMATA: 'B1',
  CIMB: 'B2',
  DANAMON: 'DNA',
  
  // E-Wallet
  OVO: 'OV',
  DANA: 'DA',
  SHOPEE_PAY: 'SA',
  LINK_AJA: 'LA',
  
  // Credit Card
  CREDIT_CARD: 'CC',
  
  // Convenience Store
  ALFAMART: 'A1',
  INDOMARET: 'I1',
  
  // Others
  QRIS: 'NQ',
  PAYPAL: 'PP',
};

export const PAYMENT_METHOD_NAMES: Record<string, string> = {
  BV: 'BCA Virtual Account',
  VA: 'Mandiri Virtual Account',
  I1: 'BNI Virtual Account',
  BR: 'BRI Virtual Account',
  B1: 'Permata Virtual Account',
  B2: 'CIMB Niaga Virtual Account',
  DNA: 'Danamon Virtual Account',
  OV: 'OVO',
  DA: 'DANA',
  SA: 'ShopeePay',
  LA: 'LinkAja',
  CC: 'Credit/Debit Card',
  A1: 'Alfamart',
  I1: 'Indomaret',
  NQ: 'QRIS',
  PP: 'PayPal',
};

/**
 * Format Currency IDR
 */
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate Unique Order ID
 */
export const generateOrderId = (prefix: string = 'OASIS'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate Merchant Order ID for subscriptions
 */
export const generateMerchantOrderId = (planId: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `OASIS-${planId.toUpperCase()}-${timestamp}-${random}`;
};

/**
 * Subscription Plans
 */
export const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter',
    price: 99000,
    description: 'Perfect untuk startup dan SMEs',
  },
  professional: {
    name: 'Professional',
    price: 299000,
    description: 'Paling populer untuk growing businesses',
  },
  business: {
    name: 'Business',
    price: 499000,
    description: 'For large teams & enterprises',
  },
} as const;

/**
 * Create Duitku Payment for Subscription
 */
export interface DuitkuSubscriptionPaymentRequest {
  merchantOrderId: string;
  paymentAmount: number;
  productDetails: string;
  email: string;
  phoneNumber: string;
  customerName: string;
  planId: keyof typeof SUBSCRIPTION_PLANS;
  userId?: string;
}

export const createDuitkuPayment = async (
  request: DuitkuSubscriptionPaymentRequest
): Promise<{
  success: boolean;
  paymentUrl?: string;
  reference?: string;
  error?: string;
}> => {
  try {
    const {
      merchantOrderId,
      paymentAmount,
      productDetails,
      email,
      phoneNumber,
      customerName,
    } = request;

    // Get base URL
    const baseUrl = getDuitkuBaseUrl();
    const callbackUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/duitku/callback`
      : 'https://oasisbipro.com/api/duitku/callback';
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
      : 'https://oasisbipro.com/checkout/success';

    // Create payment data
    const paymentData: DuitkuPaymentRequest = {
      merchantOrderId,
      productDetails,
      paymentAmount,
      paymentMethod: 'VC', // Virtual Account default
      customerVaName: customerName,
      email,
      phoneNumber,
      callbackUrl,
      returnUrl,
      expiryPeriod: 1440, // 24 hours
    };

    // Call createPayment
    const result = await createPayment(paymentData);

    return {
      success: true,
      paymentUrl: result.paymentUrl,
      reference: result.reference,
    };
  } catch (error: any) {
    console.error('Create Duitku Payment Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to create payment',
    };
  }
};

/**
 * Check Duitku Payment Status
 */
export const checkDuitkuPaymentStatus = async (
  merchantOrderId: string
): Promise<{
  success: boolean;
  statusCode?: string;
  statusMessage?: string;
  data?: any;
  error?: string;
}> => {
  try {
    const result = await checkTransactionStatus(merchantOrderId);
    
    return {
      success: true,
      statusCode: result.statusCode,
      statusMessage: result.statusMessage,
      data: result,
    };
  } catch (error: any) {
    console.error('Check Duitku Payment Status Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to check payment status',
    };
  }
};

export default {
  getPaymentMethods,
  createPayment,
  checkTransactionStatus,
  checkDuitkuPaymentStatus,
  verifyCallbackSignature,
  generateSignature,
  generateOrderId,
  generateMerchantOrderId,
  createDuitkuPayment,
  formatIDR,
  PAYMENT_METHOD_CODES,
  PAYMENT_METHOD_NAMES,
  SUBSCRIPTION_PLANS,
};
