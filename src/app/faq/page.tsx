import { Metadata } from 'next';
import { faqs } from '@/data/faqs';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import FAQPreview from '@/components/home/FAQPreview';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about shipping, returns, payments, and more at Beneera.',
};

export default function FAQPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question', name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    };

    const categories = [...new Set(faqs.map((f) => f.category))];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Breadcrumbs items={[{ label: 'FAQ' }]} />
                <div className="py-8 sm:py-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">Frequently Asked Questions</h1>
                    <p className="text-zinc-500 mb-10">Quick answers to common questions about orders, shipping, returns, and more.</p>

                    {categories.map((cat) => (
                        <div key={cat} className="mb-10">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">{cat}</h2>
                            <FAQPreview faqs={faqs.filter((f) => f.category === cat)} />
                        </div>
                    ))}

                    <div className="mt-12 bg-zinc-50 rounded-xl p-8 text-center">
                        <h2 className="text-xl font-semibold text-zinc-900 mb-2">Still Have Questions?</h2>
                        <p className="text-sm text-zinc-500 mb-4">Our support team is here to help.</p>
                        <Link href="/contact" className="inline-flex px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
