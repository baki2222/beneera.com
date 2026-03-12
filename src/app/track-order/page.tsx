'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Package, Search, Truck } from 'lucide-react';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderNumber.trim() && email.trim()) setSearched(true);
    };

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Track Order' }]} />
            <div className="py-8 sm:py-12">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-6 w-6 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">Track Your Order</h1>
                    <p className="text-sm text-zinc-500">Enter your order number and email to check the status of your shipment.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Order Number</label>
                        <input type="text" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="#12345" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="you@example.com" />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                        <Search className="h-4 w-4" /> Track Order
                    </button>
                </form>

                {searched && (
                    <div className="border border-zinc-200 rounded-xl p-6 text-center">
                        <Truck className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                        <p className="text-sm text-zinc-600 mb-1">No tracking information found for this order.</p>
                        <p className="text-xs text-zinc-400">Please double-check your order number and email, or contact our support team for assistance.</p>
                    </div>
                )}

                <div className="mt-8 bg-zinc-50 rounded-xl p-6 text-sm text-zinc-500 space-y-2">
                    <p><strong className="text-zinc-700">Where is my order number?</strong></p>
                    <p>Your order number was included in the confirmation email sent when you placed your order.</p>
                    <p><strong className="text-zinc-700">Still need help?</strong></p>
                    <p>Contact us at <a href="mailto:support@techaabid.com" className="text-zinc-900 underline">support@techaabid.com</a> or call <a href="tel:+13022661513" className="text-zinc-900 underline">+1 (302) 266-1513</a>.</p>
                </div>
            </div>
        </div>
    );
}
