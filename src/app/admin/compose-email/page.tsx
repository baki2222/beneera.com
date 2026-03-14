'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, Paperclip, Eye, Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminComposeEmailPage() {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [htmlMode, setHtmlMode] = useState(false);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [sentEmails, setSentEmails] = useState<Array<{ to: string; subject: string; time: string }>>([]);

    const wrapInTemplate = (content: string) => {
        if (htmlMode) return content;
        // Convert plain text to styled HTML
        const escaped = content
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\n/g, '<br/>');
        return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">Beneera</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">${subject || 'Message'}</p>
    <div style="font-size: 15px; line-height: 1.7; color: #d4d4d8; margin: 0 0 24px;">${escaped}</div>
    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
    <p style="font-size: 13px; color: #71717a; margin: 0;">
      Best regards,<br/>
      <strong style="color: #a1a1aa;">Beneera Support Team</strong>
    </p>
  </div>
  <p style="font-size: 11px; color: #a1a1aa; text-align: center; margin-top: 16px;">
    Beneera — Premium Auto Parts &amp; Accessories
  </p>
</div>`;
    };

    const handleSend = async () => {
        if (!to || !subject || !body) {
            setResult({ success: false, message: 'Please fill in To, Subject, and Message fields.' });
            return;
        }
        setSending(true);
        setResult(null);
        try {
            const recipients = to.split(',').map(e => e.trim()).filter(Boolean);
            for (const recipient of recipients) {
                const res = await fetch('/api/admin/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: recipient,
                        subject,
                        body: body,
                        html: wrapInTemplate(body),
                    }),
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || `Failed to send to ${recipient}`);
                }
            }
            setSentEmails(prev => [{ to, subject, time: new Date().toLocaleTimeString() }, ...prev]);
            setResult({ success: true, message: `Email sent to ${recipients.length} recipient(s)!` });
            setTo(''); setSubject(''); setBody('');
        } catch (err: any) {
            setResult({ success: false, message: err.message || 'Failed to send email' });
        }
        setSending(false);
    };

    const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Link href="/admin" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Compose Email</h1>
                    <p className="text-sm text-zinc-500">Send custom emails to customers via SMTP</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,300px] gap-4">
                {/* Compose form */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                    <div className="p-5 space-y-4">
                        {/* To */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">To</label>
                            <input value={to} onChange={e => setTo(e.target.value)} className={inputCls}
                                placeholder="customer@email.com (separate multiple with commas)" />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Subject</label>
                            <input value={subject} onChange={e => setSubject(e.target.value)} className={inputCls}
                                placeholder="Your order update from Beneera" />
                        </div>

                        {/* Mode toggle */}
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-medium text-zinc-400">Message</label>
                            <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
                                <button onClick={() => setHtmlMode(false)}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${!htmlMode ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
                                    <Paperclip className="h-3 w-3 inline mr-1" />Plain Text
                                </button>
                                <button onClick={() => setHtmlMode(true)}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${htmlMode ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
                                    <Code className="h-3 w-3 inline mr-1" />HTML
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={12}
                            className={`${inputCls} resize-y ${htmlMode ? 'font-mono text-xs' : ''}`}
                            placeholder={htmlMode ? '<p>Your custom HTML email content...</p>' : 'Hi there,\n\nType your message here...\n\nBest regards,\nBeneera Team'} />

                        {/* Preview */}
                        {body && (
                            <div>
                                <div className="flex items-center gap-1 mb-2">
                                    <Eye className="h-3 w-3 text-zinc-500" />
                                    <span className="text-xs text-zinc-500 font-medium">Preview</span>
                                </div>
                                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-white">
                                    <iframe
                                        srcDoc={wrapInTemplate(body)}
                                        className="w-full border-0"
                                        style={{ minHeight: '250px' }}
                                        sandbox=""
                                        title="Email Preview"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${result.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {result.success && <CheckCircle2 className="h-4 w-4" />}
                                {result.message}
                            </div>
                        )}
                    </div>

                    {/* Send bar */}
                    <div className="flex items-center justify-between px-5 py-3 bg-zinc-800/30 border-t border-zinc-800/60">
                        <p className="text-xs text-zinc-600">
                            {!htmlMode && 'Plain text will be automatically wrapped in your Beneera email template.'}
                            {htmlMode && 'HTML mode — your HTML will be sent as-is.'}
                        </p>
                        <button onClick={handleSend} disabled={sending || !to || !subject || !body}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {sending ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </div>

                {/* Sidebar — Recently Sent */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 lg:self-start">
                    <h3 className="text-sm font-semibold text-white mb-3">Recently Sent</h3>
                    {sentEmails.length === 0 ? (
                        <p className="text-xs text-zinc-600">No emails sent this session.</p>
                    ) : (
                        <div className="space-y-2">
                            {sentEmails.map((e, i) => (
                                <div key={i} className="p-2.5 bg-zinc-800/40 rounded-lg">
                                    <p className="text-xs text-white font-medium truncate">{e.subject}</p>
                                    <p className="text-[11px] text-zinc-500 truncate">To: {e.to}</p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">{e.time}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <hr className="border-zinc-800 my-4" />

                    <h3 className="text-sm font-semibold text-white mb-2">Quick Tips</h3>
                    <ul className="space-y-1.5 text-xs text-zinc-500">
                        <li>• Separate multiple recipients with commas</li>
                        <li>• Plain text mode auto-wraps in your Beneera template</li>
                        <li>• Use HTML mode for full design control</li>
                        <li>• Preview shows exactly what the customer will see</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
