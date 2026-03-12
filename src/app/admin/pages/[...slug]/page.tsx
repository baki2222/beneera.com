'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { adminPages } from '@/data/admin/pages';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminPageEditPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const fullSlug = slug.join('/');
  const page = adminPages.find((p) => p.slug === fullSlug);

  const [form, setForm] = useState({
    title: page?.title || '', content: page?.content || '',
    seoTitle: page?.seoTitle || '', metaDescription: page?.metaDescription || '',
    status: page?.status || 'published',
  });
  const [saved, setSaved] = useState(false);

  if (!page) return <div className="text-white p-8">Page not found</div>;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800"><ArrowLeft className="h-5 w-5" /></Link>
          <div><h1 className="text-xl font-bold text-white">Edit: {page.title}</h1><p className="text-xs text-zinc-500">/{page.slug}</p></div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg"><Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Save'}</button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 space-y-5">
        <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Page Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })} className={inputCls}>
            <option value="published">Published</option><option value="draft">Draft</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Content</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className={inputCls} /></div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">SEO</h2>
        <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">SEO Title</label><input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">{form.seoTitle.length}/60</p></div>
        <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Meta Description</label><textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} className={inputCls} /><p className="text-xs text-zinc-500 mt-1">{form.metaDescription.length}/160</p></div>
      </div>
    </div>
  );
}
