'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setSubmitted(true);
            setEmail('');
        } catch { }
        finally { setLoading(false); }
    };

    if (submitted) {
        return (
            <p className="text-sm text-green-400 font-medium py-3">
                Thanks for subscribing! Check your email for a welcome message. 🎉
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="flex-1 px-4 py-3 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-500 transition-all disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-medium bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Subscribing...</> : 'Subscribe'}
            </button>
        </form>
    );
}
