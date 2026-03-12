import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import StorefrontShell from '@/components/layout/StorefrontShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Beneera | Your One-Stop Shop for Automotive Parts & Accessories',
    template: '%s | Beneera',
  },
  description:
    'Beneera is a trusted U.S.-based online store offering premium automotive replacement parts, car accessories, truck parts, car care products, tools, and more at competitive prices.',
  keywords: [
    'auto parts',
    'car accessories',
    'truck parts',
    'car care',
    'automotive lighting',
    'performance parts',
    'replacement parts',
    'locking hubs',
    'Beneera',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://beneera.com',
    siteName: 'Beneera',
    title: 'Beneera | Your One-Stop Shop for Automotive Parts & Accessories',
    description:
      'Trusted U.S.-based online store offering premium automotive replacement parts, car accessories, truck parts, car care products, tools, and more.',
    images: [
      {
        url: 'https://beneera.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Beneera Automotive Parts & Accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beneera | Your One-Stop Shop for Automotive Parts & Accessories',
    description:
      'Trusted U.S.-based online store offering premium automotive replacement parts, car accessories, truck parts, car care products, tools, and more.',
    images: ['https://beneera.com/og-image.png'],
  },
  metadataBase: new URL('https://beneera.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization JSON-LD schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BENEERA LLC',
    url: 'https://beneera.com',
    email: 'support@beneera.com',
    telephone: '+1 (307) 278-4868',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '30 N Gould St # 44190',
      addressLocality: 'Sheridan',
      addressRegion: 'WY',
      postalCode: '82801',
      addressCountry: 'US',
    },
  };

  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-zinc-900 overflow-x-hidden">
        <CartProvider>
          <WishlistProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
