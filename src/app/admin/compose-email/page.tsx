'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, CheckCircle2, Paperclip, Eye, Code, ArrowLeft, X, Users, Search } from 'lucide-react';
import Link from 'next/link';

interface Contact {
    name: string;
    email: string;
    source: string;
    orderCount?: number;
}

export default function AdminComposeEmailPage() {
    const [recipients, setRecipients] = useState<Contact[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [htmlMode, setHtmlMode] = useState(false);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [sentEmails, setSentEmails] = useState<Array<{ to: string; subject: string; time: string }>>([]);

    // Contact search
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [manualEmail, setManualEmail] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);

    // Load all contacts on mount
    useEffect(() => {
        setLoadingContacts(true);
        fetch('/api/admin/contacts')
            .then(r => r.json())
            .then(data => setContacts(data.contacts || []))
            .catch(() => {})
            .finally(() => setLoadingContacts(false));
    }, []);

    // Filter contacts based on search
    const filteredContacts = contacts.filter(c =>
        !recipients.find(r => r.email === c.email) &&
        (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const addRecipient = (contact: Contact) => {
        if (!recipients.find(r => r.email === contact.email)) {
            setRecipients(prev => [...prev, contact]);
        }
        setSearchQuery('');
        setShowDropdown(false);
    };

    const addManualEmail = () => {
        const email = manualEmail.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
        if (!recipients.find(r => r.email === email)) {
            setRecipients(prev => [...prev, { name: email.split('@')[0], email, source: 'manual' }]);
        }
        setManualEmail('');
    };

    const removeRecipient = (email: string) => {
        setRecipients(prev => prev.filter(r => r.email !== email));
    };

    const selectAll = () => {
        const allNew = contacts.filter(c => !recipients.find(r => r.email === c.email));
        setRecipients(prev => [...prev, ...allNew]);
        setShowDropdown(false);
    };

    const wrapInTemplate = (content: string) => {
        if (htmlMode) return content;
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
        if (recipients.length === 0 || !subject || !body) {
            setResult({ success: false, message: 'Please add recipients, subject, and message.' });
            return;
        }
        setSending(true);
        setResult(null);
        try {
            let failCount = 0;
            for (const recipient of recipients) {
                const res = await fetch('/api/admin/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: recipient.email,
                        subject,
                        body,
                        html: wrapInTemplate(body),
                    }),
                });
                if (!res.ok) failCount++;
            }
            const toStr = recipients.map(r => r.name || r.email).join(', ');
            setSentEmails(prev => [{ to: toStr, subject, time: new Date().toLocaleTimeString() }, ...prev]);
            if (failCount === 0) {
                setResult({ success: true, message: `Email sent to ${recipients.length} recipient(s)!` });
            } else {
                setResult({ success: false, message: `Sent to ${recipients.length - failCount}, failed for ${failCount}` });
            }
            setRecipients([]); setSubject(''); setBody('');
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
                        {/* To — Contact picker */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">To</label>

                            {/* Selected recipients */}
                            {recipients.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {recipients.map(r => (
                                        <span key={r.email} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs">
                                            <span className="font-medium">{r.name}</span>
                                            <span className="text-amber-500/50">({r.email})</span>
                                            <button onClick={() => removeRecipient(r.email)} className="hover:text-red-400 ml-0.5">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {recipients.length > 1 && (
                                        <button onClick={() => setRecipients([])} className="text-[10px] text-zinc-600 hover:text-red-400 px-1.5 py-1">Clear all</button>
                                    )}
                                </div>
                            )}

                            {/* Search contacts */}
                            <div ref={searchRef} className="relative">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                        <input
                                            value={searchQuery}
                                            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                                            onFocus={() => setShowDropdown(true)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                            placeholder="Search customers by name or email..."
                                        />
                                    </div>
                                    {/* Manual email entry */}
                                    <div className="flex gap-1">
                                        <input
                                            value={manualEmail}
                                            onChange={e => setManualEmail(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addManualEmail()}
                                            className="w-48 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                                            placeholder="Or type email..."
                                        />
                                        <button onClick={addManualEmail} className="px-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-medium transition-colors">
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute z-20 top-full mt-1 left-0 w-full max-h-64 overflow-y-auto bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
                                        {loadingContacts ? (
                                            <div className="px-4 py-3 text-xs text-zinc-500 flex items-center gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin" /> Loading contacts...
                                            </div>
                                        ) : filteredContacts.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-zinc-500">No contacts found</div>
                                        ) : (
                                            <>
                                                <button onClick={selectAll} className="w-full px-4 py-2 text-left text-xs text-amber-400 hover:bg-zinc-700/60 flex items-center gap-2 border-b border-zinc-700/50">
                                                    <Users className="h-3 w-3" /> Select all {filteredContacts.length} contacts
                                                </button>
                                                {filteredContacts.map(c => (
                                                    <button key={c.email} onClick={() => addRecipient(c)}
                                                        className="w-full px-4 py-2.5 text-left hover:bg-zinc-700/60 flex items-center justify-between transition-colors">
                                                        <div>
                                                            <p className="text-sm text-white">{c.name}</p>
                                                            <p className="text-xs text-zinc-500">{c.email}</p>
                                                        </div>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                                            c.source === 'customer' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                                                        }`}>
                                                            {c.source === 'customer' ? `Customer · ${c.orderCount || 0} orders` : 'Inquiry'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                    <iframe srcDoc={wrapInTemplate(body)} className="w-full border-0" style={{ minHeight: '250px' }} sandbox="" title="Email Preview" />
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
                            {recipients.length > 0 ? `${recipients.length} recipient(s) selected` : 'No recipients selected'}
                            {!htmlMode && ' · Plain text auto-wrapped in Beneera template'}
                        </p>
                        <button onClick={handleSend} disabled={sending || recipients.length === 0 || !subject || !body}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {sending ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 lg:self-start">
                    {/* All contacts */}
                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4 text-zinc-500" /> Contacts
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">{contacts.length}</span>
                        </h3>
                        {contacts.length === 0 ? (
                            <p className="text-xs text-zinc-600">No contacts in database yet.</p>
                        ) : (
                            <div className="space-y-1 max-h-52 overflow-y-auto">
                                {contacts.slice(0, 15).map(c => (
                                    <button key={c.email} onClick={() => addRecipient(c)}
                                        disabled={!!recipients.find(r => r.email === c.email)}
                                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-800/60 rounded-lg transition-colors disabled:opacity-30">
                                        <span className="text-white">{c.name}</span>
                                        <span className="text-zinc-600 ml-1">{c.email}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recently Sent */}
                    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
