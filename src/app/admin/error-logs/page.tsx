'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, AlertCircle, Info, RefreshCw, Trash2, CheckCircle2, Search, ChevronLeft, ChevronRight, X, Clock, Server, Monitor, Shield, CreditCard, Mail, Loader2 } from 'lucide-react';

interface ErrorLogEntry {
    id: string;
    level: 'error' | 'warn' | 'info';
    source: string;
    message: string;
    stack: string | null;
    url: string | null;
    method: string | null;
    statusCode: number | null;
    userAgent: string | null;
    ip: string | null;
    meta: Record<string, unknown> | null;
    resolved: boolean;
    createdAt: string;
}

interface Stats {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    unresolved: number;
    last24h: number;
}

const levelConfig = {
    error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Error' },
    warn: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Warning' },
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Info' },
};

const sourceIcons: Record<string, typeof Server> = {
    server: Server, client: Monitor, api: Server, auth: Shield, payment: CreditCard, email: Mail,
};

function timeAgo(dateStr: string): string {
    const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

export default function AdminErrorLogsPage() {
    const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [level, setLevel] = useState('all');
    const [source, setSource] = useState('all');
    const [resolved, setResolved] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '50' });
            if (level !== 'all') params.set('level', level);
            if (source !== 'all') params.set('source', source);
            if (resolved) params.set('resolved', resolved);
            if (search) params.set('search', search);

            const res = await fetch(`/api/admin/error-logs?${params}`);
            const data = await res.json();
            setLogs(data.logs || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
            setStats(data.stats || null);
        } catch { }
        setLoading(false);
    }, [page, level, source, resolved, search]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const handleResolve = async (ids: string[], resolve = true) => {
        await fetch('/api/admin/error-logs', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, resolved: resolve }),
        });
        setSelected(new Set());
        fetchLogs();
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} error log(s)?`)) return;
        await fetch('/api/admin/error-logs', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        setSelected(new Set());
        fetchLogs();
    };

    const handleClearAll = async () => {
        if (!confirm('Delete ALL error logs? This cannot be undone.')) return;
        await fetch('/api/admin/error-logs', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clearAll: true }),
        });
        fetchLogs();
    };

    const handleClearResolved = async () => {
        if (!confirm('Delete all resolved error logs?')) return;
        await fetch('/api/admin/error-logs', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clearResolved: true }),
        });
        fetchLogs();
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };
    const toggleAll = () => {
        if (selected.size === logs.length) setSelected(new Set());
        else setSelected(new Set(logs.map(l => l.id)));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Error Logs</h1>
                    <p className="text-sm text-zinc-500">{total} total entries</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchLogs} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Refresh">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleClearResolved} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors">
                        Clear Resolved
                    </button>
                    <button onClick={handleClearAll} className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-colors">
                        Clear All
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-zinc-800' },
                        { label: 'Errors', value: stats.errors, color: 'text-red-400', bg: 'bg-red-500/10' },
                        { label: 'Warnings', value: stats.warnings, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { label: 'Info', value: stats.info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Unresolved', value: stats.unresolved, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                        { label: 'Last 24h', value: stats.last24h, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-zinc-800/40`}>
                            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <select value={level} onChange={e => { setLevel(e.target.value); setPage(1); }} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
                    <option value="all">All Levels</option>
                    <option value="error">Errors</option>
                    <option value="warn">Warnings</option>
                    <option value="info">Info</option>
                </select>
                <select value={source} onChange={e => { setSource(e.target.value); setPage(1); }} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
                    <option value="all">All Sources</option>
                    <option value="server">Server</option>
                    <option value="client">Client</option>
                    <option value="api">API</option>
                    <option value="auth">Auth</option>
                    <option value="payment">Payment</option>
                    <option value="email">Email</option>
                </select>
                <select value={resolved} onChange={e => { setResolved(e.target.value); setPage(1); }} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
                    <option value="">All Status</option>
                    <option value="false">Unresolved</option>
                    <option value="true">Resolved</option>
                </select>
                <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search error messages..." className="w-full pl-9 pr-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
                        {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><X className="h-3.5 w-3.5" /></button>}
                    </div>
                </form>
            </div>

            {/* Bulk actions */}
            {selected.size > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700/60 rounded-lg">
                    <span className="text-sm text-zinc-300">{selected.size} selected</span>
                    <div className="flex-1" />
                    <button onClick={() => handleResolve([...selected])} className="px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors">Mark Resolved</button>
                    <button onClick={() => handleResolve([...selected], false)} className="px-3 py-1 text-xs text-amber-400 hover:bg-amber-500/10 rounded transition-colors">Unresolve</button>
                    <button onClick={() => handleDelete([...selected])} className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors">Delete</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-16">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
                        <p className="text-zinc-400 text-sm">No error logs found</p>
                        <p className="text-zinc-600 text-xs mt-1">Everything is running smoothly</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                                    <th className="w-8 px-3 py-3"><input type="checkbox" checked={selected.size === logs.length && logs.length > 0} onChange={toggleAll} className="rounded border-zinc-600 accent-amber-500" /></th>
                                    <th className="text-left px-3 py-3 font-medium">Level</th>
                                    <th className="text-left px-3 py-3 font-medium">Message</th>
                                    <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Source</th>
                                    <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Time</th>
                                    <th className="text-center px-3 py-3 font-medium">Status</th>
                                    <th className="w-16 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => {
                                    const cfg = levelConfig[log.level] || levelConfig.error;
                                    const Icon = cfg.icon;
                                    const SourceIcon = sourceIcons[log.source] || Server;
                                    const expanded = expandedId === log.id;
                                    return (
                                        <>
                                            <tr key={log.id} className={`border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20 cursor-pointer ${log.resolved ? 'opacity-50' : ''}`} onClick={() => setExpandedId(expanded ? null : log.id)}>
                                                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                                                    <input type="checkbox" checked={selected.has(log.id)} onChange={() => toggleSelect(log.id)} className="rounded border-zinc-600 accent-amber-500" />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                                                        <Icon className="h-3 w-3" /> {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <p className="text-sm text-white truncate max-w-[400px]">{log.message}</p>
                                                    {log.url && <p className="text-xs text-zinc-600 truncate max-w-[400px]">{log.method && <span className="text-zinc-500">{log.method} </span>}{log.url}</p>}
                                                </td>
                                                <td className="px-3 py-3 hidden lg:table-cell">
                                                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                                                        <SourceIcon className="h-3 w-3" /> {log.source}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 hidden md:table-cell">
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {timeAgo(log.createdAt)}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${log.resolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                        {log.resolved ? 'Resolved' : 'Open'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => handleDelete([log.id])} className="p-1.5 text-zinc-600 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                            {expanded && (
                                                <tr key={`${log.id}-detail`} className="bg-zinc-800/30">
                                                    <td colSpan={7} className="px-5 py-4 border-b border-zinc-800/30">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <button onClick={() => handleResolve([log.id], !log.resolved)} className={`px-3 py-1 text-xs rounded-lg border transition-colors ${log.resolved ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                                                                    {log.resolved ? 'Reopen' : 'Mark Resolved'}
                                                                </button>
                                                                {log.statusCode && <span className="text-xs text-zinc-500">HTTP {log.statusCode}</span>}
                                                                {log.ip && <span className="text-xs text-zinc-600">IP: {log.ip}</span>}
                                                                <span className="text-xs text-zinc-600">{new Date(log.createdAt).toLocaleString()}</span>
                                                            </div>
                                                            {log.stack && (
                                                                <div>
                                                                    <p className="text-xs text-zinc-500 mb-1 font-medium">Stack Trace</p>
                                                                    <pre className="text-xs text-zinc-400 bg-zinc-900 rounded-lg p-3 overflow-x-auto max-h-48 whitespace-pre-wrap font-mono">{log.stack}</pre>
                                                                </div>
                                                            )}
                                                            {log.userAgent && (
                                                                <div>
                                                                    <p className="text-xs text-zinc-500 mb-1 font-medium">User Agent</p>
                                                                    <p className="text-xs text-zinc-600 break-all">{log.userAgent}</p>
                                                                </div>
                                                            )}
                                                            {log.meta && Object.keys(log.meta).length > 0 && (
                                                                <div>
                                                                    <p className="text-xs text-zinc-500 mb-1 font-medium">Metadata</p>
                                                                    <pre className="text-xs text-zinc-400 bg-zinc-900 rounded-lg p-3 overflow-x-auto font-mono">{JSON.stringify(log.meta, null, 2)}</pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/60">
                                <p className="text-xs text-zinc-500">Page {page} of {pages} · {total} entries</p>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800">
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages} className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 rounded hover:bg-zinc-800">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
