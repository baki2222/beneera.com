import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = { title: 'Create Account', description: 'Create your Tech Aabid account to track orders and save favorites.' };

export default function RegisterPage() {
    return (
        <div className="max-w-md mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Create Account' }]} />
            <div className="py-8 sm:py-12">
                <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">Create Your Account</h1>
                <p className="text-sm text-zinc-500 text-center mb-8">Join Tech Aabid to track orders and save favorites</p>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">First Name</label>
                            <input type="text" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Last Name</label>
                            <input type="text" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                        <input type="email" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                        <input type="password" required className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="Minimum 8 characters" />
                    </div>
                    <label className="flex items-start gap-2 text-sm text-zinc-600">
                        <input type="checkbox" className="rounded border-zinc-300 mt-0.5" />
                        <span>I agree to the <Link href="/policies/terms" className="underline">Terms of Service</Link> and <Link href="/policies/privacy" className="underline">Privacy Policy</Link></span>
                    </label>
                    <button type="submit" className="w-full py-3.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                        Create Account
                    </button>
                </form>
                <p className="text-sm text-center text-zinc-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-zinc-900 font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
