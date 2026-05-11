import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// =====================================================
// Supabase admin client (server-side only)
// =====================================================
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =====================================================
// Default email template (HTML)
// =====================================================
export const DEFAULT_EMAIL_SUBJECT = 'Reward kamu dari {{page_title}} sudah siap! 🎉'

export const DEFAULT_EMAIL_BODY = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reward Kamu Sudah Siap!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 40px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:18px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:32px;">☕</span>
              </div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">Terima Kasih, {{donor_name}}!</h1>
              <p style="color:rgba(255,255,255,0.65);font-size:14px;margin:0;font-weight:500;">Traktiran kamu sudah kami terima dengan penuh syukur 🙏</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">Hei <strong>{{donor_name}}</strong>, sebagai bentuk apresiasi atas dukunganmu, reward spesial sudah kami siapkan untukmu!</p>

              <!-- Reward Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0f4ff 0%,#e8f0fe 100%);border-radius:16px;padding:0;margin-bottom:28px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;text-transform:uppercase;">Reward Kamu</p>
                    <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;color:#1e3a8a;">{{page_title}}</h2>
                    <a href="{{reward_url}}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                      🎁 Ambil Reward Sekarang
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:13px;line-height:1.7;margin:0 0 8px;">Jika tombol di atas tidak berfungsi, kamu bisa copy-paste link berikut ke browser:</p>
              <p style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:12px;color:#374151;word-break:break-all;margin:0 0 24px;">{{reward_url}}</p>

              <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;">Terima kasih sudah mendukung dan semoga reward ini bermanfaat! 🚀</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">
                Email ini dikirim otomatis oleh <strong>YukTraktir</strong>.<br/>
                Jika kamu tidak merasa melakukan transaksi ini, abaikan email ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// =====================================================
// Types
// =====================================================
export type EmailConfig = {
  subject: string
  body: string
}

// =====================================================
// Create transporter from env
// =====================================================
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// =====================================================
// Get email config from DB (with fallback to defaults)
// =====================================================
export async function getEmailConfig(): Promise<EmailConfig> {
  const { data, error } = await supabaseAdmin
    .from('email_config')
    .select('subject, body')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return {
      subject: DEFAULT_EMAIL_SUBJECT,
      body: DEFAULT_EMAIL_BODY,
    }
  }
  return data as EmailConfig
}

// =====================================================
// Replace template placeholders with actual values
// =====================================================
function renderTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (str, [key, value]) => str.replaceAll(`{{${key}}}`, value),
    template
  )
}

// =====================================================
// Send reward email to donor
// =====================================================
export async function sendRewardEmail({
  to,
  donorName,
  pageTitle,
  rewardUrl,
}: {
  to: string
  donorName: string
  pageTitle: string
  rewardUrl: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: 'SMTP not configured' }
    }

    const config = await getEmailConfig()
    const vars = {
      donor_name: donorName || 'Sobat',
      page_title: pageTitle,
      reward_url: rewardUrl,
    }

    const transporter = createTransporter()
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: renderTemplate(config.subject, vars),
      html: renderTemplate(config.body, vars),
    })

    return { success: true }
  } catch (err: any) {
    console.error('[sendRewardEmail] Error:', err)
    return { success: false, error: err.message }
  }
}

// =====================================================
// Test SMTP connection (for admin panel)
// =====================================================
export async function testSmtpConnection(testTo: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: 'Konfigurasi SMTP belum diisi di environment variables.' }
    }

    const transporter = createTransporter()
    await transporter.verify()

    // Send a test email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: testTo,
      subject: '✅ Test Email dari YukTraktir — SMTP Berhasil!',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px;">
          <h2 style="color:#1e3a8a;margin-top:0;">✅ Konfigurasi SMTP Berhasil!</h2>
          <p style="color:#374151;">Email ini merupakan test dari admin panel <strong>YukTraktir</strong>.</p>
          <p style="color:#374151;">Jika kamu menerima email ini, berarti konfigurasi SMTP sudah berjalan dengan baik.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;">Dikirim dari: ${process.env.SMTP_FROM || process.env.SMTP_USER}</p>
        </div>
      `,
    })

    return { success: true }
  } catch (err: any) {
    console.error('[testSmtpConnection] Error:', err)
    return { success: false, error: err.message }
  }
}
