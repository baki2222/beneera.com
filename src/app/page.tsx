export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import prisma from '@/lib/prisma';
import { toProducts, toCategory } from '@/lib/db/mappers';
import { faqs } from '@/data/faqs';
import { logError } from '@/lib/error-logger';
import ProductGrid from '@/components/home/ProductGrid';
import FAQPreview from '@/components/home/FAQPreview';
import HeroSlider from '@/components/home/HeroSlider';

export default async function HomePage() {
  let bestSellers: any[] = [];
  let newArrivals: any[] = [];
  let featuredCategories: any[] = [];

  try {
    const [dbBestSellers, dbNewArrivals, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: { published: true, badges: { hasSome: ['Best Seller', 'Popular'] } },
        include: { category: true },
        take: 8,
      }),
      prisma.product.findMany({
        where: { published: true, badges: { has: 'New' } },
        include: { category: true },
        take: 8,
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ]);

    bestSellers = toProducts(dbBestSellers);
    newArrivals = toProducts(dbNewArrivals);
    featuredCategories = dbCategories.map(toCategory);
  } catch (err: any) {
    await logError({
      level: 'error',
      source: 'server',
      message: `[Homepage] ${err.message}`,
      stack: err.stack,
      url: '/',
      meta: { digest: err.digest },
    });
  }

  const previewFaqs = faqs.slice(0, 5);


  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Categories */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-zinc-500 mt-2">
                Browse our curated product categories
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="group relative flex flex-col items-center text-center p-5 bg-zinc-50 rounded-xl hover:bg-zinc-900 transition-all duration-300 overflow-hidden"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white shadow-md group-hover:border-zinc-700 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium text-zinc-800 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 group-hover:text-zinc-400 transition-colors">
                  {cat.productCount} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-zinc-50/80 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="block w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-[0.2em]">Top Picks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Best Sellers
              </h2>
              <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                Our most popular products right now
              </p>
            </div>
            <Link
              href="/shop?sort=popular"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-zinc-900 rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
              Free Shipping on Auto Parts Over $49
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
              Replacement parts, accessories, tools & more — delivered
              fast with free U.S. shipping on qualifying orders.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-zinc-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="block w-8 h-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-[0.2em]">Fresh In</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                Just added to the collection
              </p>
            </div>
            <Link
              href="/shop?sort=newest"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-zinc-700 border border-zinc-200 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight text-center mb-12">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $49 across the continental U.S.' },
              { icon: Shield, title: 'Secure Checkout', desc: 'Your data is protected with industry-standard encryption.' },
              { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy returns and exchanges within 30 days of delivery.' },
              { icon: Headphones, title: 'Dedicated Support', desc: 'Real humans ready to help via email and phone.' },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl border border-zinc-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 sm:py-20 bg-zinc-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-500 mt-2">
              Quick answers to common questions
            </p>
          </div>
          <FAQPreview faqs={previewFaqs} />
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              View All FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact / Support Reassurance */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-zinc-50 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">
              Need Help? We&apos;re Here for You
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Our support team is available to answer questions, assist with orders,
              and resolve any issues you may have.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 text-sm font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
