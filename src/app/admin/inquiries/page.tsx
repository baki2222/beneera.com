'use client';

import { useState, useEffect, useMemo } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Search, Loader2, RefreshCw, Trash2, CheckSquare, Square, XSquare, Reply, Mail, Send } from 'lucide-react';

interface Inquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const statusTabs = ['all', 'new', 'open', 'replied', 'closed'];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewId, setViewId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [reply, setReply] = useState('');

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
    } catch { }
    finally { setLoading(false); }
  };

  const viewing = viewId ? inquiries.find((i) => i.id === viewId) : null;

  const filtered = useMemo(() => {
    let list = [...inquiries];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q) || i.email.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter((i) => i.status === statusFilter);
    return list;
  }, [inquiries, search, statusFilter]);

  const openView = (id: string) => {
    const inq = inquiries.find((i) => i.id === id);
    setNotes(inq?.notes || '');
    setReply('');
    setViewId(id);
  };

  const updateInquiry = async (id: string, data: { status?: string; notes?: string }) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        await loadInquiries();
        if (data.status) setViewId(null);
      }
    } catch { }
    finally { setUpdating(false); }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(i => i.id)));
    }
  };

  const deleteByIds = async (ids: string[]) => {
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} inquiry${ids.length > 1 ? 'ies' : ''}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        setSelected(new Set());
        setViewId(null);
        await loadInquiries();
      }
    } catch { }
    finally { setDeleting(false); }
  };

  const handleBulkDelete = () => deleteByIds(Array.from(selected));
  const handleSingleDelete = (id: string, e?: React.MouseEvent) => { e?.stopPropagation(); deleteByIds([id]); };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: inquiries.length };
    statusTabs.slice(1).forEach((s) => { counts[s] = inquiries.filter((i) => i.status === s).length; });
    return counts;
  }, [inquiries]);

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Inquiries</h1><p className="text-sm text-zinc-500">{inquiries.length} total inquiries</p></div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors">
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete ({selected.size})
            </button>
          )}
          {selected.size > 0 && (
            <button onClick={() => setSelected(new Set())}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg" title="Clear selection">
              <XSquare className="h-4 w-4" />
            </button>
          )}
          <button onClick={loadInquiries} disabled={loading} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {statusTabs.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${statusFilter === s ? 'bg-amber-500/15 text-amber-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or subject..."
          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                <th className="text-left px-3 py-3 w-10">
                  <button onClick={selectAll} className="text-zinc-500 hover:text-white">
                    {allSelected ? <CheckSquare className="h-4 w-4 text-amber-500" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th className="text-left px-3 py-3 font-medium">Subject</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">From</th>
                <th className="text-left px-3 py-3 font-medium hidden sm:table-cell">Type</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Date</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-right px-3 py-3 font-medium w-10"></th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-zinc-500 text-sm">No inquiries found</td></tr>
                ) : filtered.map((inq) => (
                  <tr key={inq.id} className={`group border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20 cursor-pointer ${selected.has(inq.id) ? 'bg-amber-500/5' : ''}`}>
                    <td className="px-3 py-3" onClick={(e) => toggleSelect(inq.id, e)}>
                      {selected.has(inq.id) ? <CheckSquare className="h-4 w-4 text-amber-500" /> : <Square className="h-4 w-4 text-zinc-600 hover:text-zinc-400" />}
                    </td>
                    <td className="px-3 py-3" onClick={() => openView(inq.id)}><p className="text-sm font-medium text-white truncate max-w-xs">{inq.subject}</p></td>
                    <td className="px-3 py-3 hidden md:table-cell" onClick={() => openView(inq.id)}><p className="text-sm text-zinc-400">{inq.name}</p><p className="text-xs text-zinc-500">{inq.email}</p></td>
                    <td className="px-3 py-3 text-sm text-zinc-400 capitalize hidden sm:table-cell" onClick={() => openView(inq.id)}>{inq.type}</td>
                    <td className="px-3 py-3 text-sm text-zinc-400 hidden lg:table-cell" onClick={() => openView(inq.id)}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3" onClick={() => openView(inq.id)}><StatusBadge status={inq.status} /></td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={(e) => handleSingleDelete(inq.id, e)}
                        className="p-1 text-zinc-600 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={viewId !== null} onOpenChange={() => setViewId(null)}>
        <DialogContent className="sm:max-w-xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader><DialogTitle className="text-white">{viewing?.subject}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto">
              {/* Customer info */}
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-zinc-300">{viewing.name}</p><p className="text-xs text-zinc-500">{viewing.email}</p></div>
                <StatusBadge status={viewing.status} />
              </div>
              <div className="flex gap-2 text-xs text-zinc-500">
                <span className="capitalize bg-zinc-800 px-2 py-0.5 rounded">{viewing.type}</span>
                <span>{new Date(viewing.createdAt).toLocaleString()}</span>
              </div>

              {/* Customer message */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">Customer Message</label>
                <div className="bg-zinc-800 rounded-lg p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{viewing.message}</div>
              </div>

              {/* Reply section */}
              <div className="border border-zinc-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Reply className="h-4 w-4 text-amber-500" />
                  <label className="text-sm font-medium text-white">Reply to {viewing.name}</label>
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  placeholder={`Hi ${viewing.name.split(' ')[0]},\n\nThank you for reaching out...`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      setUpdating(true);
                      const subject = `Re: ${viewing.subject}`;
                      try {
                        const res = await fetch('/api/admin/email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ to: viewing.email, subject, body: reply, type: 'inquiry-reply', customerName: viewing.name }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error);
                        // Save reply in notes and mark as replied
                        const updatedNotes = notes ? `${notes}\n\n--- Reply sent (${new Date().toLocaleString()}) ---\n${reply}` : `--- Reply sent (${new Date().toLocaleString()}) ---\n${reply}`;
                        await updateInquiry(viewing.id, { status: 'replied', notes: updatedNotes });
                        setReply('');
                        alert('✅ Email sent successfully!');
                      } catch (err: any) {
                        // Fallback to mailto:
                        const mailto = `mailto:${viewing.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reply)}`;
                        window.open(mailto, '_blank');
                        const updatedNotes = notes ? `${notes}\n\n--- Reply (${new Date().toLocaleString()}) ---\n${reply}` : `--- Reply (${new Date().toLocaleString()}) ---\n${reply}`;
                        await updateInquiry(viewing.id, { status: 'replied', notes: updatedNotes });
                        alert(`SMTP not available (${err.message}). Opened your email client instead.`);
                      } finally { setUpdating(false); }
                    }}
                    disabled={!reply.trim() || updating}
                    className="flex-1 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    {updating ? 'Sending...' : 'Send Reply'}
                  </button>
                  <a
                    href={`mailto:${viewing.email}?subject=${encodeURIComponent('Re: ' + viewing.subject)}`}
                    className="px-4 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center gap-1.5 transition-colors"
                    title="Open blank email in your email client"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    mailto:
                  </a>
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Internal Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" placeholder="Add internal notes (not visible to customer)..." />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {viewing.status !== 'replied' && (
                  <button onClick={() => updateInquiry(viewing.id, { status: 'replied' })} disabled={updating}
                    className="flex-1 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg disabled:opacity-50">
                    Mark as Replied
                  </button>
                )}
                {viewing.status !== 'closed' && (
                  <button onClick={() => updateInquiry(viewing.id, { status: 'closed' })} disabled={updating}
                    className="flex-1 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg disabled:opacity-50">
                    Close
                  </button>
                )}
                <button onClick={() => updateInquiry(viewing.id, { notes })} disabled={updating}
                  className="flex-1 py-2.5 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg disabled:opacity-50">
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <button onClick={() => deleteByIds([viewing.id])}
                className="w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
