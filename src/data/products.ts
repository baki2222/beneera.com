import { Product } from '@/lib/types';
import { replacementParts } from './products-replacement-parts';
import { carAccessories } from './products-car-accessories';
import { truckPartsAccessories } from './products-truck-parts';
import { carCareDetailing } from './products-car-care';
import { automotiveLighting } from './products-lighting';
import { performanceParts } from './products-performance-parts';
import { toolsEquipment } from './products-tools-equipment';
import { tiresWheels } from './products-tires-wheels';
import { interiorAccessories } from './products-interior-accessories';
import { exteriorAccessories } from './products-exterior-accessories';
import { lockingHubs } from './products-locking-hubs';

export const products: Product[] = [
    ...replacementParts,
    ...carAccessories,
    ...truckPartsAccessories,
    ...carCareDetailing,
    ...automotiveLighting,
    ...performanceParts,
    ...toolsEquipment,
    ...tiresWheels,
    ...interiorAccessories,
    ...exteriorAccessories,
    ...lockingHubs,
];

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
    return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(count = 8): Product[] {
    return products.filter((p) => p.badges?.includes('Popular')).slice(0, count);
}

export function getNewArrivals(count = 8): Product[] {
    return products.filter((p) => p.badges?.includes('New')).slice(0, count);
}

export function searchProducts(query: string): Product[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(
        (p) =>
            p.title.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q),
    );
}
