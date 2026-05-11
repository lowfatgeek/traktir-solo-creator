import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { testSmtpConnection } from '@/lib/email'

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

    const { to } = await req.json()
    if (!to || !to.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email tujuan tidak valid' }, { status: 400 })
    }

    const result = await testSmtpConnection(to)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[test-email] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
