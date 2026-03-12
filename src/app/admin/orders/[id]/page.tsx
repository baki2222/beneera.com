'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { getOrderById } from '@/data/admin/orders';
import StatusBadge from '@/components/admin/StatusBadge';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = getOrderById(id);
  const [status, setStatus] = useState(order?.fulfillmentStatus || 'pending');
  const [notes, setNotes] = useState(order?.notes || '');
  const [saved, setSaved] = useState(false);

  if (!order) return <div className="text-white p-8">Order not found</div>;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800"><ArrowLeft className="h-5 w-5" /></Link>
          <div>
            <h1 className="text-xl font-bold text-white">Order {order.orderNumber}</h1>
            <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg">
          <Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Update'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
            <div className="px-5 py-4 border-b border-zinc-800/60">
              <h2 className="text-sm font-semibold text-white">Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-zinc-800/30">
              {order.items.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-zinc-500">SKU: {item.sku} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-zinc-800/60 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="text-white">${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Shipping</span><span className="text-white">{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Tax</span><span className="text-white">${order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-zinc-800/40"><span className="text-white">Total</span><span className="text-amber-500">${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Order Notes</h2>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Fulfillment</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Payment</label>
                <StatusBadge status={order.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Customer</h3>
            <Link href={`/admin/customers/${order.customerId}`} className="text-sm text-amber-400 hover:text-amber-300">{order.customerName}</Link>
            <p className="text-xs text-zinc-500 mt-1">{order.customerEmail}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Shipping Address</h3>
            <div className="text-sm text-zinc-400 space-y-0.5">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
