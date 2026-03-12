'use client';

import StatCard from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, Activity } from 'lucide-react';

// Mock analytics data
const dailySales = [
  { day: 'Mon', revenue: 342, orders: 5 }, { day: 'Tue', revenue: 518, orders: 8 },
  { day: 'Wed', revenue: 285, orders: 4 }, { day: 'Thu', revenue: 645, orders: 9 },
  { day: 'Fri', revenue: 892, orders: 14 }, { day: 'Sat', revenue: 720, orders: 11 },
  { day: 'Sun', revenue: 456, orders: 7 },
];
const maxRevenue = Math.max(...dailySales.map((d) => d.revenue));

const topProducts = [
  { name: 'Premium Chicken Dry Dog Food', sold: 156, revenue: 6706 },
  { name: 'Orthopedic Memory Foam Dog Bed', sold: 89, revenue: 7119 },
  { name: '10-Gallon LED Aquarium Kit', sold: 67, revenue: 6029 },
  { name: 'Reflective No-Pull Harness', sold: 134, revenue: 4689 },
  { name: 'Automatic Pet Water Fountain', sold: 98, revenue: 3919 },
];

const topCategories = [
  { name: 'Dog Food & Treats', revenue: 18420, pct: 28 },
  { name: 'Pet Beds & Furniture', revenue: 12350, pct: 19 },
  { name: 'Collars & Harnesses', revenue: 9870, pct: 15 },
  { name: 'Pet Grooming', revenue: 8540, pct: 13 },
  { name: 'Aquarium Supplies', revenue: 7230, pct: 11 },
];

const recentActivity = [
  { action: 'New order', detail: 'TA-10015 — Sarah Johnson ($55.05)', time: '2 hours ago' },
  { action: 'New customer', detail: 'Daniel Harris joined', time: '5 hours ago' },
  { action: 'Product updated', detail: 'Premium Chicken Dry Dog Food', time: '8 hours ago' },
  { action: 'Inquiry received', detail: 'Bulk order discount inquiry', time: '1 day ago' },
  { action: 'Order delivered', detail: 'TA-10001 — Sarah Johnson', time: '1 day ago' },
  { action: 'Coupon created', detail: 'SUMMER20 — 20% off', time: '2 days ago' },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Analytics</h1><p className="text-sm text-zinc-500">Store performance overview</p></div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value="$65,840" color="emerald" trend={{ value: 22, label: '' }} />
        <StatCard icon={ShoppingCart} label="Total Orders" value="842" color="blue" trend={{ value: 12, label: '' }} />
        <StatCard icon={Users} label="Total Customers" value="456" color="violet" trend={{ value: 18, label: '' }} />
        <StatCard icon={TrendingUp} label="Avg. Order Value" value="$78.20" color="amber" trend={{ value: 5, label: '' }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">Weekly Revenue</h2></div>
          <div className="p-5">
            <div className="flex items-end gap-2 h-48">
              {dailySales.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-500">${d.revenue}</span>
                  <div className="w-full bg-amber-500/20 rounded-t-md relative" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                    <div className="absolute inset-0 bg-amber-500 rounded-t-md" style={{ opacity: 0.3 + (d.revenue / maxRevenue) * 0.7 }} />
                  </div>
                  <span className="text-xs text-zinc-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">Top Products</h2></div>
          <div className="divide-y divide-zinc-800/30">
            {topProducts.map((p, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-zinc-600 w-5">#{i + 1}</span>
                  <div className="min-w-0"><p className="text-sm text-white truncate">{p.name}</p><p className="text-xs text-zinc-500">{p.sold} sold</p></div>
                </div>
                <span className="text-sm font-medium text-emerald-400 shrink-0">${p.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">Top Categories</h2></div>
          <div className="p-5 space-y-4">
            {topCategories.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5"><span className="text-sm text-zinc-300">{c.name}</span><span className="text-xs text-zinc-500">{c.pct}%</span></div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">Recent Activity</h2></div>
          <div className="divide-y divide-zinc-800/30">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                <div className="min-w-0"><p className="text-sm text-white">{a.action}</p><p className="text-xs text-zinc-500">{a.detail}</p></div>
                <span className="text-xs text-zinc-600 shrink-0 ml-auto">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
