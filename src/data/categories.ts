import { Category } from '@/lib/types';

export const categories: Category[] = [
    {
        id: 1,
        name: 'Brake Parts & Accessories',
        slug: 'brake-parts',
        description: 'Premium brake pads, rotors, calipers, and brake hardware for all vehicle makes and models.',
        image: '/images/categories/brake-parts.jpg',
        productCount: 8,
    },
    {
        id: 2,
        name: 'Engine Parts',
        slug: 'engine-parts',
        description: 'Essential engine parts and accessories including filters, gaskets, belts, and engine maintenance tools.',
        image: '/images/categories/engine-parts.jpg',
        productCount: 8,
    },
    {
        id: 3,
        name: 'Automotive Lighting',
        slug: 'automotive-lighting',
        description: 'LED headlights, interior lights, light bars, underglow kits, and lighting accessories for your vehicle.',
        image: '/images/categories/automotive-lighting.jpg',
        productCount: 8,
    },
    {
        id: 4,
        name: 'Car Care & Detailing',
        slug: 'car-care-detailing',
        description: 'Professional car care kits, detailing brushes, wash supplies, and cleaning products.',
        image: '/images/categories/car-care-detailing.jpg',
        productCount: 8,
    },
    {
        id: 5,
        name: 'Tools & Equipment',
        slug: 'tools-equipment',
        description: 'Automotive tools, diagnostic equipment, body repair kits, and professional mechanic equipment.',
        image: '/images/categories/tools-equipment.jpg',
        productCount: 8,
    },
    {
        id: 6,
        name: 'Interior Accessories',
        slug: 'interior-accessories',
        description: 'Car interior upgrades including phone mounts, organizers, seat covers, and chargers.',
        image: '/images/categories/interior-accessories.jpg',
        productCount: 8,
    },
    {
        id: 7,
        name: 'Exterior Accessories',
        slug: 'exterior-accessories',
        description: 'Car exterior upgrades including license plate frames, car covers, fender flares, and trim.',
        image: '/images/categories/exterior-accessories.jpg',
        productCount: 8,
    },
    {
        id: 8,
        name: 'Car Electronics & GPS',
        slug: 'car-electronics',
        description: 'GPS navigation systems, portable car screens, dash cams, and automotive electronics.',
        image: '/images/categories/car-electronics.jpg',
        productCount: 8,
    },
    {
        id: 9,
        name: 'Tires & Wheels',
        slug: 'tires-wheels',
        description: 'Tire valve caps, wheel brushes, tire accessories, and wheel care products.',
        image: '/images/categories/tires-wheels.jpg',
        productCount: 8,
    },
    {
        id: 10,
        name: 'Truck Accessories',
        slug: 'truck-accessories',
        description: 'Truck-specific accessories including tailgate assists, tie-down straps, floor liners, and more.',
        image: '/images/categories/truck-accessories.jpg',
        productCount: 8,
    },
    {
        id: 11,
        name: 'Performance Parts',
        slug: 'performance-parts',
        description: 'High-performance air filters, intake systems, pedal covers, and engine upgrades.',
        image: '/images/categories/performance-parts.jpg',
        productCount: 8,
    },
    {
        id: 12,
        name: 'Towing & Hitches',
        slug: 'towing-hitches',
        description: 'Trailer hitch accessories, hitch locks, tighteners, hitch steps, and towing gear.',
        image: '/images/categories/towing-hitches.jpg',
        productCount: 8,
    },
    {
        id: 13,
        name: 'Oil, Fluids & Chemicals',
        slug: 'oil-fluids-chemicals',
        description: 'Engine oil additives, transmission fluids, catalytic converter cleaners, and automotive chemicals.',
        image: '/images/categories/oil-fluids-chemicals.jpg',
        productCount: 8,
    },
    {
        id: 14,
        name: 'Body Parts & Mirrors',
        slug: 'body-parts-mirrors',
        description: 'Side view mirrors, mirror caps, blind spot mirrors, and automotive body parts.',
        image: '/images/categories/body-parts-mirrors.jpg',
        productCount: 8,
    },
    {
        id: 15,
        name: 'Safety & Emergency',
        slug: 'safety-emergency',
        description: 'Roadside emergency kits, safety equipment, jumper cables, and emergency tools.',
        image: '/images/categories/safety-emergency.jpg',
        productCount: 8,
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: number): Category | undefined {
    return categories.find((c) => c.id === id);
}
