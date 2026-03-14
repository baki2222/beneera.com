'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, ExternalLink, Package } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string[];
    stock: number;
    published: boolean;
    rating: number;
    reviewCount: number;
}

interface CategoryDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    productCount: number;
}

export default function AdminCategoryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [category, setCategory] = useState<CategoryDetail | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/admin/categories/${slug}/products`);
                const data = await res.json();
                if (data.category) setCategory(data.category);
                if (data.products) setProducts(data.products);
            } catch {}
            setLoading(false);
        }
        load();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-zinc-400">Loading...</div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-20">
                <p className="text-zinc-400">Category not found</p>
                <Link href="/admin/categories" className="text-amber-500 hover:underline text-sm mt-2 inline-block">← Back to Categories</Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/categories" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{category.name}</h1>
                        <p className="text-sm text-zinc-500">{products.length} products · /{category.slug}</p>
                    </div>
                </div>
                <Link href={`/shop/${category.slug}`} target="_blank" className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> View on Store
                </Link>
            </div>

            {/* Products table */}
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs text-zinc-500 border-b border-zinc-800/60">
                            <th className="text-left px-5 py-3 font-medium">Product</th>
                            <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Price</th>
                            <th className="text-center px-5 py-3 font-medium hidden sm:table-cell">Stock</th>
                            <th className="text-center px-5 py-3 font-medium hidden lg:table-cell">Rating</th>
                            <th className="text-center px-5 py-3 font-medium">Status</th>
                            <th className="w-20 px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center">
                                    <Package className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-zinc-500 text-sm">No products in this category</p>
                                </td>
                            </tr>
                        ) : products.map((product) => (
                            <tr key={product.id} className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/20">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                            {product.images?.[0] && (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{product.title}</p>
                                            <p className="text-xs text-zinc-500">ID: {product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 hidden md:table-cell">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-medium text-white">${product.price.toFixed(2)}</span>
                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                            <span className="text-xs text-zinc-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center hidden sm:table-cell">
                                    <span className={`text-sm ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center hidden lg:table-cell">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-amber-400 text-xs">★</span>
                                        <span className="text-sm text-zinc-300">{product.rating.toFixed(1)}</span>
                                        <span className="text-xs text-zinc-600">({product.reviewCount})</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${product.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700/50 text-zinc-400'}`}>
                                        {product.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <Link href={`/admin/products/${product.id}`} className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-zinc-800 inline-flex">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
