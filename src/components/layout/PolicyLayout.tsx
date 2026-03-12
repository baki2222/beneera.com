import Breadcrumbs from '@/components/layout/Breadcrumbs';

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: title }]} />
            <div className="py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">{title}</h1>
                <p className="text-sm text-zinc-400 mb-8">Last updated: {lastUpdated}</p>
                <div className="prose prose-zinc prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-800 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-zinc-600 [&_p]:leading-relaxed [&_ul]:text-zinc-600 [&_li]:text-zinc-600">
                    {children}
                </div>
            </div>
        </div>
    );
}
