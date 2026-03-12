import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-8xl font-bold text-zinc-200 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-zinc-900 mb-3">Page Not Found</h2>
                <p className="text-zinc-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                        <Home className="h-4 w-4" /> Back to Home
                    </Link>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors">
                        <Search className="h-4 w-4" /> Browse Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
