import { Category } from '@/lib/types';

export const categories: Category[] = [
    {
        id: 1,
        name: 'Replacement Parts',
        slug: 'replacement-parts',
        description: 'OEM and aftermarket replacement parts including brake pads, oil filters, spark plugs, belts, and more to keep your vehicle running smoothly.',
        image: '/images/categories/replacement-parts.jpg',
        productCount: 10,
    },
    {
        id: 2,
        name: 'Car Accessories',
        slug: 'car-accessories',
        description: 'Upgrade your ride with premium car accessories — phone mounts, seat covers, organizers, and convenience essentials.',
        image: '/images/categories/car-accessories.jpg',
        productCount: 10,
    },
    {
        id: 3,
        name: 'Truck Parts & Accessories',
        slug: 'truck-parts-accessories',
        description: 'Heavy-duty truck parts and accessories including bed liners, toolboxes, towing gear, and off-road upgrades.',
        image: '/images/categories/truck-parts-accessories.jpg',
        productCount: 10,
    },
    {
        id: 4,
        name: 'Car Care & Detailing',
        slug: 'car-care-detailing',
        description: 'Professional-grade car care products — wash kits, waxes, polishes, clay bars, and microfiber towels for a showroom finish.',
        image: '/images/categories/car-care-detailing.jpg',
        productCount: 10,
    },
    {
        id: 5,
        name: 'Automotive Lighting',
        slug: 'automotive-lighting',
        description: 'High-performance LED headlights, fog lights, light bars, tail lights, and interior lighting upgrades.',
        image: '/images/categories/automotive-lighting.jpg',
        productCount: 10,
    },
    {
        id: 6,
        name: 'Performance Parts',
        slug: 'performance-parts',
        description: 'Boost your vehicle\'s power and efficiency with cold air intakes, performance exhaust systems, tuners, and more.',
        image: '/images/categories/performance-parts.jpg',
        productCount: 10,
    },
    {
        id: 7,
        name: 'Tools & Equipment',
        slug: 'tools-equipment',
        description: 'Essential automotive tools — jack stands, torque wrenches, OBD2 scanners, and professional-grade equipment for DIY mechanics.',
        image: '/images/categories/tools-equipment.jpg',
        productCount: 10,
    },
    {
        id: 8,
        name: 'Tires & Wheels',
        slug: 'tires-wheels',
        description: 'All-season tires, performance wheels, wheel covers, lug nuts, and tire maintenance accessories.',
        image: '/images/categories/tires-wheels.jpg',
        productCount: 10,
    },
    {
        id: 9,
        name: 'Interior Accessories',
        slug: 'interior-accessories',
        description: 'Transform your cabin with custom floor mats, steering wheel covers, dash cams, sun shades, and interior upgrades.',
        image: '/images/categories/interior-accessories.jpg',
        productCount: 10,
    },
    {
        id: 10,
        name: 'Exterior Accessories',
        slug: 'exterior-accessories',
        description: 'Protect and style your vehicle with mud flaps, roof racks, car covers, grille guards, and body trim accessories.',
        image: '/images/categories/exterior-accessories.jpg',
        productCount: 10,
    },
    {
        id: 11,
        name: 'Locking Hubs',
        slug: 'locking-hubs',
        description: 'Premium manual and automatic locking hubs for 4WD trucks and SUVs — reliable engagement for off-road and daily driving.',
        image: '/images/categories/locking-hubs.jpg',
        productCount: 10,
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: number): Category | undefined {
    return categories.find((c) => c.id === id);
}
