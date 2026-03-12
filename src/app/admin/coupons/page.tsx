'use client';

import { useState } from 'react';
import { coupons } from '@/data/admin/coupons';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editing = editId ? coupons.find((c) => c.id === editId) : null;

  const [form, setForm] = useState({ code: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: '', minCartAmount: '', expiryDate: '', usageLimit: '', active: true });

  const openEdit = (id: string) => {
    const c = coupons.find((x) => x.id === id)!;
    setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue.toString(), minCartAmount: c.minCartAmount.toString(), expiryDate: c.expiryDate, usageLimit: c.usageLimit.toString(), active: c.active });
    setEditId(id);
    setShowForm(true);
  };

  const openNew = () => { setForm({ code: '', discountType: 'percentage', discountValue: '', minCartAmount: '', expiryDate: '', usageLimit: '', active: true }); setEditId(null); setShowForm(true); };

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Coupons</h1><p className="text-sm text-zinc-500">{coupons.length} coupons</p></div>
        <button onClick={openNew} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg"><Plus className="h-4 w-4" /> Add Coupon</button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/60"><th className="text-left px-5 py-3 font-medium">Code</th><th className="text-left px-5 py-3 font-medium">Discount</th><th className="text-left px-5 py-3 font-medium hidden md:table-cell">Min Cart</th><th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Expiry</th><th className="text-center px-5 py-3 font-medium hidden sm:table-cell">Usage</th><th className="text-left px-5 py-3 font-medium">Status</th><th className="w-20 px-5 py-3"></th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                  <td className="px-5 py-3"><span className="text-sm font-mono font-bold text-amber-400">{c.code}</span></td>
                  <td className="px-5 py-3 text-sm text-white">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue.toFixed(2)}`}</td>
                  <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">${c.minCartAmount}</td>
                  <td className="px-5 py-3 text-sm text-zinc-400 hidden lg:table-cell">{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-sm text-zinc-400 text-center hidden sm:table-cell">{c.usedCount}{c.usageLimit > 0 ? `/${c.usageLimit}` : ''}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.active ? 'active' : 'inactive'} /></td>
                  <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => openEdit(c.id)} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setDeleteId(c.id)} className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader><DialogTitle className="text-white">{editId ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Coupon Code *</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={`${inputCls} font-mono`} placeholder="COUPON10" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Type</label><select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })} className={inputCls}><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Value *</label><input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputCls} placeholder="10" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Min Cart</label><input type="number" value={form.minCartAmount} onChange={(e) => setForm({ ...form, minCartAmount: e.target.value })} className={inputCls} placeholder="0" /></div>
              <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Usage Limit</label><input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className={inputCls} placeholder="0 = unlimited" /></div>
            </div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Expiry Date</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inputCls} /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-zinc-600 accent-amber-500" /><label className="text-sm text-zinc-300">Active</label></div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg">{editId ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => setDeleteId(null)} title="Delete Coupon?" description="This coupon will be permanently removed." />
    </div>
  );
}
