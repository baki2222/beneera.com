'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/site-config';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Mail, Phone, MapPin, Clock, Send, Loader2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '', email: '', subject: 'General Inquiry', orderNumber: '', message: '',
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                    message: form.message,
                    orderNumber: form.orderNumber,
                    type: 'contact',
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to send message. Please try again.');
            }
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Contact Us' }]} />
            <div className="py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">Contact Us</h1>
                <p className="text-zinc-500 max-w-xl">Have a question, concern, or feedback? We&apos;d love to hear from you. Reach out through any of the channels below.</p>

                <div className="grid lg:grid-cols-3 gap-8 mt-10">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-zinc-50 rounded-xl p-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-zinc-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Email</p>
                                    <a href={`mailto:${siteConfig.email}`} className="text-sm text-zinc-500 hover:text-zinc-900">{siteConfig.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-zinc-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Phone</p>
                                    <a href={`tel:${siteConfig.phone}`} className="text-sm text-zinc-500 hover:text-zinc-900">{siteConfig.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-zinc-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Address</p>
                                    <p className="text-sm text-zinc-500">{siteConfig.address.full}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-zinc-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">Business Hours</p>
                                    <p className="text-sm text-zinc-500">{siteConfig.businessHours.weekdays}</p>
                                    <p className="text-sm text-zinc-500">{siteConfig.businessHours.saturday}</p>
                                    <p className="text-sm text-zinc-500">{siteConfig.businessHours.sunday}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 rounded-xl p-6 text-center">
                            <p className="text-sm text-zinc-300">We typically respond within <span className="text-white font-semibold">1 business day</span></p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-green-50 rounded-xl p-10 text-center">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Message Sent!</h2>
                                <p className="text-sm text-zinc-600 mb-6">Thank you for reaching out. We&apos;ll get back to you within 1 business day.</p>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'General Inquiry', orderNumber: '', message: '' }); }}
                                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900 underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border border-zinc-100 rounded-xl p-6 sm:p-8 space-y-5">
                                {error && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
                                        <input required type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email *</label>
                                        <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300" placeholder="you@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Subject</label>
                                    <select value={form.subject} onChange={(e) => update('subject', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300">
                                        <option>General Inquiry</option>
                                        <option>Order Status</option>
                                        <option>Product Question</option>
                                        <option>Return or Refund</option>
                                        <option>Shipping Issue</option>
                                        <option>Partnership Inquiry</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Order Number (optional)</label>
                                    <input type="text" value={form.orderNumber} onChange={(e) => update('orderNumber', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300" placeholder="#12345" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Message *</label>
                                    <textarea required rows={5} value={form.message} onChange={(e) => update('message', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 resize-none" placeholder="How can we help?" />
                                </div>
                                <button type="submit" disabled={submitting}
                                    className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
