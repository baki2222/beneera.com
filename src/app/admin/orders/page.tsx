'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { orders } from '@/data/admin/orders';
import StatusBadge from '@/components/admin/StatusBadge';
import { Search, Filter } from 'lucide-react';

const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter((o) => o.fulfillmentStatus === statusFilter);
    return list;
  }, [search, statusFilter]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-sm text-zinc-500">{orders.length} total orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {statusTabs.map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.fulfillmentStatus === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-amber-500/15 text-amber-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-center px-5 py-3 font-medium hidden sm:table-cell">Items</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Payment</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-white hover:text-amber-400">{order.orderNumber}</Link>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-zinc-300">{order.customerName}</p>
                    <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3 text-sm text-zinc-400 text-center hidden sm:table-cell">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-5 py-3 text-sm font-medium text-white text-right">${order.total.toFixed(2)}</td>
                  <td className="px-5 py-3 hidden sm:table-cell"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="px-5 py-3"><StatusBadge status={order.fulfillmentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
