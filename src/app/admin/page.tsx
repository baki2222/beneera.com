'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  Package, FolderTree, ShoppingCart, Users, MessageSquare, DollarSign,
  Plus, ArrowRight, AlertTriangle, Eye,
} from 'lucide-react';

interface DashboardStats {
  productCount: number;
  categoryCount: number;
  orderCount: number;
  customerCount: number;
  newInquiryCount: number;
  totalRevenue: number;
  lowStockProducts: { id: number; title: string }[];
  recentOrders: { id: string; orderNumber: string; customerName: string; total: number; fulfillmentStatus: string }[];
  latestInquiries: { id: string; subject: string; name: string; type: string; status: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Package} label="Products" value={stats.productCount} color="amber" />
        <StatCard icon={FolderTree} label="Categories" value={stats.categoryCount} color="violet" />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.orderCount} color="blue" />
        <StatCard icon={Users} label="Customers" value={stats.customerCount} color="emerald" />
        <StatCard icon={MessageSquare} label="Inquiries" value={stats.newInquiryCount} color="rose" />
        <StatCard icon={DollarSign} label="Revenue" value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-zinc-800/40">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Total</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-white hover:text-amber-400">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-400">{order.customerName}</td>
                    <td className="px-5 py-3 text-sm font-medium text-white">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.fulfillmentStatus} /></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-zinc-500">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions + Low Stock */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Product', href: '/admin/products/new', icon: Plus },
                { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart },
                { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
                { label: 'Analytics', href: '/admin/analytics', icon: Eye },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          {stats.lowStockProducts.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/60">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-white">Low Stock ({stats.lowStockProducts.length})</h2>
              </div>
              <ul>
                {stats.lowStockProducts.slice(0, 5).map((p) => (
                  <li key={p.id} className="px-5 py-3 flex items-center justify-between border-b border-zinc-800/30 last:border-0">
                    <span className="text-sm text-zinc-300 truncate mr-3">{p.title}</span>
                    <StatusBadge status="low_stock" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Latest Inquiries */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
          <h2 className="text-sm font-semibold text-white">Latest Inquiries</h2>
          <Link href="/admin/inquiries" className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-zinc-800/30">
          {stats.latestInquiries.length > 0 ? stats.latestInquiries.map((inq) => (
            <div key={inq.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{inq.subject}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{inq.name} · {inq.type}</p>
              </div>
              <StatusBadge status={inq.status} />
            </div>
          )) : (
            <div className="px-5 py-8 text-center text-sm text-zinc-500">No inquiries yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
