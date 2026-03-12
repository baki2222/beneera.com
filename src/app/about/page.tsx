import { Metadata } from 'next';
import { siteConfig } from '@/data/site-config';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Wrench, Users, Award, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'About Us', description: 'Learn about Beneera — a trusted U.S.-based online store for auto parts, car accessories, truck parts, and automotive care products.' };

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: 'About Us' }]} />
            <div className="py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-8">About Beneera</h1>
                <div className="prose prose-zinc max-w-none">
                    <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                        Beneera is a trusted U.S.-based automotive parts and accessories store dedicated to providing everything your vehicle needs to perform at its best. From replacement parts and performance upgrades to car care products and specialized locking hubs — we carefully select every item with quality, reliability, and value in mind.
                    </p>
                    <h2 className="text-xl font-semibold text-zinc-900 mt-10 mb-4">What We Offer</h2>
                    <p className="text-zinc-600 leading-relaxed mb-6">
                        We carry a comprehensive range of automotive products across 11 categories — covering cars, trucks, and SUVs. Whether you need brake pads for your daily driver, a tonneau cover for your truck, locking hubs for your 4WD, or detailing supplies for a weekend detail session — we have it covered with products that meet or exceed OEM specifications.
                    </p>
                    <h2 className="text-xl font-semibold text-zinc-900 mt-10 mb-4">Our Approach</h2>
                    <p className="text-zinc-600 leading-relaxed mb-6">
                        As automotive enthusiasts ourselves, we understand that reliable parts matter. We take a customer-first approach that prioritizes product quality, accurate fitment information, honest descriptions, and responsive support. No misleading claims — just dependable parts and straightforward service from BENEERA LLC.
                    </p>
                    <h2 className="text-xl font-semibold text-zinc-900 mt-10 mb-4">Growing Together</h2>
                    <p className="text-zinc-600 leading-relaxed mb-6">
                        Beneera is continuously expanding to serve more automotive enthusiasts and professionals. We are growing our product catalog, strengthening supplier partnerships, and improving our operations to provide faster deliveries and better support. Our goal is to be the trusted go-to source for quality automotive parts and accessories.
                    </p>
                    <p className="text-zinc-600 leading-relaxed mb-6">
                        We welcome feedback, product suggestions, and wholesale inquiries. If you have questions about our products or business, please don&apos;t hesitate to <a href="/contact" className="text-zinc-900 font-medium underline">get in touch</a>.
                    </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-12 border-t border-zinc-100">
                    {[
                        { icon: Wrench, title: 'Quality Parts', desc: 'Every product is vetted for fit, finish, and performance.' },
                        { icon: Users, title: 'Customer First', desc: 'Your satisfaction drives every decision we make.' },
                        { icon: Award, title: 'OEM-Grade Quality', desc: 'Parts that meet or exceed original equipment specs.' },
                        { icon: ShieldCheck, title: 'Trusted Service', desc: 'Honest descriptions, accurate fitment, responsive support.' },
                    ].map((v) => (
                        <div key={v.title} className="text-center">
                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <v.icon className="h-5 w-5 text-zinc-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-1">{v.title}</h3>
                            <p className="text-xs text-zinc-500">{v.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-zinc-50 rounded-xl p-8 text-center">
                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">Questions? Reach Out</h2>
                    <p className="text-sm text-zinc-500 mb-1">{siteConfig.email}</p>
                    <p className="text-sm text-zinc-500">{siteConfig.phone}</p>
                </div>
            </div>
        </div>
    );
}
