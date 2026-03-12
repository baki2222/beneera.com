'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Search, Loader2, Upload, Grid, List } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  source: 'upload' | 'product';
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect, multiple = true }: MediaPickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upload' | 'product'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(new Set());
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media?include=all');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch { }
    finally { setLoading(false); }
  };

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/media', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          // Auto-select newly uploaded file
          setSelected(prev => new Set([...prev, data.url]));
        }
      }
      await loadFiles();
    } catch { }
    finally { setUploading(false); }
  };

  const toggleSelect = (url: string) => {
    if (multiple) {
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(url)) next.delete(url);
        else next.add(url);
        return next;
      });
    } else {
      setSelected(new Set([url]));
    }
  };

  const handleConfirm = () => {
    onSelect(Array.from(selected));
    onClose();
  };

  const filtered = files.filter((f) => {
    if (filter !== 'all' && f.source !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Select from Media Library</h2>
          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg disabled:opacity-50">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Upload New
            </button>
            <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-800/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300">
            <option value="all">All Files</option>
            <option value="product">Product Images</option>
            <option value="upload">Uploads</option>
          </select>
          <span className="text-xs text-zinc-500 ml-auto">{selected.size} selected</span>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-zinc-500 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No files found</div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {filtered.map((item) => {
                const isSelected = selected.has(item.url);
                return (
                  <button key={item.id} onClick={() => toggleSelect(item.url)}
                    className={`relative aspect-square bg-zinc-800 rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent hover:border-zinc-600'}`}>
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-zinc-950" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">{filtered.length} files available</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg">Cancel</button>
            <button onClick={handleConfirm} disabled={selected.size === 0}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
              {selected.size > 0 ? `Add ${selected.size} image${selected.size > 1 ? 's' : ''}` : 'Select images'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
