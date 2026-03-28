'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createTriPayTransaction } from '@/lib/tripay'
import crypto from 'crypto'

async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// === Donations ===

export async function submitDonation(data: { name: string; amount: number; message: string }) {
  const supabase = await createClient()
  
  const merchantRef = `TRK-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  
  try {
    const tripayResponse = await createTriPayTransaction({
      method: 'QRIS',
      merchant_ref: merchantRef,
      amount: data.amount,
      customer_name: data.name || 'Anonim',
      customer_email: 'customer@example.com', 
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}`, // Will be handled by the client if empty
      order_items: [
        {
          name: 'Donasi Traktir',
          price: data.amount,
          quantity: 1,
        }
      ]
    });

    const { data: donation, error } = await supabase.from('donations').insert([
      {
        name: data.name || 'Anonim',
        amount: data.amount,
        message: data.message,
        merchant_ref: merchantRef,
        reference: tripayResponse.reference,
        payment_method: 'QRIS',
        qr_url: tripayResponse.qr_url,
        payment_url: tripayResponse.checkout_url,
        status: 'PENDING',
      },
    ]).select().single()

    if (error) {
      console.error('Error submitting donation:', error)
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      payment: {
        id: donation.id,
        checkout_url: tripayResponse.checkout_url,
        merchant_ref: merchantRef,
      } 
    }
  } catch (error: any) {
    console.error('TriPay Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getDonationStats() {
  const supabase = await createClient()
  
  // Get total count
  const { count, error: countError } = await supabase
    .from('donations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PAID')
    
  if (countError) {
    console.error('Error fetching donation count:', countError)
    return { count: 0, totalAmount: 0 }
  }

  // Get total amount
  const { data, error: amountError } = await supabase
    .from('donations')
    .select('amount')
    .eq('status', 'PAID')

  if (amountError) {
    console.error('Error fetching donation amounts:', amountError)
    return { count: count || 0, totalAmount: 0 }
  }

  const totalAmount = data ? data.reduce((sum, row) => sum + Number(row.amount), 0) : 0

  return { count: count || 0, totalAmount }
}

export async function getRecentDonations(limit = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('status', 'PAID')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent donations:', error)
    return []
  }
  return data
}

// === Custom Pages ===

export async function getCustomPages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching custom pages:', error)
    return []
  }
  return data
}

export async function getCustomPageBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching custom page by slug:', error)
    return null
  }
  return data
}

export async function createCustomPage(data: { slug: string; title: string; reward_url: string; reward_image_url?: string }) {
  const supabase = await createClient()
  
  // Verify Admin first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase.from('custom_pages').insert([
    {
      slug: data.slug,
      title: data.title,
      reward_url: data.reward_url,
      reward_image_url: data.reward_image_url,
    },
  ])

  if (error) {
    console.error('Error creating custom page:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function updateCustomPage(id: string, data: { slug: string; title: string; reward_url: string; reward_image_url?: string }) {
  const supabase = await createClient()
  
  // Verify Admin first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('custom_pages')
    .update({
      slug: data.slug,
      title: data.title,
      reward_url: data.reward_url,
      reward_image_url: data.reward_image_url,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating custom page:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function deleteCustomPage(id: string) {
  const supabase = await createClient()
  
  // Verify Admin first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase.from('custom_pages').delete().eq('id', id)

  if (error) {
    console.error('Error deleting custom page:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
