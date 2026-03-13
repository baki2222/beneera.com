'use client';

import { use, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, X, Upload, Loader2, GripVertical, FolderOpen } from 'lucide-react';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';

  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState({
    title: '', slug: '', sku: '', categorySlug: '', subtitle: '', brand: 'Beneera',
    price: '', compareAtPrice: '', cost: '',
    stockStatus: 'in_stock', stockQuantity: '100',
    featured: false, badges: '',
    shortDescription: '', fullDescription: '',
    features: '', specifications: '',
    shippingNote: 'Ships within 1-2 business days', returnNote: 'Returns accepted within 30 days',
    seoTitle: '', metaDescription: '',
    status: 'published' as 'published' | 'draft',
    sourceUrl: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on first render
  if (!loaded) {
    setLoaded(true);
    // Load categories
    fetch('/api/admin/categories').then(r => r.json()).then(data => {
      if (data.categories) setCategories(data.categories);
    }).catch(() => {});
    // Load product if editing
    if (!isNew) {
      fetch(`/api/admin/products/${id}`).then(r => r.json()).then(data => {
        if (data.product) {
          const p = data.product;
          setForm({
            title: p.title || '', slug: p.slug || '', sku: p.sku || '',
            categorySlug: p.category?.slug || '', subtitle: p.subtitle || '', brand: 'Beneera',
            price: p.price?.toString() || '', compareAtPrice: p.compareAtPrice?.toString() || '', cost: '',
            stockStatus: p.stock <= 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock',
            stockQuantity: p.stock?.toString() || '100',
            featured: p.badges?.includes('Popular') || false, badges: p.badges?.join(', ') || '',
            shortDescription: p.shortDescription || '', fullDescription: p.description || '',
            features: p.features?.join('\n') || '',
            specifications: p.specifications ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
            shippingNote: 'Ships within 1-2 business days', returnNote: 'Returns accepted within 30 days',
            seoTitle: p.seoTitle || '', metaDescription: p.metaDescription || '',
            status: p.published ? 'published' : 'draft',
            sourceUrl: p.sourceUrl || '',
          });
          setImages(p.images || []);
        }
      }).catch(() => {});
    }
  }

  const update = (field: string, value: string | boolean) => setForm({ ...form, [field]: value });

  const handleImageUpload = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/media', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setImages(prev => [...prev, data.url]);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const stockMap: Record<string, number> = { in_stock: Number(form.stockQuantity) || 50, low_stock: 5, out_of_stock: 0 };
      const specs: Record<string, string> = {};
      form.specifications.split('\n').forEach(line => {
        const [k, ...v] = line.split(':');
        if (k?.trim() && v.length) specs[k.trim()] = v.join(':').trim();
      });

      const body = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        subtitle: form.subtitle,
        sku: form.sku,
        price: parseFloat(form.price) || 0,
        compareAtPrice: parseFloat(form.compareAtPrice) || 0,
        description: form.fullDescription,
        shortDescription: form.shortDescription,
        images,
        badges: form.badges ? form.badges.split(',').map(b => b.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
        specifications: specs,
        stock: stockMap[form.stockStatus] ?? 50,
        published: form.status === 'published',
        seoTitle: form.seoTitle,
        metaDescription: form.metaDescription,
        categorySlug: form.categorySlug,
        sourceUrl: form.sourceUrl,
      };

      const url = isNew ? '/api/admin/products' : `/api/admin/products/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (isNew) {
          const data = await res.json();
          if (data.product?.id) {
            window.location.href = `/admin/products/${data.product.id}`;
          }
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'media', label: 'Media' },
    { id: 'pricing', label: 'Pricing & Inventory' },
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'seo', label: 'SEO' },
  ];

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const labelCls = "block text-sm font-medium text-zinc-400 mb-1.5";

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800"><ArrowLeft className="h-5 w-5" /></Link>
          <div>
            <h1 className="text-xl font-bold text-white">{isNew ? 'Add Product' : `Edit: ${form.title}`}</h1>
            {form.sku && <p className="text-xs text-zinc-500">SKU: {form.sku}</p>}
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 text-sm font-semibold rounded-lg transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-zinc-800/60 pb-px">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${tab === t.id ? 'bg-zinc-900 text-amber-500 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-6">
        {tab === 'basic' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>Title *</label><input value={form.title} onChange={(e) => update('title', e.target.value)} className={inputCls} placeholder="Product title" /></div>
              <div><label className={labelCls}>Slug</label><input value={form.slug} onChange={(e) => update('slug', e.target.value)} className={inputCls} placeholder="product-slug" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>SKU *</label><input value={form.sku} onChange={(e) => update('sku', e.target.value)} className={inputCls} placeholder="TA-XX-000" /></div>
              <div><label className={labelCls}>Brand</label><input value={form.brand} onChange={(e) => update('brand', e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Subtitle</label><input value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} className={inputCls} placeholder="Short tagline" /></div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Category *</label>
                <select value={form.categorySlug} onChange={(e) => update('categorySlug', e.target.value)} className={inputCls}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputCls}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div><label className={labelCls}>Badges (comma separated)</label><input value={form.badges} onChange={(e) => update('badges', e.target.value)} className={inputCls} placeholder="New, Popular, Limited" /></div>
            <div>
              <label className={labelCls}>Source URL <span className="text-zinc-600">(admin only)</span></label>
              <div className="flex gap-2">
                <input value={form.sourceUrl} onChange={(e) => update('sourceUrl', e.target.value)} className={inputCls + ' flex-1'} placeholder="https://amazon.com/dp/..." />
                {form.sourceUrl && (
                  <a href={form.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm rounded-lg transition-colors whitespace-nowrap">Open ↗</a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-zinc-600 accent-amber-500" />
              <label className="text-sm text-zinc-300">Featured product</label>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="space-y-5">
            <label className={labelCls}>Product Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-zinc-800 rounded-lg overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500/80 rounded text-[10px] font-bold text-zinc-950">MAIN</span>}
                </div>
              ))}
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    <span className="text-xs">Upload</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
              >
                <FolderOpen className="h-4 w-4" />
                Select from Media Library
              </button>
            </div>
            <p className="text-xs text-zinc-500">First image will be used as the main product image. Max 5 MB per file.</p>
            <MediaPickerModal
              isOpen={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSelect={(urls) => setImages(prev => [...prev, ...urls.filter(u => !prev.includes(u))])}
            />
          </div>
        )}

        {tab === 'pricing' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-5">
              <div><label className={labelCls}>Price *</label><input type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputCls} placeholder="0.00" /></div>
              <div><label className={labelCls}>Compare-at Price</label><input type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => update('compareAtPrice', e.target.value)} className={inputCls} placeholder="0.00" /></div>
              <div><label className={labelCls}>Cost</label><input type="number" step="0.01" value={form.cost} onChange={(e) => update('cost', e.target.value)} className={inputCls} placeholder="0.00" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>Stock Status *</label>
                <select value={form.stockStatus} onChange={(e) => update('stockStatus', e.target.value)} className={inputCls}>
                  <option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div><label className={labelCls}>Stock Quantity</label><input type="number" value={form.stockQuantity} onChange={(e) => update('stockQuantity', e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        )}

        {tab === 'description' && (
          <div className="space-y-5">
            <div><label className={labelCls}>Short Description *</label><textarea value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} rows={3} className={inputCls} /></div>
            <div><label className={labelCls}>Full Description</label><textarea value={form.fullDescription} onChange={(e) => update('fullDescription', e.target.value)} rows={6} className={inputCls} /></div>
            <div><label className={labelCls}>Features (one per line)</label><textarea value={form.features} onChange={(e) => update('features', e.target.value)} rows={5} className={inputCls} placeholder={"DHA for brain development\nHigh-quality protein"} /></div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={labelCls}>Shipping Note</label><input value={form.shippingNote} onChange={(e) => update('shippingNote', e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Return Note</label><input value={form.returnNote} onChange={(e) => update('returnNote', e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        )}

        {tab === 'specs' && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Specifications (key: value, one per line)</label>
              <textarea value={form.specifications} onChange={(e) => update('specifications', e.target.value)} rows={8} className={inputCls} placeholder={"Weight: 25 lbs\nProtein: Chicken\nLife Stage: Adult"} />
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="space-y-5">
            <div><label className={labelCls}>SEO Title</label><input value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} className={inputCls} placeholder="Product Title | Beneera" /><p className="text-xs text-zinc-500 mt-1">{form.seoTitle.length}/60 characters</p></div>
            <div><label className={labelCls}>Meta Description</label><textarea value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} rows={3} className={inputCls} placeholder="Brief description for search engines" /><p className="text-xs text-zinc-500 mt-1">{form.metaDescription.length}/160 characters</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
