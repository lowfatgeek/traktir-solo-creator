import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getEmailConfig, DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_BODY } from '@/lib/email'

export async function GET() {
  try {
    const config = await getEmailConfig()
    return NextResponse.json({ success: true, config })
  } catch (err: any) {
    // Return defaults on error
    return NextResponse.json({
      success: true,
      config: { subject: DEFAULT_EMAIL_SUBJECT, body: DEFAULT_EMAIL_BODY }
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id, subject, body } = await req.json()
    if (!subject || !body) {
      return NextResponse.json({ success: false, error: 'Subject dan body diperlukan' }, { status: 400 })
    }

    // Use supabase admin client (service role) to bypass RLS
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (id) {
      const { error } = await supabaseAdmin
        .from('email_config')
        .update({ subject, body })
        .eq('id', id)
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    } else {
      const { error } = await supabaseAdmin
        .from('email_config')
        .insert([{ subject, body }])
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[email-config POST] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
