'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, CheckCircle2, Eye, Code, RotateCcw, Send } from 'lucide-react';
import Link from 'next/link';

interface Template {
    key: string;
    label: string;
    desc: string;
    subjectKey: string;
    bodyKey: string;
    defaultSubject: string;
    defaultBody: string;
    variables: { name: string; desc: string }[];
}

const templates: Template[] = [
    {
        key: 'order_confirmation',
        label: 'Order Confirmation',
        desc: 'Sent to customer after successful checkout',
        subjectKey: 'tpl_order_confirmation_subject',
        bodyKey: 'tpl_order_confirmation_body',
        defaultSubject: 'Order Confirmed — #{{orderNumber}}',
        defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">{{storeName}}</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Order Confirmation</p>
    <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
      Hi {{customerName}},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 16px;">
      Thank you for your order! We've received your purchase and are getting it ready.
    </p>
    <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0 0 4px; font-size: 13px; color: #a1a1aa;">Order Number</p>
      <p style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #f59e0b;">{{orderNumber}}</p>
      <p style="margin: 0 0 4px; font-size: 13px; color: #a1a1aa;">Total</p>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #fafafa;">\${{total}}</p>
    </div>
    <p style="font-size: 14px; color: #a1a1aa; margin: 0;">
      You'll receive a shipping confirmation email with tracking details once your order ships.
    </p>
  </div>
</div>`,
        variables: [
            { name: '{{customerName}}', desc: 'Customer\'s full name' },
            { name: '{{orderNumber}}', desc: 'Order reference number' },
            { name: '{{total}}', desc: 'Order total amount' },
            { name: '{{storeName}}', desc: 'Store name (Beneera)' },
        ],
    },
    {
        key: 'contact_confirmation',
        label: 'Contact Form Confirmation',
        desc: 'Auto-reply sent to customer after submitting contact form',
        subjectKey: 'tpl_contact_confirmation_subject',
        bodyKey: 'tpl_contact_confirmation_body',
        defaultSubject: 'We received your message: "{{subject}}"',
        defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">{{storeName}}</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Message Received</p>
    <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
      Hi {{customerName}},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 16px;">
      Thank you for reaching out! We've received your message regarding <strong style="color: #e4e4e7;">"{{subject}}"</strong> and will get back to you as soon as possible.
    </p>
    <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #a1a1aa;">Our typical response time is <strong style="color: #f59e0b;">24-48 hours</strong>.</p>
    </div>
    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
    <p style="font-size: 13px; color: #71717a; margin: 0;">
      Best regards,<br/>
      <strong style="color: #a1a1aa;">{{storeName}} Support Team</strong>
    </p>
  </div>
</div>`,
        variables: [
            { name: '{{customerName}}', desc: 'Customer\'s name' },
            { name: '{{subject}}', desc: 'Inquiry subject line' },
            { name: '{{storeName}}', desc: 'Store name (Beneera)' },
        ],
    },
    {
        key: 'inquiry_reply',
        label: 'Inquiry Reply',
        desc: 'Sent to customer when admin replies to their inquiry',
        subjectKey: 'tpl_inquiry_reply_subject',
        bodyKey: 'tpl_inquiry_reply_body',
        defaultSubject: 'Re: Your inquiry — {{storeName}}',
        defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">{{storeName}}</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">Customer Support</p>
    <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7; margin: 0 0 16px;">
      Hi {{customerName}},
    </p>
    <div style="font-size: 15px; line-height: 1.7; color: #d4d4d8; margin: 0 0 24px; white-space: pre-wrap;">{{replyBody}}</div>
    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
    <p style="font-size: 13px; color: #71717a; margin: 0;">
      Best regards,<br/>
      <strong style="color: #a1a1aa;">{{storeName}} Support Team</strong>
    </p>
  </div>
</div>`,
        variables: [
            { name: '{{customerName}}', desc: 'Customer\'s name' },
            { name: '{{replyBody}}', desc: 'The admin\'s reply text' },
            { name: '{{storeName}}', desc: 'Store name (Beneera)' },
        ],
    },
    {
        key: 'newsletter_welcome',
        label: 'Newsletter Welcome',
        desc: 'Sent when a customer subscribes to the newsletter',
        subjectKey: 'tpl_newsletter_welcome_subject',
        bodyKey: 'tpl_newsletter_welcome_body',
        defaultSubject: 'Welcome to {{storeName}}! 🎉',
        defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa; text-align: center;">
    <h2 style="margin: 0 0 8px; font-size: 24px; color: #f59e0b;">Welcome to {{storeName}}! 🎉</h2>
    <p style="margin: 0 0 24px; font-size: 15px; color: #a1a1aa;">Thanks for subscribing to our newsletter</p>
    <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin: 0 0 24px;">
      You'll be the first to know about new products, exclusive deals, and helpful automotive tips.
    </p>
    <a href="https://www.beneera.com/shop" style="display: inline-block; background: #f59e0b; color: #18181b; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600;">Browse Our Shop →</a>
    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
    <p style="font-size: 12px; color: #71717a; margin: 0;">
      You received this email because you subscribed to {{storeName}} newsletter.
    </p>
  </div>
</div>`,
        variables: [
            { name: '{{storeName}}', desc: 'Store name (Beneera)' },
        ],
    },
    {
        key: 'admin_new_inquiry',
        label: 'Admin New Inquiry Alert',
        desc: 'Sent to admin when a new contact form is submitted',
        subjectKey: 'tpl_admin_new_inquiry_subject',
        bodyKey: 'tpl_admin_new_inquiry_body',
        defaultSubject: 'New inquiry from {{customerName}}: {{subject}}',
        defaultBody: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #18181b; border-radius: 12px; padding: 32px; color: #fafafa;">
    <h2 style="margin: 0 0 8px; font-size: 20px; color: #f59e0b;">New Inquiry Received</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa;">A customer has submitted a {{type}} form</p>
    <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 16px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">From</p>
      <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #fafafa;">{{customerName}}</p>
      <p style="margin: 0 0 16px; font-size: 13px; color: #a1a1aa;">{{customerEmail}}</p>
      <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Subject</p>
      <p style="margin: 0; font-size: 15px; font-weight: 600; color: #f59e0b;">{{subject}}</p>
    </div>
    <div style="background: #27272a; border-radius: 8px; padding: 16px; margin: 0 0 16px;">
      <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Message</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #d4d4d8; white-space: pre-wrap;">{{message}}</p>
    </div>
    <a href="https://www.beneera.com/admin/inquiries" style="display: inline-block; background: #f59e0b; color: #18181b; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">View in Dashboard →</a>
  </div>
</div>`,
        variables: [
            { name: '{{customerName}}', desc: 'Customer\'s name' },
            { name: '{{customerEmail}}', desc: 'Customer\'s email' },
            { name: '{{subject}}', desc: 'Inquiry subject' },
            { name: '{{message}}', desc: 'Full message body' },
            { name: '{{type}}', desc: 'Form type (contact, support, etc.)' },
        ],
    },
];

export default function AdminEmailTemplatesPage() {
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<Record<string, string>>({});
    const [bodies, setBodies] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
    const [sendingTest, setSendingTest] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/settings?prefix=tpl_')
            .then(r => r.json())
            .then(data => {
                if (data.settings) {
                    const subs: Record<string, string> = {};
                    const bods: Record<string, string> = {};
                    for (const t of templates) {
                        subs[t.key] = data.settings[t.subjectKey] || t.defaultSubject;
                        bods[t.key] = data.settings[t.bodyKey] || t.defaultBody;
                    }
                    setSubjects(subs);
                    setBodies(bods);
                }
            })
            .catch(() => {
                // Use defaults
                const subs: Record<string, string> = {};
                const bods: Record<string, string> = {};
                for (const t of templates) {
                    subs[t.key] = t.defaultSubject;
                    bods[t.key] = t.defaultBody;
                }
                setSubjects(subs);
                setBodies(bods);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (tpl: Template) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: {
                        [tpl.subjectKey]: subjects[tpl.key],
                        [tpl.bodyKey]: bodies[tpl.key],
                    },
                }),
            });
            if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
            else throw new Error();
        } catch { alert('Failed to save template'); }
        finally { setSaving(false); }
    };

    const handleReset = (tpl: Template) => {
        if (!confirm('Reset this template to the default? Your customizations will be lost.')) return;
        setSubjects(prev => ({ ...prev, [tpl.key]: tpl.defaultSubject }));
        setBodies(prev => ({ ...prev, [tpl.key]: tpl.defaultBody }));
    };

    const handleSendTest = async (tpl: Template) => {
        const testTo = prompt('Send a test email to:');
        if (!testTo) return;
        setSendingTest(true);
        setTestResult(null);
        try {
            // Save first
            await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: {
                        [tpl.subjectKey]: subjects[tpl.key],
                        [tpl.bodyKey]: bodies[tpl.key],
                    },
                }),
            });
            // Send test with sample data
            const sampleSubject = (subjects[tpl.key] || tpl.defaultSubject)
                .replace(/\{\{customerName\}\}/g, 'John Doe')
                .replace(/\{\{orderNumber\}\}/g, 'ORD-123456')
                .replace(/\{\{total\}\}/g, '149.99')
                .replace(/\{\{subject\}\}/g, 'Test Subject')
                .replace(/\{\{storeName\}\}/g, 'Beneera');
            const sampleBody = (bodies[tpl.key] || tpl.defaultBody)
                .replace(/\{\{customerName\}\}/g, 'John Doe')
                .replace(/\{\{orderNumber\}\}/g, 'ORD-123456')
                .replace(/\{\{total\}\}/g, '149.99')
                .replace(/\{\{subject\}\}/g, 'Test Subject')
                .replace(/\{\{replyBody\}\}/g, 'Thank you for reaching out! We are happy to help you with your question.')
                .replace(/\{\{customerEmail\}\}/g, 'john@example.com')
                .replace(/\{\{message\}\}/g, 'This is a sample customer message for testing.')
                .replace(/\{\{type\}\}/g, 'contact')
                .replace(/\{\{storeName\}\}/g, 'Beneera');
            const res = await fetch('/api/admin/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: testTo, subject: sampleSubject, body: sampleSubject, html: sampleBody }),
            });
            const data = await res.json();
            setTestResult({ success: res.ok, message: res.ok ? `Test email sent to ${testTo}` : data.error });
        } catch (err: any) {
            setTestResult({ success: false, message: err.message });
        }
        setSendingTest(false);
    };

    const activeTpl = templates.find(t => t.key === activeTemplate);
    const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

    const getPreviewHtml = (tpl: Template) => {
        return (bodies[tpl.key] || tpl.defaultBody)
            .replace(/\{\{customerName\}\}/g, 'John Doe')
            .replace(/\{\{orderNumber\}\}/g, 'ORD-123456')
            .replace(/\{\{total\}\}/g, '149.99')
            .replace(/\{\{subject\}\}/g, 'Product Availability')
            .replace(/\{\{replyBody\}\}/g, 'Thank you for reaching out! We are happy to help.')
            .replace(/\{\{customerEmail\}\}/g, 'john@example.com')
            .replace(/\{\{message\}\}/g, 'Hi, I wanted to ask about your brake pad selection.')
            .replace(/\{\{type\}\}/g, 'contact')
            .replace(/\{\{storeName\}\}/g, 'Beneera');
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/settings" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Email Templates</h1>
                        <p className="text-sm text-zinc-500">{templates.length} templates · Customize your email designs</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[280px,1fr] gap-4">
                {/* Template list */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3 space-y-1 lg:self-start">
                    {templates.map(tpl => (
                        <button key={tpl.key} onClick={() => { setActiveTemplate(tpl.key); setViewMode('code'); setTestResult(null); }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTemplate === tpl.key ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}>
                            <p className="font-medium">{tpl.label}</p>
                            <p className="text-xs text-zinc-600 mt-0.5 line-clamp-1">{tpl.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                    {!activeTpl ? (
                        <div className="text-center py-20">
                            <Code className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm">Select a template to edit</p>
                        </div>
                    ) : (
                        <div>
                            {/* Editor header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/60">
                                <div>
                                    <h2 className="text-sm font-semibold text-white">{activeTpl.label}</h2>
                                    <p className="text-xs text-zinc-500">{activeTpl.desc}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleReset(activeTpl)} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800" title="Reset to default">
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => handleSendTest(activeTpl)} disabled={sendingTest}
                                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors disabled:opacity-40">
                                        {sendingTest ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                        Test
                                    </button>
                                    <button onClick={() => handleSave(activeTpl)} disabled={saving}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-xs font-semibold rounded-lg">
                                        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : saved ? <CheckCircle2 className="h-3 w-3" /> : <Save className="h-3 w-3" />}
                                        {saved ? 'Saved!' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {testResult && (
                                <div className={`mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${testResult.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {testResult.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                                    {testResult.message}
                                </div>
                            )}

                            <div className="p-5 space-y-4">
                                {/* Subject line */}
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Subject Line</label>
                                    <input value={subjects[activeTpl.key] || ''} onChange={e => setSubjects(prev => ({ ...prev, [activeTpl.key]: e.target.value }))} className={inputCls} placeholder="Email subject..." />
                                </div>

                                {/* Variables reference */}
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="text-xs text-zinc-600 mr-1">Variables:</span>
                                    {activeTpl.variables.map(v => (
                                        <button key={v.name} onClick={() => navigator.clipboard.writeText(v.name)} title={`${v.desc} — Click to copy`}
                                            className="px-2 py-0.5 bg-zinc-800 text-amber-400 text-[11px] font-mono rounded hover:bg-zinc-700 transition-colors">
                                            {v.name}
                                        </button>
                                    ))}
                                </div>

                                {/* View mode toggle */}
                                <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5 w-fit">
                                    <button onClick={() => setViewMode('code')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'code' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
                                        <Code className="h-3 w-3 inline mr-1" />HTML
                                    </button>
                                    <button onClick={() => setViewMode('preview')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'preview' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}>
                                        <Eye className="h-3 w-3 inline mr-1" />Preview
                                    </button>
                                </div>

                                {/* Body editor or preview */}
                                {viewMode === 'code' ? (
                                    <textarea
                                        value={bodies[activeTpl.key] || ''}
                                        onChange={e => setBodies(prev => ({ ...prev, [activeTpl.key]: e.target.value }))}
                                        rows={18}
                                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-y"
                                        spellCheck={false}
                                    />
                                ) : (
                                    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-white">
                                        <iframe
                                            srcDoc={getPreviewHtml(activeTpl)}
                                            className="w-full border-0"
                                            style={{ minHeight: '400px' }}
                                            sandbox=""
                                            title="Email Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
