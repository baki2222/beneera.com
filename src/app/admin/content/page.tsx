'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ContentSection {
  id: string;
  section: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  value: string;
}

const initialContent: ContentSection[] = [
  { id: 'c1', section: 'Hero', label: 'Hero Title', type: 'text', value: 'Everything Your Pet Needs, Delivered' },
  { id: 'c2', section: 'Hero', label: 'Hero Subtitle', type: 'textarea', value: 'Shop premium pet food, toys, grooming supplies, and more — all at prices you\'ll love.' },
  { id: 'c3', section: 'Hero', label: 'Hero CTA Text', type: 'text', value: 'Shop Now' },
  { id: 'c4', section: 'Hero', label: 'Hero CTA Link', type: 'text', value: '/shop' },
  { id: 'c5', section: 'Announcement', label: 'Announcement Bar Text', type: 'text', value: '🚚 Free Shipping on Orders Over $50!' },
  { id: 'c6', section: 'Announcement', label: 'Active', type: 'text', value: 'true' },
  { id: 'c7', section: 'Promo Banner', label: 'Banner Title', type: 'text', value: 'Summer Sale – Up to 30% Off' },
  { id: 'c8', section: 'Promo Banner', label: 'Banner Description', type: 'textarea', value: 'Stock up on your pet\'s favorites with our biggest sale of the season.' },
  { id: 'c9', section: 'Promo Banner', label: 'Banner Image URL', type: 'text', value: '/images/banners/summer-sale.jpg' },
  { id: 'c10', section: 'Newsletter', label: 'Newsletter Heading', type: 'text', value: 'Stay in the Loop' },
  { id: 'c11', section: 'Newsletter', label: 'Newsletter Description', type: 'textarea', value: 'Subscribe for new product updates, exclusive offers, and helpful tips.' },
  { id: 'c12', section: 'Footer', label: 'Support Email', type: 'text', value: 'support@techaabid.com' },
  { id: 'c13', section: 'Footer', label: 'Phone', type: 'text', value: '+1 (302) 266-1513' },
  { id: 'c14', section: 'Footer', label: 'Address', type: 'text', value: '30 N Gould St #43642, Sheridan, WY 82801' },
];

export default function AdminContentPage() {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);

  const sections = [...new Set(content.map((c) => c.section))];

  const updateValue = (id: string, value: string) => {
    setContent(content.map((c) => c.id === id ? { ...c, value } : c));
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputCls = "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Content</h1><p className="text-sm text-zinc-500">Manage homepage sections, banners, and site content</p></div>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold rounded-lg"><Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Save All'}</button>
      </div>

      {sections.map((section) => (
        <div key={section} className="bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <div className="px-5 py-4 border-b border-zinc-800/60"><h2 className="text-sm font-semibold text-white">{section}</h2></div>
          <div className="p-5 space-y-4">
            {content.filter((c) => c.section === section).map((item) => (
              <div key={item.id}>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">{item.label}</label>
                {item.type === 'textarea' ? (
                  <textarea value={item.value} onChange={(e) => updateValue(item.id, e.target.value)} rows={3} className={inputCls} />
                ) : (
                  <input value={item.value} onChange={(e) => updateValue(item.id, e.target.value)} className={inputCls} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
