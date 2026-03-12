'use client';

import Link from 'next/link';
import { X, ChevronRight, Heart, User, Package } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/ui/Logo';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[320px] p-0 bg-white">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                        <Link href="/" onClick={onClose} className="flex items-center">
                            <Logo size="small" />
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto">
                        <div className="py-2">
                            {siteConfig.navigation.map((item) => (
                                <div key={item.label}>
                                    {item.children ? (
                                        <div>
                                            <div className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                                {item.label}
                                            </div>
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={onClose}
                                                    className="flex items-center justify-between px-6 py-3 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                                >
                                                    {child.label}
                                                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                                        >
                                            {item.label}
                                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-100 my-2" />

                        {/* Secondary links */}
                        <div className="py-2">
                            <Link
                                href="/wishlist"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <Heart className="h-4 w-4" />
                                Wishlist
                            </Link>
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Account
                            </Link>
                            <Link
                                href="/track-order"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <Package className="h-4 w-4" />
                                Track Order
                            </Link>
                        </div>
                    </nav>

                    {/* Footer info */}
                    <div className="border-t border-zinc-100 p-4">
                        <p className="text-xs text-zinc-500">{siteConfig.email}</p>
                        <p className="text-xs text-zinc-500 mt-1">{siteConfig.phone}</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
