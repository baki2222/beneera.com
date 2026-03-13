'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/data/site-config';
import { Save, Loader2, Eye, EyeOff, CheckCircle2, CreditCard, AlertCircle, Mail, Zap } from 'lucide-react';

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Payment settings
  const [payment, setPayment] = useState({
    stripe_secret_key: '', stripe_publishable_key: '',
    paypal_client_id: '', paypal_client_secret: '', paypal_mode: 'sandbox',
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [paymentLoaded, setPaymentLoaded] = useState(false);

  // Email/SMTP settings
  const [email, setEmail] = useState({
    smtp_host: '', smtp_port: '587', smtp_user: '', smtp_pass: '',
    smtp_from_email: '', smtp_from_name: 'Beneera', smtp_secure: 'false',
  });
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testEmail, setTestEmail] = useState('');

  // Other settings
  const [general, setGeneral] = useState({
    name: siteConfig.name, tagline: siteConfig.tagline, email: siteConfig.email,
    phone: siteConfig.phone, street: siteConfig.address.street, city: siteConfig.address.city,
    state: siteConfig.address.state, zip: siteConfig.address.zip, country: siteConfig.address.country,
  });
  const [commerce, setCommerce] = useState({ currency: 'USD', taxRate: '8', freeShippingThreshold: '50' });
  const [social, setSocial] = useState({
    facebook: siteConfig.social?.facebook || '', twitter: siteConfig.social?.twitter || '',
    instagram: siteConfig.social?.instagram || '',
  });
  const [seo, setSeo] = useState({ title: 'Beneera | Premium Auto Parts & Accessories', description: siteConfig.description });

  // Load payment settings from DB
  useEffect(() => {
    if (tab === 'payments' && !paymentLoaded) {
      setLoading(true);
      fetch('/api/admin/settings?prefix=stripe,paypal')
        .then(r => r.json())
        .then(data => {
          if (data.settings) {
            setPayment(prev => ({
              ...prev,
              stripe_secret_key: data.settings.stripe_secret_key || '',
              stripe_publishable_key: data.settings.stripe_publishable_key || '',
              paypal_client_id: data.settings.paypal_client_id || '',
              paypal_client_secret: data.settings.paypal_client_secret || '',
              paypal_mode: data.settings.paypal_mode || 'sandbox',
            }));
          }
          setPaymentLoaded(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    if (tab === 'email' && !emailLoaded) {
      setLoading(true);
      fetch('/api/admin/settings?prefix=smtp')
        .then(r => r.json())
        .then(data => {
          if (data.settings) {
            setEmail(prev => ({
              ...prev,
              smtp_host: data.settings.smtp_host || '',
              smtp_port: data.settings.smtp_port || '587',
              smtp_user: data.settings.smtp_user || '',
              smtp_pass: data.settings.smtp_pass || '',
              smtp_from_email: data.settings.smtp_from_email || '',
              smtp_from_name: data.settings.smtp_from_name || 'Beneera',
              smtp_secure: data.settings.smtp_secure || 'false',
            }));
          }
          setEmailLoaded(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab, paymentLoaded, emailLoaded]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'payments') {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: payment }),
        });
        if (!res.ok) throw new Error();
      }
      if (tab === 'email') {
        const res = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: email }),
        });
        if (!res.ok) throw new Error();
      }
      // For other tabs, we'd save to DB too — for now just show success
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleShow = (key: string) => setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  const maskValue = (val: string) => val ? val.slice(0, 7) + '•'.repeat(Math.max(0, val.length - 11)) + val.slice(-4) : '';

  const tabs = [
    { id: 'general', label: 'General' }, { id: 'payments', label: 'Payments' },
    { id: 'email', label: 'Email' }, { id: 'commerce', label: 'Commerce' },
    { id: 'social', label: 'Social' }, { id: 'seo', label: 'SEO' },
    { id: 'notifications', label: 'Notifications' },
  ];
  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const labelCls = "block text-sm font-medium text-zinc-400 mb-1.5";

  const KeyInput = ({ label, field, placeholder, hint, value, onChangeValue }: { label: string; field: string; placeholder: string; hint?: string; value?: string; onChangeValue?: (v: string) => void }) => {
    const val = value !== undefined ? value : (payment as any)[field] || '';
    const onChange = onChangeValue || ((v: string) => setPayment({ ...payment, [field]: v }));
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <div className="relative">
          <input
            type={showKeys[field] ? 'text' : 'password'}
            value={val}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls + ' pr-10'}
            placeholder={placeholder}
            autoComplete="off"
          />
          <button type="button" onClick={() => toggleShow(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            {showKeys[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Settings</h1><p className="text-sm text-zinc-500">Configure your store</p></div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-sm font-semibold rounded-lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-zinc-800/60 pb-px">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-white'}`}>{t.label}</button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6">
        {tab === 'general' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>Store Name</label><input value={general.name} onChange={(e) => setGeneral({ ...general, name: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Tagline</label><input value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>Support Email</label><input value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Phone</label><input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className={inputCls} /></div>
            </div>
            <hr className="border-zinc-800" />
            <h3 className="text-sm font-semibold text-white">Business Address</h3>
            <div><label className={labelCls}>Street</label><input value={general.street} onChange={(e) => setGeneral({ ...general, street: e.target.value })} className={inputCls} /></div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div><label className={labelCls}>City</label><input value={general.city} onChange={(e) => setGeneral({ ...general, city: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>State</label><input value={general.state} onChange={(e) => setGeneral({ ...general, state: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>ZIP</label><input value={general.zip} onChange={(e) => setGeneral({ ...general, zip: e.target.value })} className={inputCls} /></div>
            </div>
          </div>
        )}

        {tab === 'payments' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>
            ) : (
              <>
                {/* Stripe */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-[#635BFF]" />
                    <h3 className="text-base font-semibold text-white">Stripe</h3>
                    {payment.stripe_secret_key && payment.stripe_secret_key !== 'sk_test_REPLACE_WITH_YOUR_KEY' && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full">Connected</span>
                    )}
                  </div>
                  <div className="space-y-4 pl-7">
                    <KeyInput label="Secret Key" field="stripe_secret_key" placeholder="sk_test_... or sk_live_..."
                      hint="Found in Stripe Dashboard → Developers → API Keys" />
                    <KeyInput label="Publishable Key" field="stripe_publishable_key" placeholder="pk_test_... or pk_live_..."
                      hint="The public key — safe to expose in the browser" />
                    <div className="flex items-start gap-2 p-3 bg-zinc-800/50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-zinc-400">Use <code className="text-amber-400">sk_test_</code> keys for testing and <code className="text-amber-400">sk_live_</code> keys for production. Get your keys at <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-amber-400 hover:underline">dashboard.stripe.com/apikeys</a></p>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* PayPal */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-2 py-0.5 bg-[#0070ba] rounded text-white text-[10px] font-bold">PayPal</div>
                    <h3 className="text-base font-semibold text-white">PayPal</h3>
                    {payment.paypal_client_id && payment.paypal_client_id !== 'REPLACE_WITH_YOUR_CLIENT_ID' && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full">Connected</span>
                    )}
                  </div>
                  <div className="space-y-4 pl-7">
                    <KeyInput label="Client ID" field="paypal_client_id" placeholder="AYour_PayPal_Client_ID"
                      hint="Found in PayPal Developer Dashboard → Apps & Credentials" />
                    <KeyInput label="Client Secret" field="paypal_client_secret" placeholder="EYour_PayPal_Client_Secret" />
                    <div>
                      <label className={labelCls}>Mode</label>
                      <select value={payment.paypal_mode} onChange={(e) => setPayment({ ...payment, paypal_mode: e.target.value })} className={inputCls}>
                        <option value="sandbox">Sandbox (Testing)</option>
                        <option value="live">Live (Production)</option>
                      </select>
                      <p className="text-xs text-zinc-500 mt-1">Use Sandbox for testing. Switch to Live when ready to accept real payments.</p>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-zinc-800/50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-zinc-400">Get your PayPal credentials at <a href="https://developer.paypal.com/dashboard/applications" target="_blank" className="text-amber-400 hover:underline">developer.paypal.com</a></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'email' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-amber-500" />
                    <h3 className="text-base font-semibold text-white">SMTP Server</h3>
                    {email.smtp_host && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/15 text-green-400 rounded-full">Configured</span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>SMTP Host *</label>
                        <input value={email.smtp_host} onChange={(e) => setEmail({ ...email, smtp_host: e.target.value })} className={inputCls} placeholder="smtp.gmail.com" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Port</label>
                          <input value={email.smtp_port} onChange={(e) => setEmail({ ...email, smtp_port: e.target.value })} className={inputCls} placeholder="587" />
                        </div>
                        <div>
                          <label className={labelCls}>SSL/TLS</label>
                          <select value={email.smtp_secure} onChange={(e) => setEmail({ ...email, smtp_secure: e.target.value })} className={inputCls}>
                            <option value="false">STARTTLS (587)</option>
                            <option value="true">SSL (465)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Username *</label>
                        <input value={email.smtp_user} onChange={(e) => setEmail({ ...email, smtp_user: e.target.value })} className={inputCls} placeholder="your@email.com" autoComplete="off" />
                      </div>
                      <KeyInput label="Password *" field="smtp_pass" placeholder="App password or SMTP password" value={email.smtp_pass} onChangeValue={(v) => setEmail({ ...email, smtp_pass: v })} />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">Sender Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>From Email</label>
                      <input value={email.smtp_from_email} onChange={(e) => setEmail({ ...email, smtp_from_email: e.target.value })} className={inputCls} placeholder="noreply@beneera.com" />
                      <p className="text-xs text-zinc-500 mt-1">Defaults to SMTP username if empty</p>
                    </div>
                    <div>
                      <label className={labelCls}>From Name</label>
                      <input value={email.smtp_from_name} onChange={(e) => setEmail({ ...email, smtp_from_name: e.target.value })} className={inputCls} placeholder="Beneera" />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Test Connection */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">Test Connection</h3>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className={labelCls}>Send test email to</label>
                      <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} type="email" className={inputCls} placeholder="your@email.com" />
                    </div>
                    <button
                      onClick={async () => {
                        setTestingSmtp(true); setSmtpTestResult(null);
                        try {
                          // Save first
                          await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: email }) });
                          const res = await fetch('/api/admin/email/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ testEmail: testEmail || '' }) });
                          const data = await res.json();
                          setSmtpTestResult({ success: res.ok, message: data.message || data.error });
                        } catch (err: any) { setSmtpTestResult({ success: false, message: err.message || 'Connection failed' }); }
                        finally { setTestingSmtp(false); }
                      }}
                      disabled={testingSmtp || !email.smtp_host}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 text-sm font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {testingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                      {testingSmtp ? 'Testing...' : 'Test & Send'}
                    </button>
                  </div>
                  {smtpTestResult && (
                    <div className={`mt-3 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                      smtpTestResult.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {smtpTestResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {smtpTestResult.message}
                    </div>
                  )}
                </div>

                {/* Setup Guide */}
                <div className="space-y-4">
                  {/* Common SMTP Settings Table */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">📧 Common SMTP Settings</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="text-zinc-400 border-b border-zinc-700">
                          <th className="text-left py-2 pr-3">Provider</th>
                          <th className="text-left py-2 pr-3">SMTP Host</th>
                          <th className="text-left py-2 pr-3">Port</th>
                          <th className="text-left py-2">SSL/TLS</th>
                        </tr></thead>
                        <tbody className="text-zinc-300">
                          <tr className="border-b border-zinc-800"><td className="py-2 pr-3 font-medium text-amber-400">Gmail</td><td className="py-2 pr-3">smtp.gmail.com</td><td className="py-2 pr-3">587</td><td className="py-2">STARTTLS</td></tr>
                          <tr className="border-b border-zinc-800"><td className="py-2 pr-3 font-medium text-blue-400">Outlook</td><td className="py-2 pr-3">smtp-mail.outlook.com</td><td className="py-2 pr-3">587</td><td className="py-2">STARTTLS</td></tr>
                          <tr className="border-b border-zinc-800"><td className="py-2 pr-3 font-medium text-green-400">Zoho</td><td className="py-2 pr-3">smtp.zoho.com</td><td className="py-2 pr-3">465</td><td className="py-2">SSL</td></tr>
                          <tr><td className="py-2 pr-3 font-medium text-purple-400">Yahoo</td><td className="py-2 pr-3">smtp.mail.yahoo.com</td><td className="py-2 pr-3">587</td><td className="py-2">STARTTLS</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gmail App Password Guide */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-amber-400 flex items-center gap-2">⚠️ Gmail Users — App Password Required</p>
                    <p className="text-xs text-zinc-400">Gmail requires an <strong className="text-zinc-300">App Password</strong> instead of your regular password. Regular passwords will be rejected.</p>
                    <ol className="text-xs text-zinc-400 space-y-1 list-decimal pl-4">
                      <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" className="text-amber-400 hover:underline">myaccount.google.com/apppasswords</a></li>
                      <li>Sign in and select <strong className="text-zinc-300">&quot;Mail&quot;</strong> as the app</li>
                      <li>Click <strong className="text-zinc-300">&quot;Generate&quot;</strong> to get a 16-character code</li>
                      <li>Use that code as the <strong className="text-zinc-300">SMTP Password</strong> above</li>
                    </ol>
                    <p className="text-xs text-zinc-500">Note: 2-Step Verification must be enabled on your Google account first.</p>
                  </div>

                  {/* How to use */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">✉️ How Email Replies Work</p>
                    <ul className="text-xs text-zinc-400 space-y-1.5">
                      <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>Open an inquiry → type your reply → click <strong className="text-zinc-300">&quot;Send Reply&quot;</strong></li>
                      <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span>If SMTP is configured: email is sent <strong className="text-zinc-300">directly from your server</strong></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">→</span>If SMTP isn&apos;t set up: opens your email client (mailto:) as fallback</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">📝</span>All replies are saved in the inquiry notes for your records</li>
                    </ul>
                  </div>

                  {/* Quick setup steps */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">🚀 Quick Setup</p>
                    <ol className="text-xs text-zinc-400 space-y-1 list-decimal pl-4">
                      <li>Fill in your SMTP Host, Port, Username, and Password above</li>
                      <li>Set your <strong className="text-zinc-300">From Name</strong> (e.g. &quot;Beneera&quot;)</li>
                      <li>Click <strong className="text-zinc-300">&quot;Save&quot;</strong> at the top right</li>
                      <li>Enter your email in the test field and click <strong className="text-zinc-300">&quot;Test &amp; Send&quot;</strong></li>
                      <li>Check your inbox — if you got the test email, you&apos;re all set! ✅</li>
                    </ol>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'commerce' && (
          <div className="space-y-5">
            <div><label className={labelCls}>Currency</label><select value={commerce.currency} onChange={(e) => setCommerce({ ...commerce, currency: e.target.value })} className={inputCls}><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option></select></div>
            <div><label className={labelCls}>Tax Rate (%)</label><input type="number" value={commerce.taxRate} onChange={(e) => setCommerce({ ...commerce, taxRate: e.target.value })} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">Applied to all orders.</p></div>
            <div><label className={labelCls}>Free Shipping Threshold ($)</label><input type="number" value={commerce.freeShippingThreshold} onChange={(e) => setCommerce({ ...commerce, freeShippingThreshold: e.target.value })} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">Orders above this amount get free shipping.</p></div>
          </div>
        )}

        {tab === 'social' && (
          <div className="space-y-5">
            <div><label className={labelCls}>Facebook URL</label><input value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} className={inputCls} placeholder="https://facebook.com/..." /></div>
            <div><label className={labelCls}>Twitter / X URL</label><input value={social.twitter} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} className={inputCls} placeholder="https://x.com/..." /></div>
            <div><label className={labelCls}>Instagram URL</label><input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} className={inputCls} placeholder="https://instagram.com/..." /></div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="space-y-5">
            <div><label className={labelCls}>Default Page Title</label><input value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">{seo.title.length}/60</p></div>
            <div><label className={labelCls}>Default Meta Description</label><textarea value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={3} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">{seo.description.length}/160</p></div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-5">
            <div className="bg-zinc-800/50 rounded-lg p-4"><p className="text-sm text-zinc-400">Email notification settings will be available after integrating with an email provider (Resend, SendGrid, etc.).</p></div>
            <div className="space-y-3">
              {[
                { label: 'New order confirmation', desc: 'Send to customer when order is placed' },
                { label: 'Order shipped notification', desc: 'Send to customer when order ships' },
                { label: 'New order alert (admin)', desc: 'Notify admin of new orders' },
                { label: 'Low stock alert', desc: 'Notify admin when product stock is low' },
              ].map((n) => (
                <label key={n.label} className="flex items-start gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded border-zinc-600 accent-amber-500" />
                  <div><p className="text-sm text-white">{n.label}</p><p className="text-xs text-zinc-500">{n.desc}</p></div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
