'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { getCustomerById } from '@/data/admin/customers';
import { orders } from '@/data/admin/orders';
import StatusBadge from '@/components/admin/StatusBadge';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customer = getCustomerById(id);
  const [notes, setNotes] = useState(customer?.notes || '');
  const [tags, setTags] = useState(customer?.tags?.join(', ') || '');
  const [saved, setSaved] = useState(false);

  if (!customer) return <div className="text-white p-8">Customer not found</div>;

  const customerOrders = orders.filter((o) => o.customerId === id);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/customers" className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800"><ArrowLeft className="h-5 w-5" /></Link>
          <div>
            <h1 className="text-xl font-bold text-white">{customer.name}</h1>
            <p className="text-xs text-zinc-500">Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg">
          <Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Orders */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
            <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">Orders ({customerOrders.length})</h2></div>
            {customerOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-500 text-center">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/40"><th className="text-left px-5 py-2.5 font-medium">Order</th><th className="text-left px-5 py-2.5 font-medium">Date</th><th className="text-right px-5 py-2.5 font-medium">Total</th><th className="text-left px-5 py-2.5 font-medium">Status</th></tr></thead>
                  <tbody>
                    {customerOrders.map((o) => (
                      <tr key={o.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                        <td className="px-5 py-2.5"><Link href={`/admin/orders/${o.id}`} className="text-sm font-medium text-amber-400 hover:text-amber-300">{o.orderNumber}</Link></td>
                        <td className="px-5 py-2.5 text-sm text-zinc-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-2.5 text-sm font-medium text-white text-right">${o.total.toFixed(2)}</td>
                        <td className="px-5 py-2.5"><StatusBadge status={o.fulfillmentStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Notes</h2>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <div className="text-sm text-zinc-400 space-y-1.5">
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-lg font-bold text-white">{customer.orderCount}</p><p className="text-xs text-zinc-500">Orders</p></div>
              <div><p className="text-lg font-bold text-white">${customer.totalSpent.toFixed(2)}</p><p className="text-xs text-zinc-500">Total Spent</p></div>
            </div>
          </div>
          {customer.addresses.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Address</h3>
              {customer.addresses.map((a, i) => (
                <div key={i} className="text-sm text-zinc-400 space-y-0.5"><p>{a.street}</p><p>{a.city}, {a.state} {a.zip}</p></div>
              ))}
            </div>
          )}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Tags</h3>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma separated" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
