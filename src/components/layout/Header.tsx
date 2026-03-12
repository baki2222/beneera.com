'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, ChevronDown, X } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import MobileMenu from './MobileMenu';
import SearchBar from '@/components/forms/SearchBar';
import Logo from '@/components/ui/Logo';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { itemCount, setIsOpen: setCartOpen } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCategoriesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header
                className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-zinc-100'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 lg:h-[72px]">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-zinc-700 hover:text-zinc-900 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center shrink-0">
                            <Logo />
                        </Link>

                        {/* Desktop navigation */}
                        <nav className="hidden lg:flex items-center gap-8 ml-10">
                            {siteConfig.navigation.map((item) =>
                                item.children ? (
                                    <div key={item.label} className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                                            className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2"
                                        >
                                            {item.label}
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {categoriesOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-zinc-100 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setCategoriesOpen(false)}
                                                        className="block px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )
                            )}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors"
                                aria-label="Search"
                            >
                                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </button>

                            <Link
                                href="/wishlist"
                                className="relative p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors hidden sm:flex"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 bg-zinc-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center min-w-[18px] px-1">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/login"
                                className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors hidden sm:flex"
                                aria-label="Account"
                            >
                                <User className="h-5 w-5" />
                            </Link>

                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors"
                                aria-label="Cart"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 bg-zinc-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center min-w-[18px] px-1">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search bar overlay */}
                {searchOpen && (
                    <div className="border-t border-zinc-100 bg-white animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="max-w-2xl mx-auto px-4 py-4">
                            <SearchBar onClose={() => setSearchOpen(false)} />
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile menu */}
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
