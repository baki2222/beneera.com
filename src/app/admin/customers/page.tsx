'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { customers } from '@/data/admin/customers';
import { Search } from 'lucide-react';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm text-zinc-500">{customers.length} customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Phone</th>
                <th className="text-center px-5 py-3 font-medium">Orders</th>
                <th className="text-right px-5 py-3 font-medium">Total Spent</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="text-sm font-medium text-white hover:text-amber-400">{c.name}</Link>
                    <p className="text-xs text-zinc-500">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">{c.phone}</td>
                  <td className="px-5 py-3 text-sm text-zinc-300 text-center">{c.orderCount}</td>
                  <td className="px-5 py-3 text-sm font-medium text-white text-right">${c.totalSpent.toFixed(2)}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">{c.tags.map((t) => <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-800 text-zinc-400">{t}</span>)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
