'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, Cog, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch {
            setError('Network error');
        }
        setLoading(false);
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Invalid or missing reset link.</p>
                    <Link href="/admin/login" className="text-amber-400 hover:text-amber-300 text-sm">← Back to login</Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="w-full max-w-sm text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-2xl mb-4">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-white mb-2">Password Reset!</h1>
                    <p className="text-sm text-zinc-500 mb-6">Your password has been updated successfully.</p>
                    <Link href="/admin/login" className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors">
                        <Lock className="h-4 w-4" /> Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const inputCls = "w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all";

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4">
                        <Cog className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-white">Set New Password</h1>
                    <p className="text-sm text-zinc-500 mt-1">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">New Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Min 6 characters" required className={`${inputCls} pr-10`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password" required className={inputCls} />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="h-4 w-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" /> : <><Lock className="h-4 w-4" /> Reset Password</>}
                    </button>
                </form>

                <p className="text-center mt-4">
                    <Link href="/admin/login" className="text-sm text-zinc-500 hover:text-amber-400 flex items-center justify-center gap-1">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="h-6 w-6 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
