import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = { title: 'Sign In', description: 'Sign in to your Tech Aabid account.' };

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Sign In' }]} />
            <div className="py-8 sm:py-12">
                <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">Welcome Back</h1>
                <p className="text-sm text-zinc-500 text-center mb-8">Sign in to your account to continue</p>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                        <input type="email" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                        <input type="password" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-zinc-600">
                            <input type="checkbox" className="rounded border-zinc-300" /> Remember me
                        </label>
                        <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                        Sign In
                    </button>
                </form>
                <p className="text-sm text-center text-zinc-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-zinc-900 font-medium hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
