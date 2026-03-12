import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { Mail, Phone, MapPin } from 'lucide-react';
import NewsletterForm from '@/components/forms/NewsletterForm';
import Logo from '@/components/ui/Logo';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-300 overflow-hidden">
            {/* Newsletter */}
            <div className="border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="max-w-xl mx-auto text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Stay in the Loop
                        </h3>
                        <p className="text-sm text-zinc-400 mb-5">
                            Subscribe for new product updates, exclusive offers, and helpful tips.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {siteConfig.footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Customer Service
                        </h4>
                        <ul className="space-y-3">
                            {siteConfig.footerLinks.customerService.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {siteConfig.footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-zinc-500" />
                                <a
                                    href={`mailto:${siteConfig.email}`}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors break-all"
                                >
                                    {siteConfig.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-zinc-500" />
                                <a
                                    href={`tel:${siteConfig.phone}`}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                                >
                                    {siteConfig.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-zinc-500" />
                                <span className="text-sm text-zinc-400">
                                    {siteConfig.address.full}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <Logo size="small" dark />
                        <span className="text-sm text-zinc-500">
                            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <Link href="/policies/privacy" className="hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="/policies/terms" className="hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link href="/policies/cookies" className="hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
