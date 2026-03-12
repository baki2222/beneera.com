'use client';

import { useState } from 'react';
import { adminUsers } from '@/data/admin/users';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' as 'owner' | 'admin' | 'staff' });

  const openEdit = (id: string) => {
    const u = adminUsers.find((x) => x.id === id)!;
    setForm({ name: u.name, email: u.email, role: u.role });
    setEditId(id);
    setShowForm(true);
  };

  const openNew = () => { setForm({ name: '', email: '', role: 'staff' }); setEditId(null); setShowForm(true); };

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Users & Staff</h1><p className="text-sm text-zinc-500">{adminUsers.length} team members</p></div>
        <button onClick={openNew} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg"><Plus className="h-4 w-4" /> Add User</button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/60"><th className="text-left px-5 py-3 font-medium">User</th><th className="text-left px-5 py-3 font-medium hidden md:table-cell">Email</th><th className="text-left px-5 py-3 font-medium">Role</th><th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Last Login</th><th className="text-left px-5 py-3 font-medium">Status</th><th className="w-20 px-5 py-3"></th></tr></thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-bold">{u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                    <span className="text-sm font-medium text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-zinc-400 hidden md:table-cell">{u.email}</td>
                <td className="px-5 py-3"><StatusBadge status={u.role} /></td>
                <td className="px-5 py-3 text-sm text-zinc-400 hidden sm:table-cell">{new Date(u.lastLogin).toLocaleDateString()}</td>
                <td className="px-5 py-3"><StatusBadge status={u.active ? 'active' : 'inactive'} /></td>
                <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => openEdit(u.id)} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800"><Pencil className="h-3.5 w-3.5" /></button>{u.role !== 'owner' && <button onClick={() => setDeactivateId(u.id)} className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800"><UserX className="h-3.5 w-3.5" /></button>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader><DialogTitle className="text-white">{editId ? 'Edit User' : 'Add User'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="john@techaabid.com" /></div>
            <div><label className="block text-sm font-medium text-zinc-400 mb-1.5">Role *</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'owner' | 'admin' | 'staff' })} className={inputCls}><option value="staff">Staff</option><option value="admin">Admin</option><option value="owner">Owner</option></select></div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg">{editId ? 'Save' : 'Add User'}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deactivateId !== null} onClose={() => setDeactivateId(null)} onConfirm={() => setDeactivateId(null)} title="Deactivate User?" description="This user will lose access to the admin panel." confirmLabel="Deactivate" variant="warning" />
    </div>
  );
}
