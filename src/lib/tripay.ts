import crypto from 'crypto';

const MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE!;
const PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY!;
const API_KEY = process.env.TRIPAY_API_KEY!;
const BASE_URL = process.env.TRIPAY_BASE_URL || 'https://tripay.co.id/api-sandbox/';

export interface TriPayTransactionPayload {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: {
    sku?: string;
    name: string;
    price: number;
    quantity: number;
    product_url?: string;
    image_url?: string;
  }[];
  callback_url?: string;
  return_url?: string;
  expired_time?: number; // timestamp
  signature?: string;
}

export const createTriPayTransaction = async (payload: TriPayTransactionPayload) => {
  const { merchant_ref, amount } = payload;
  
  // Signature: HMAC-SHA256(merchantCode + merchantRef + amount, privateKey)
  const signature = crypto
    .createHmac('sha256', PRIVATE_KEY)
    .update(MERCHANT_CODE + merchant_ref + amount)
    .digest('hex');

  const response = await fetch(`${BASE_URL}transaction/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      ...payload,
      signature,
    }),
  });

  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to create TriPay transaction');
  }

  return result.data;
};

export const verifyTriPayWebhook = (payload: string, callbackSignature: string) => {
  const signature = crypto
    .createHmac('sha256', PRIVATE_KEY)
    .update(payload)
    .digest('hex');

  return signature === callbackSignature;
};
