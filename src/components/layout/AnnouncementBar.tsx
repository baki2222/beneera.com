'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="relative bg-zinc-900 text-white text-sm">
            <div className="max-w-7xl mx-auto px-4 py-2.5 text-center">
                <p className="pr-8">
                    <span className="font-medium">Free shipping</span> on all orders over $50 —{' '}
                    <a href="/shop" className="underline underline-offset-2 hover:text-zinc-300 transition-colors">
                        Shop Now
                    </a>
                </p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded transition-colors"
                aria-label="Close announcement"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
