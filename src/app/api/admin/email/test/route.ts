import { NextRequest, NextResponse } from 'next/server';
import { getSmtpSettings } from '@/lib/email';
import nodemailer from 'nodemailer';

// POST — Test SMTP connection
export async function POST(req: NextRequest) {
  try {
    const { testEmail } = await req.json();
    const smtp = await getSmtpSettings();

    if (!smtp.host || !smtp.user || !smtp.pass) {
      return NextResponse.json({ error: 'SMTP settings are incomplete. Please fill in all fields and save first.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    // Verify connection
    await transporter.verify();

    // Send test email if address provided
    if (testEmail) {
      await transporter.sendMail({
        from: `"${smtp.fromName}" <${smtp.fromEmail || smtp.user}>`,
        to: testEmail,
        subject: 'SMTP Test — Beneera',
        text: 'This is a test email from your Beneera store. SMTP is configured correctly!',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa; text-align: center;">
              <h2 style="color: #f59e0b; margin: 0 0 12px;">✅ SMTP Connected!</h2>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Your email server is configured correctly. You can now send emails from your admin dashboard.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: testEmail ? `Test email sent to ${testEmail}` : 'SMTP connection verified' });
  } catch (err: any) {
    console.error('SMTP test error:', err);
    return NextResponse.json({ error: err.message || 'SMTP connection failed' }, { status: 500 });
  }
}
