import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `https://techaabid.com${item.href}` }),
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-sm text-zinc-500 py-4 overflow-x-auto scrollbar-hide"
            >
                <Link
                    href="/"
                    className="shrink-0 hover:text-zinc-900 transition-colors"
                    aria-label="Home"
                >
                    <Home className="h-4 w-4" />
                </Link>
                {items.map((item, index) => (
                    <span key={index} className="flex items-center gap-1.5 shrink-0">
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
                        {item.href && index < items.length - 1 ? (
                            <Link
                                href={item.href}
                                className="hover:text-zinc-900 transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-zinc-800 font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    );
}
