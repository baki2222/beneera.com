'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Shield, Wrench } from 'lucide-react';

interface Slide {
    title: string;
    highlight: string;
    subtitle: string;
    cta: string;
    ctaLink: string;
    bgImage: string;
    bgColor: string;
    badge?: string;
}

const slides: Slide[] = [
    {
        title: 'Premium Auto Parts for',
        highlight: 'Every Vehicle',
        subtitle: 'OEM-quality brake pads, engine parts & accessories. Free shipping on orders over $50.',
        cta: 'Shop Brake Parts',
        ctaLink: '/shop/brake-parts-accessories',
        bgImage: '/images/categories/brake-parts.jpg',
        bgColor: 'from-zinc-900/85 via-zinc-800/75 to-slate-900/85',
        badge: '🔧 Best Sellers',
    },
    {
        title: 'Professional',
        highlight: 'Car Care & Detailing',
        subtitle: 'Complete detailing kits, wash supplies & cleaning tools for that showroom-quality finish.',
        cta: 'Shop Car Care',
        ctaLink: '/shop/car-care-detailing',
        bgImage: '/images/categories/car-care-detailing.jpg',
        bgColor: 'from-blue-900/85 via-indigo-800/75 to-slate-900/85',
        badge: '✨ Pro Grade',
    },
    {
        title: 'Roadside Ready with',
        highlight: 'Safety & Emergency',
        subtitle: 'Emergency kits, jumper cables, first aid & essential roadside safety equipment.',
        cta: 'Shop Safety Kits',
        ctaLink: '/shop/safety-emergency',
        bgImage: '/images/categories/safety-emergency.jpg',
        bgColor: 'from-stone-900/85 via-neutral-800/75 to-zinc-900/85',
        badge: '🛡️ Stay Safe',
    },
    {
        title: 'Light Up the Road with',
        highlight: 'LED Upgrades',
        subtitle: 'Headlights, interior LED kits, underglow strips & smart lighting with app control.',
        cta: 'Shop Lighting',
        ctaLink: '/shop/automotive-lighting',
        bgImage: '/images/categories/automotive-lighting.jpg',
        bgColor: 'from-gray-900/85 via-slate-800/75 to-zinc-900/85',
        badge: '💡 Brighten Up',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [isTransitioning]);

    const next = useCallback(() => goToSlide((current + 1) % slides.length), [current, goToSlide]);
    const prev = useCallback(() => goToSlide((current - 1 + slides.length) % slides.length), [current, goToSlide]);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    return (
        <section className="relative w-full h-[520px] sm:h-[560px] lg:h-[600px] overflow-hidden">
            {/* Background Images */}
            {slides.map((s, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={s.bgImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${s.bgColor}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                </div>
            ))}

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
                <div className="max-w-2xl">
                    {/* Badge */}
                    {slide.badge && (
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {slide.badge}
                        </div>
                    )}

                    {/* Title */}
                    <h1
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4 transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {slide.title}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                            {slide.highlight}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className={`text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg transition-all duration-500 delay-200 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {slide.subtitle}
                    </p>

                    {/* CTAs */}
                    <div
                        className={`flex flex-wrap gap-3 transition-all duration-500 delay-300 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        <Link
                            href={slide.ctaLink}
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-900/30"
                        >
                            {slide.cta}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                        >
                            Shop All Products
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div
                        className={`flex items-center gap-6 mt-10 transition-all duration-500 delay-[400ms] ${isTransitioning ? 'opacity-0' : 'opacity-100'
                            }`}
                    >
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Truck className="h-4 w-4" />
                            <span>Free Shipping $50+</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Shield className="h-4 w-4" />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-white/60 text-xs">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-red-400 text-red-400" />
                            ))}
                            <span className="ml-1">4.9/5 Rated</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hidden sm:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hidden sm:block"
                aria-label="Next slide"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`transition-all duration-300 rounded-full ${i === current
                            ? 'w-8 h-2.5 bg-red-500'
                            : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${((current + 1) / slides.length) * 100}%` }}
                />
            </div>
        </section>
    );
}
