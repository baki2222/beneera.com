'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus, Search, MoreHorizontal, Pencil, Copy, Trash2, Eye } from 'lucide-react';

interface AdminProduct {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  stock: number;
  published: boolean;
  images: string[];
  badges: string[];
  category: { name: string; slug: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const perPage = 10;

  // Fetch products and categories from DB
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products/list').then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([prodData, catData]) => {
      if (prodData.products) setProducts(prodData.products);
      if (catData.categories) setCategories(catData.categories);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock';
    return 'in_stock';
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') list = list.filter((p) => p.category?.slug === categoryFilter);
    if (stockFilter !== 'all') list = list.filter((p) => getStockStatus(p.stock) === stockFilter);
    switch (sortBy) {
      case 'title': list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'sku': list.sort((a, b) => a.sku.localeCompare(b.sku)); break;
    }
    return list;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every((p) => selected.includes(p.id));

  const toggleAll = () => {
    if (allSelected) setSelected(selected.filter((id) => !paginated.find((p) => p.id === id)));
    else setSelected([...new Set([...selected, ...paginated.map((p) => p.id)])]);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== deleteId));
    } catch {}
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-zinc-500">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..." className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
            <option value="title">Sort: Name</option>
            <option value="price-asc">Price: Low→High</option>
            <option value="price-desc">Price: High→Low</option>
            <option value="sku">Sort: SKU</option>
          </select>
        </div>
        {selected.length > 0 && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-zinc-400">{selected.length} selected</span>
            <button className="text-red-400 hover:text-red-300" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-zinc-600 accent-amber-500" /></th>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">SKU</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Stock</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr key={product.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => setSelected(selected.includes(product.id) ? selected.filter((i) => i !== product.id) : [...selected, product.id])} className="rounded border-zinc-600 accent-amber-500" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                        {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${product.id}`} className="text-sm font-medium text-white hover:text-amber-400 truncate block">{product.title}</Link>
                        <p className="text-xs text-zinc-500 truncate">{product.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400 hidden md:table-cell">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400 hidden lg:table-cell">{product.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-white">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice > product.price && <span className="text-xs text-zinc-500 line-through ml-1">${product.compareAtPrice.toFixed(2)}</span>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={getStockStatus(product.stock)} /></td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)} className="p-1 text-zinc-500 hover:text-white rounded hover:bg-zinc-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
                          <Link href={`/admin/products/${product.id}`} className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700" onClick={() => setOpenMenu(null)}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                          <Link href={`/product/${product.slug}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700" onClick={() => setOpenMenu(null)}><Eye className="h-3.5 w-3.5" /> View</Link>
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700" onClick={() => setOpenMenu(null)}><Copy className="h-3.5 w-3.5" /> Duplicate</button>
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-zinc-700" onClick={() => { setDeleteId(product.id); setOpenMenu(null); }}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/60">
            <p className="text-xs text-zinc-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-2.5 py-1 text-xs rounded-md ${page === i + 1 ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Product?" description="This product will be permanently removed. This cannot be undone." />
    </div>
  );
}
