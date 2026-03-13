import nodemailer from 'nodemailer';
import { getSetting } from '@/lib/settings';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function getSmtpSettings() {
  const [host, port, user, pass, fromEmail, fromName, secure] = await Promise.all([
    getSetting('smtp_host', 'SMTP_HOST'),
    getSetting('smtp_port', 'SMTP_PORT'),
    getSetting('smtp_user', 'SMTP_USER'),
    getSetting('smtp_pass', 'SMTP_PASS'),
    getSetting('smtp_from_email', 'SMTP_FROM_EMAIL'),
    getSetting('smtp_from_name', 'SMTP_FROM_NAME'),
    getSetting('smtp_secure', 'SMTP_SECURE'),
  ]);

  return { host, port: parseInt(port || '587'), user, pass, fromEmail, fromName: fromName || 'Beneera', secure: secure === 'true' };
}

export async function sendEmail({ to, subject, text, html, replyTo }: EmailOptions) {
  const smtp = await getSmtpSettings();

  if (!smtp.host || !smtp.user || !smtp.pass) {
    throw new Error('SMTP not configured. Go to Admin → Settings → Email to set up your email server.');
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const result = await transporter.sendMail({
    from: `"${smtp.fromName}" <${smtp.fromEmail || smtp.user}>`,
    to,
    subject,
    text: text || '',
    html: html || undefined,
    replyTo: replyTo || smtp.fromEmail || smtp.user,
  });

  return result;
}

// Pre-built email templates
export function inquiryReplyHtml(customerName: string, replyBody: string, storeName: string = 'Beneera') {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">${storeName}</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Customer Support</p>
        <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
          Hi ${customerName.split(' ')[0]},
        </p>
        <div style="font-size: 15px; line-height: 1.7; color: #d4d4d8; margin: 0 0 24px; white-space: pre-wrap;">${replyBody}</div>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
        <p style="font-size: 13px; color: #71717a; margin: 0;">
          Best regards,<br/>
          <strong style="color: #a1a1aa;">${storeName} Support Team</strong>
        </p>
      </div>
      <p style="font-size: 11px; color: #a1a1aa; text-align: center; margin-top: 16px;">
        This email was sent by ${storeName}. If you didn't contact us, please ignore this message.
      </p>
    </div>
  `;
}

export function orderConfirmationHtml(customerName: string, orderNumber: string, total: string, storeName: string = 'Beneera') {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">${storeName}</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Order Confirmation</p>
        <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
          Hi ${customerName.split(' ')[0]},
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 16px;">
          Thank you for your order! We've received your purchase and are getting it ready.
        </p>
        <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #a1a1aa;">Order Number</p>
          <p style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #f59e0b;">${orderNumber}</p>
          <p style="margin: 0 0 4px; font-size: 13px; color: #a1a1aa;">Total</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #fafafa;">$${total}</p>
        </div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0;">
          You'll receive a shipping confirmation email with tracking details once your order ships.
        </p>
      </div>
    </div>
  `;
}

export function contactConfirmationHtml(customerName: string, subject: string, storeName: string = 'Beneera') {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">${storeName}</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Message Received</p>
        <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
          Hi ${customerName.split(' ')[0]},
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 16px;">
          Thank you for reaching out! We've received your message regarding <strong style="color: #e4e4e7;">"${subject}"</strong> and will get back to you as soon as possible.
        </p>
        <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Our typical response time is <strong style="color: #f59e0b;">24-48 hours</strong>.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
        <p style="font-size: 13px; color: #71717a; margin: 0;">
          Best regards,<br/>
          <strong style="color: #a1a1aa;">${storeName} Support Team</strong>
        </p>
      </div>
    </div>
  `;
}

export function adminNewInquiryHtml(name: string, email: string, subject: string, message: string, type: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">New Inquiry Received</h2>
        <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">A customer has submitted a ${type} form</p>
        <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 16px;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">From</p>
          <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #fafafa;">${name}</p>
          <p style="margin: 0 0 16px; font-size: 13px; color: #a1a1aa;">${email}</p>
          <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Subject</p>
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #f59e0b;">${subject}</p>
        </div>
        <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 16px;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Message</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #d4d4d8; white-space: pre-wrap;">${message}</p>
        </div>
        <a href="https://www.beneera.com/admin/inquiries" style="display: inline-block; background: #f59e0b; color: #18181b; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">View in Dashboard →</a>
      </div>
    </div>
  `;
}

export function newsletterWelcomeHtml(storeName: string = 'Beneera') {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa; text-align: center;">
        <h2 style="margin: 0 0 8px; font-size: 24px; color: #f59e0b;">Welcome to ${storeName}! 🎉</h2>
        <p style="margin: 0 0 24px; font-size: 15px; color: #a1a1aa;">Thanks for subscribing to our newsletter</p>
        <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 24px;">
          You'll be the first to know about new products, exclusive deals, and helpful automotive tips.
        </p>
        <a href="https://www.beneera.com/shop" style="display: inline-block; background: #f59e0b; color: #18181b; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600;">Browse Our Shop →</a>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
        <p style="font-size: 12px; color: #71717a; margin: 0;">
          You received this email because you subscribed to ${storeName} newsletter.
        </p>
      </div>
    </div>
  `;
}

/**
 * Fire-and-forget email sending — won't throw errors, just logs them.
 * Use this for non-critical emails (confirmations, notifications).
 */
export async function trySendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await sendEmail(options);
    return true;
  } catch (err) {
    console.log('Email not sent (SMTP may not be configured):', (err as Error).message);
    return false;
  }
}
