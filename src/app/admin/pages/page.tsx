'use client';

import { useState } from 'react';
import Link from 'next/link';
import { adminPages } from '@/data/admin/pages';
import StatusBadge from '@/components/admin/StatusBadge';
import { Pencil } from 'lucide-react';

export default function AdminPagesPage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold text-white">Pages</h1><p className="text-sm text-zinc-500">Manage editable site pages</p></div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/60"><th className="text-left px-5 py-3 font-medium">Page</th><th className="text-left px-5 py-3 font-medium hidden md:table-cell">Slug</th><th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Updated</th><th className="text-left px-5 py-3 font-medium">Status</th><th className="w-12 px-5 py-3"></th></tr></thead>
          <tbody>
            {adminPages.map((page) => (
              <tr key={page.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                <td className="px-5 py-3 text-sm font-medium text-white">{page.title}</td>
                <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">/{page.slug}</td>
                <td className="px-5 py-3 text-sm text-zinc-400 hidden sm:table-cell">{new Date(page.updatedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3"><StatusBadge status={page.status} /></td>
                <td className="px-5 py-3"><Link href={`/admin/pages/${page.slug}`} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800 inline-block"><Pencil className="h-3.5 w-3.5" /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
