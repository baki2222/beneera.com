'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Copy, Upload, Grid, List, Check, Loader2, X, CloudUpload, Search, ArrowUpDown } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  source: 'upload' | 'product';
  createdAt?: string;
  productTitle?: string;
}

type SortKey = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';

export default function AdminMediaPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upload' | 'product'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media?include=all');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch {
      setError('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileList: FileList | File[]) => {
    const filesToUpload = Array.from(fileList);
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setError('');
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${filesToUpload.length}...`);
        const formData = new FormData();
        formData.append('file', filesToUpload[i]);
        const res = await fetch('/api/media', { method: 'POST', body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }
      }
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (file.source === 'product') {
      alert('Product images cannot be deleted from the media library. Remove them from the product instead.');
      return;
    }
    if (!confirm('Delete this file? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path }),
      });
      if (res.ok) { setSelected(null); await loadFiles(); }
    } catch { setError('Failed to delete file'); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }, []);

  // Filter + Search + Sort
  const processedFiles = files
    .filter((f) => {
      if (filter !== 'all' && f.source !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return f.name.toLowerCase().includes(q) || (f.productTitle || '').toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return (b.createdAt || '').localeCompare(a.createdAt || '') || b.name.localeCompare(a.name);
        case 'oldest': return (a.createdAt || '').localeCompare(b.createdAt || '') || a.name.localeCompare(b.name);
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'size-desc': return (b.size || 0) - (a.size || 0);
        case 'size-asc': return (a.size || 0) - (b.size || 0);
        default: return 0;
      }
    });

  const sel = selected ? files.find((m) => m.id === selected) : null;

  return (
    <div className="space-y-4" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-sm text-zinc-500">{processedFiles.length} files{search ? ` matching "${search}"` : ''}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-zinc-800 rounded-lg p-0.5">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}><Grid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}><List className="h-4 w-4" /></button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-sm font-semibold rounded-lg">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? uploadProgress || 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename or product name..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300">
          <option value="all">All Files</option>
          <option value="product">Product Images</option>
          <option value="upload">Uploads</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="size-desc">Largest First</option>
          <option value="size-asc">Smallest First</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => setError('')}><X className="h-4 w-4 text-red-400" /></button>
        </div>
      )}

      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-amber-400">
            <CloudUpload className="h-16 w-16" />
            <p className="text-lg font-semibold">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>
      ) : processedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
          <CloudUpload className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300 mb-1">{search ? 'No files match your search' : 'No media files'}</h3>
          <p className="text-sm text-zinc-500 mb-4">{search ? 'Try a different search term' : 'Drag & drop images here or click Upload'}</p>
          {!search && (
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg">Choose Files</button>
          )}
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1">
            {view === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {processedFiles.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item.id)}
                    className={`relative aspect-square bg-zinc-900 rounded-lg overflow-hidden border-2 transition-colors ${selected === item.id ? 'border-amber-500' : 'border-transparent hover:border-zinc-700'}`}>
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    {selected === item.id && <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-zinc-950" /></div>}
                    {item.source === 'upload' && <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500/80 rounded text-[10px] font-bold text-zinc-950">UPLOAD</div>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                    <th className="text-left px-4 py-3 font-medium">File</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Source</th>
                    <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Size</th>
                  </tr></thead>
                  <tbody>
                    {processedFiles.map((item) => (
                      <tr key={item.id} onClick={() => setSelected(item.id)}
                        className={`border-b border-zinc-800/30 last:border-0 cursor-pointer ${selected === item.id ? 'bg-amber-500/5' : 'hover:bg-zinc-800/20'}`}>
                        <td className="px-4 py-2.5 flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden shrink-0"><img src={item.url} alt="" className="w-full h-full object-cover" /></div>
                          <div className="min-w-0">
                            <span className="text-sm text-white truncate block">{item.name}</span>
                            {item.productTitle && <span className="text-xs text-zinc-500 truncate block">{item.productTitle}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-zinc-500 hidden md:table-cell capitalize">{item.source}</td>
                        <td className="px-4 py-2.5 text-sm text-zinc-500 text-right hidden sm:table-cell">{formatSize(item.size)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {sel && (
            <div className="hidden lg:block w-72 shrink-0">
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 sticky top-4 space-y-4">
                <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden"><img src={sel.url} alt={sel.name} className="w-full h-full object-cover" /></div>
                <div>
                  <p className="text-sm font-medium text-white truncate">{sel.name}</p>
                  <p className="text-xs text-zinc-500">{formatSize(sel.size)} · {sel.source === 'upload' ? 'Uploaded' : 'Product Image'}</p>
                  {sel.productTitle && <p className="text-xs text-zinc-400 mt-0.5">From: {sel.productTitle}</p>}
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">URL</label>
                  <input readOnly value={sel.url} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(sel.url)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg">
                    {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy URL</>}
                  </button>
                  {sel.source === 'upload' && (
                    <button onClick={() => handleDelete(sel)} className="p-2 text-red-400 hover:bg-zinc-800 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
