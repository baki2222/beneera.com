import { AdminPage } from '@/lib/admin-types';

export const adminPages: AdminPage[] = [
  { id: 'pg_001', title: 'About Us', slug: 'about', content: 'Beneera is a trusted online pet store...', seoTitle: 'About Beneera Pet Store', metaDescription: 'Learn about Beneera, our mission, and our commitment to pets.', status: 'published', updatedAt: '2026-02-15T10:00:00Z' },
  { id: 'pg_002', title: 'Contact Us', slug: 'contact', content: 'Get in touch with our team...', seoTitle: 'Contact Beneera', metaDescription: 'Contact our support team for any questions about your order or our products.', status: 'published', updatedAt: '2026-02-20T14:00:00Z' },
  { id: 'pg_003', title: 'FAQ', slug: 'faq', content: 'Frequently asked questions...', seoTitle: 'FAQ — Beneera', metaDescription: 'Find answers to common questions about shipping, returns, and our products.', status: 'published', updatedAt: '2026-03-01T09:00:00Z' },
  { id: 'pg_004', title: 'Shipping Policy', slug: 'policies/shipping', content: 'We offer free standard shipping on all orders over $50...', seoTitle: 'Shipping Policy — Beneera', metaDescription: 'Shipping rates, delivery times, and international shipping info.', status: 'published', updatedAt: '2026-01-10T11:00:00Z' },
  { id: 'pg_005', title: 'Returns & Refund Policy', slug: 'policies/returns', content: 'We accept returns within 30 days...', seoTitle: 'Returns & Refund Policy — Beneera', metaDescription: 'How to return products and request refunds at Beneera.', status: 'published', updatedAt: '2026-01-10T11:30:00Z' },
  { id: 'pg_006', title: 'Privacy Policy', slug: 'policies/privacy', content: 'We value your privacy...', seoTitle: 'Privacy Policy — Beneera', metaDescription: 'How we collect, use, and protect your personal information.', status: 'published', updatedAt: '2026-01-10T12:00:00Z' },
  { id: 'pg_007', title: 'Terms of Service', slug: 'policies/terms', content: 'By using our website...', seoTitle: 'Terms of Service — Beneera', metaDescription: 'Terms and conditions for using the Beneera website.', status: 'published', updatedAt: '2026-01-10T12:30:00Z' },
  { id: 'pg_008', title: 'Disclaimer', slug: 'policies/disclaimer', content: 'The information on this website...', seoTitle: 'Disclaimer — Beneera', metaDescription: 'Disclaimer and limitations of liability for Beneera.', status: 'published', updatedAt: '2026-01-10T13:00:00Z' },
  { id: 'pg_009', title: 'Cookie Policy', slug: 'policies/cookies', content: 'We use cookies to improve...', seoTitle: 'Cookie Policy — Beneera', metaDescription: 'How Beneera uses cookies and similar technologies.', status: 'published', updatedAt: '2026-01-10T13:30:00Z' },
  { id: 'pg_010', title: 'Accessibility Statement', slug: 'policies/accessibility', content: 'We are committed to accessibility...', seoTitle: 'Accessibility — Beneera', metaDescription: 'Our commitment to an accessible website experience for all users.', status: 'published', updatedAt: '2026-01-10T14:00:00Z' },
];

export function getPageBySlug(slug: string): AdminPage | undefined {
  return adminPages.find((p) => p.slug === slug);
}
