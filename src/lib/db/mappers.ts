/**
 * Compatibility layer: maps Prisma database models to the existing Product/Category types
 * used by all storefront components (ProductCard, ProductPageClient, etc.)
 */
import type { Product, Category } from '@/lib/types';
import type {
  Product as PrismaProduct,
  Category as PrismaCategory,
} from '@prisma/client';

type PrismaProductWithCategory = PrismaProduct & { category: PrismaCategory | null };

/** Map a Prisma Product (+ joined category) to the storefront Product type */
export function toProduct(p: PrismaProductWithCategory): Product {
  const stockStatus: Product['stockStatus'] =
    p.stock <= 0 ? 'out_of_stock' : p.stock <= 10 ? 'low_stock' : 'in_stock';

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    sku: p.sku,
    category: p.category?.name ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    shortDescription: p.shortDescription,
    fullDescription: p.description,
    features: p.features,
    specifications: (p.specifications as Record<string, string>) ?? {},
    shippingNote: 'Ships within 1-2 business days',
    stockStatus,
    badges: p.badges,
    images: p.images,
    seoTitle: p.seoTitle ?? '',
    metaDescription: p.metaDescription ?? '',
  };
}

/** Map an array of Prisma Products to storefront Products */
export function toProducts(ps: PrismaProductWithCategory[]): Product[] {
  return ps.map(toProduct);
}

/** Map a Prisma Category to the storefront Category type */
export function toCategory(c: PrismaCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    image: c.image ?? '',
    productCount: c.productCount,
  };
}
