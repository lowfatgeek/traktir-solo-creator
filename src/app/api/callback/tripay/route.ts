import { NextRequest, NextResponse } from 'next/server';
import { verifyTriPayWebhook } from '@/lib/tripay';
import { createClient } from '@supabase/supabase-js';

// Use Service Role Key for Admin access to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const callbackSignature = req.headers.get('x-callback-signature');
    const body = await req.json();
    const jsonPayload = JSON.stringify(body);

    if (!callbackSignature || !verifyTriPayWebhook(jsonPayload, callbackSignature)) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 403 });
    }

    const { status, merchant_ref, reference } = body;

    // Map TriPay status to our status
    let dbStatus = 'PENDING';
    if (status === 'PAID') dbStatus = 'PAID';
    if (status === 'EXPIRED') dbStatus = 'EXPIRED';
    if (status === 'FAILED') dbStatus = 'FAILED';

    const { error } = await supabaseAdmin
      .from('donations')
      .update({ status: dbStatus, reference: reference })
      .eq('merchant_ref', merchant_ref);

    if (error) {
      console.error('Error updating donation status:', error);
      return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
