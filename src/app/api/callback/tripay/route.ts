import { NextRequest, NextResponse } from 'next/server';
import { verifyTriPayWebhook } from '@/lib/tripay';
import { createClient } from '@supabase/supabase-js';
import { sendRewardEmail } from '@/lib/email';

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

    const { error, data: updatedDonation } = await supabaseAdmin
      .from('donations')
      .update({ status: dbStatus, reference: reference })
      .eq('merchant_ref', merchant_ref)
      .select('id, name, donor_email, message')
      .single();

    if (error) {
      console.error('Error updating donation status:', error);
      return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }

    // Send reward email if payment is PAID and donor has provided an email
    if (dbStatus === 'PAID' && updatedDonation?.donor_email) {
      try {
        // Extract reward page slug from the message field (format: "... (Reward: <title>)")
        // We need to look up the reward URL from the message or via a separate query.
        // The message is stored as: "<user_message> (Reward: <page_title>)"
        // We need to match on the page title to get the reward_url.
        const messageField = updatedDonation.message || '';
        const rewardTitleMatch = messageField.match(/\(Reward: (.+)\)$/)
        const rewardTitle = rewardTitleMatch ? rewardTitleMatch[1] : 'Reward Eksklusif'

        // Fetch page data by title to get the reward URL
        const { data: pageData } = await supabaseAdmin
          .from('custom_pages')
          .select('reward_url, title')
          .eq('title', rewardTitle)
          .single()

        const rewardUrl = pageData?.reward_url || '#'
        const pageTitle = pageData?.title || rewardTitle

        await sendRewardEmail({
          to: updatedDonation.donor_email,
          donorName: updatedDonation.name || 'Sobat',
          pageTitle,
          rewardUrl,
        })
      } catch (emailErr) {
        // Don't fail the webhook response if email fails — log and continue
        console.error('Error sending reward email:', emailErr)
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
