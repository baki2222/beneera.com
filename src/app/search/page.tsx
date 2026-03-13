'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SearchBar from '@/components/forms/SearchBar';
import { Search } from 'lucide-react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => {
                setResults(data.products || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'Search' }]} />
            <div className="py-8">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-6">Search</h1>
                <div className="max-w-xl mb-8">
                    <SearchBar />
                </div>
                {query ? (
                    loading ? (
                        <div className="text-center py-16 text-zinc-400">Searching...</div>
                    ) : (
                        <>
                            <p className="text-sm text-zinc-500 mb-6">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
                            {results.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {results.map((p) => (<ProductCard key={p.id} product={p} />))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <Search className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">No results found</h2>
                                    <p className="text-sm text-zinc-500">Try different keywords or browse our categories.</p>
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <div className="text-center py-16">
                        <Search className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500">Enter a search term to find products</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-400">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
