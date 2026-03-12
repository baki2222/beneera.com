'use client';

import { useState } from 'react';
import { categories } from '@/data/categories';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [editId, setEditId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const editing = editId !== null ? categories.find((c) => c.id === editId) : null;
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '', seoTitle: '', metaDescription: '', featured: false });

  const openEdit = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, seoTitle: '', metaDescription: '', featured: false });
      setEditId(id);
    }
  };

  const openNew = () => {
    setForm({ name: '', slug: '', description: '', image: '', seoTitle: '', metaDescription: '', featured: false });
    setShowNew(true);
  };

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-zinc-500">{categories.length} categories</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Slug</th>
              <th className="text-center px-5 py-3 font-medium">Products</th>
              <th className="w-24 px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      {cat.image && <img src={cat.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{cat.name}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">{cat.slug}</td>
                <td className="px-5 py-3 text-sm text-zinc-300 text-center">{cat.productCount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(cat.id)} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showNew || editId !== null} onOpenChange={() => { setShowNew(false); setEditId(null); }}>
        <DialogContent className="sm:max-w-lg bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{editId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Category name" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="category-slug" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Image URL</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="/images/categories/..." /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">SEO Title</label><input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputCls} /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Meta Description</label><textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} className={inputCls} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-zinc-600 accent-amber-500" />
              <label className="text-sm text-zinc-300">Featured category</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setShowNew(false); setEditId(null); }} className="flex-1 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg">Cancel</button>
              <button onClick={() => { setShowNew(false); setEditId(null); }} className="flex-1 py-2.5 text-sm font-medium text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-lg">{editId ? 'Save Changes' : 'Create Category'}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => setDeleteId(null)} title="Delete Category?" description="All products in this category will be unassigned." />
    </div>
  );
}
