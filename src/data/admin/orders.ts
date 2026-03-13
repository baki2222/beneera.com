import { Order } from '@/lib/admin-types';

export const orders: Order[] = [
  {
    id: 'ord_001', orderNumber: 'TA-10001', customerId: 'cust_001', customerName: 'Sarah Johnson', customerEmail: 'sarah.j@email.com',
    items: [
      { productId: 1, title: 'Premium Chicken Dry Dog Food', sku: 'TA-DF-001', quantity: 2, price: 42.99, image: '/images/products/premium-dry-dog-food-chicken-1.jpg' },
      { productId: 4, title: 'Daily Dental Chew Sticks', sku: 'TA-DF-004', quantity: 1, price: 18.99, image: '/images/products/dental-chew-sticks-dog-1.jpg' },
    ],
    subtotal: 104.97, shipping: 0, tax: 8.40, total: 113.37,
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    shippingAddress: { name: 'Sarah Johnson', street: '123 Oak Lane', city: 'Portland', state: 'OR', zip: '97201', country: 'US' },
    notes: '', createdAt: '2026-03-08T14:22:00Z', updatedAt: '2026-03-09T09:15:00Z',
  },
  {
    id: 'ord_002', orderNumber: 'TA-10002', customerId: 'cust_002', customerName: 'Michael Chen', customerEmail: 'mchen@email.com',
    items: [
      { productId: 21, title: 'Interactive Puzzle Ball', sku: 'TA-PT-001', quantity: 1, price: 16.99, image: '/images/products/interactive-puzzle-ball-1.jpg' },
      { productId: 23, title: 'Catnip Mice Toy Pack', sku: 'TA-PT-003', quantity: 2, price: 12.99, image: '/images/products/catnip-mice-toys-pack-1.jpg' },
    ],
    subtotal: 42.97, shipping: 5.99, tax: 3.44, total: 52.40,
    paymentStatus: 'paid', fulfillmentStatus: 'shipped',
    shippingAddress: { name: 'Michael Chen', street: '456 Elm Street', city: 'San Francisco', state: 'CA', zip: '94102', country: 'US' },
    notes: 'Gift wrap requested', createdAt: '2026-03-09T10:05:00Z', updatedAt: '2026-03-10T08:30:00Z',
  },
  {
    id: 'ord_003', orderNumber: 'TA-10003', customerId: 'cust_003', customerName: 'Emily Rodriguez', customerEmail: 'emily.r@email.com',
    items: [
      { productId: 31, title: 'Orthopedic Memory Foam Dog Bed', sku: 'TA-PB-001', quantity: 1, price: 79.99, image: '/images/products/orthopedic-memory-foam-dog-bed-1.jpg' },
    ],
    subtotal: 79.99, shipping: 0, tax: 6.40, total: 86.39,
    paymentStatus: 'paid', fulfillmentStatus: 'processing',
    shippingAddress: { name: 'Emily Rodriguez', street: '789 Pine Ave', city: 'Austin', state: 'TX', zip: '73301', country: 'US' },
    notes: '', createdAt: '2026-03-10T16:45:00Z', updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: 'ord_004', orderNumber: 'TA-10004', customerId: 'cust_004', customerName: 'David Kim', customerEmail: 'dkim@email.com',
    items: [
      { productId: 41, title: 'Professional Deshedding Tool', sku: 'TA-PG-001', quantity: 1, price: 29.99, image: '/images/products/professional-deshedding-tool-1.jpg' },
      { productId: 43, title: 'Nail Grinder Pro', sku: 'TA-PG-003', quantity: 1, price: 24.99, image: '/images/products/nail-grinder-pro-1.jpg' },
    ],
    subtotal: 54.98, shipping: 0, tax: 4.40, total: 59.38,
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    shippingAddress: { name: 'David Kim', street: '321 Maple Dr', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
    notes: '', createdAt: '2026-03-07T11:20:00Z', updatedAt: '2026-03-09T14:00:00Z',
  },
  {
    id: 'ord_005', orderNumber: 'TA-10005', customerId: 'cust_005', customerName: 'Jessica Martinez', customerEmail: 'jmartinez@email.com',
    items: [
      { productId: 51, title: 'Multivitamin Daily Chews', sku: 'TA-PH-001', quantity: 2, price: 28.99, image: '/images/products/multivitamin-daily-chews-1.jpg' },
      { productId: 52, title: 'Calming Hemp Treats', sku: 'TA-PH-002', quantity: 1, price: 22.99, image: '/images/products/calming-hemp-treats-1.jpg' },
    ],
    subtotal: 80.97, shipping: 0, tax: 6.48, total: 87.45,
    paymentStatus: 'pending', fulfillmentStatus: 'pending',
    shippingAddress: { name: 'Jessica Martinez', street: '654 Cedar Blvd', city: 'Denver', state: 'CO', zip: '80201', country: 'US' },
    notes: '', createdAt: '2026-03-11T09:00:00Z', updatedAt: '2026-03-11T09:00:00Z',
  },
  {
    id: 'ord_006', orderNumber: 'TA-10006', customerId: 'cust_006', customerName: 'James Wilson', customerEmail: 'jwilson@email.com',
    items: [
      { productId: 61, title: 'Reflective No-Pull Harness', sku: 'TA-CL-001', quantity: 1, price: 34.99, image: '/images/products/reflective-no-pull-harness-1.jpg' },
      { productId: 63, title: 'Leather Padded Dog Collar', sku: 'TA-CL-003', quantity: 1, price: 27.99, image: '/images/products/leather-padded-dog-collar-1.jpg' },
    ],
    subtotal: 62.98, shipping: 0, tax: 5.04, total: 68.02,
    paymentStatus: 'paid', fulfillmentStatus: 'shipped',
    shippingAddress: { name: 'James Wilson', street: '987 Birch Rd', city: 'Nashville', state: 'TN', zip: '37201', country: 'US' },
    notes: 'Expedited shipping requested', createdAt: '2026-03-09T15:30:00Z', updatedAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'ord_007', orderNumber: 'TA-10007', customerId: 'cust_007', customerName: 'Amanda Lee', customerEmail: 'alee@email.com',
    items: [
      { productId: 71, title: 'Heavy Duty Tow Strap', sku: 'TA-TO-001', quantity: 1, price: 54.99, image: '/images/products/heavy-duty-tow-strap-1.jpg' },
    ],
    subtotal: 54.99, shipping: 0, tax: 4.40, total: 59.39,
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    shippingAddress: { name: 'Amanda Lee', street: '147 Willow St', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
    notes: '', createdAt: '2026-03-06T08:15:00Z', updatedAt: '2026-03-08T16:45:00Z',
  },
  {
    id: 'ord_008', orderNumber: 'TA-10008', customerId: 'cust_008', customerName: 'Robert Taylor', customerEmail: 'rtaylor@email.com',
    items: [
      { productId: 81, title: 'Heavy Duty Floor Mats', sku: 'TA-FB-001', quantity: 1, price: 39.99, image: '/images/products/heavy-duty-floor-mats-1.jpg' },
      { productId: 83, title: 'Slow-Feed Puzzle Bowl', sku: 'TA-FB-003', quantity: 1, price: 18.99, image: '/images/products/slow-feed-puzzle-bowl-1.jpg' },
    ],
    subtotal: 58.98, shipping: 0, tax: 4.72, total: 63.70,
    paymentStatus: 'paid', fulfillmentStatus: 'processing',
    shippingAddress: { name: 'Robert Taylor', street: '258 Spruce Ln', city: 'Boston', state: 'MA', zip: '02101', country: 'US' },
    notes: '', createdAt: '2026-03-10T22:10:00Z', updatedAt: '2026-03-11T07:00:00Z',
  },
  {
    id: 'ord_009', orderNumber: 'TA-10009', customerId: 'cust_009', customerName: 'Lisa Brown', customerEmail: 'lbrown@email.com',
    items: [
      { productId: 91, title: '10-Gallon LED Aquarium Kit', sku: 'TA-AF-001', quantity: 1, price: 89.99, image: '/images/products/10-gallon-led-aquarium-kit-1.jpg' },
      { productId: 94, title: 'Tropical Fish Flake Food', sku: 'TA-AF-004', quantity: 2, price: 8.99, image: '/images/products/tropical-fish-flake-food-1.jpg' },
    ],
    subtotal: 107.97, shipping: 0, tax: 8.64, total: 116.61,
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    shippingAddress: { name: 'Lisa Brown', street: '369 Aspen Way', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'US' },
    notes: '', createdAt: '2026-03-05T12:00:00Z', updatedAt: '2026-03-07T18:30:00Z',
  },
  {
    id: 'ord_010', orderNumber: 'TA-10010', customerId: 'cust_010', customerName: 'Thomas Anderson', customerEmail: 'tanderson@email.com',
    items: [
      { productId: 2, title: 'Grain-Free Salmon Wet Food', sku: 'TA-DF-002', quantity: 6, price: 3.49, image: '/images/products/grain-free-salmon-wet-food-1.jpg' },
    ],
    subtotal: 20.94, shipping: 5.99, tax: 1.68, total: 28.61,
    paymentStatus: 'refunded', fulfillmentStatus: 'refunded',
    shippingAddress: { name: 'Thomas Anderson', street: '741 Oak Park Dr', city: 'Minneapolis', state: 'MN', zip: '55401', country: 'US' },
    notes: 'Customer received wrong item. Full refund issued.', createdAt: '2026-03-04T09:30:00Z', updatedAt: '2026-03-06T11:15:00Z',
  },
  {
    id: 'ord_011', orderNumber: 'TA-10011', customerId: 'cust_011', customerName: 'Sophia Nguyen', customerEmail: 'snguyen@email.com',
    items: [
      { productId: 11, title: 'Premium Clumping Cat Litter', sku: 'TA-CS-001', quantity: 2, price: 22.99, image: '/images/products/premium-clumping-cat-litter-1.jpg' },
      { productId: 15, title: 'Cat Window Perch', sku: 'TA-CS-005', quantity: 1, price: 29.99, image: '/images/products/cat-window-perch-1.jpg' },
    ],
    subtotal: 75.97, shipping: 0, tax: 6.08, total: 82.05,
    paymentStatus: 'paid', fulfillmentStatus: 'shipped',
    shippingAddress: { name: 'Sophia Nguyen', street: '852 Redwood Ct', city: 'San Diego', state: 'CA', zip: '92101', country: 'US' },
    notes: '', createdAt: '2026-03-10T13:20:00Z', updatedAt: '2026-03-11T08:45:00Z',
  },
  {
    id: 'ord_012', orderNumber: 'TA-10012', customerId: 'cust_012', customerName: 'Daniel Harris', customerEmail: 'dharris@email.com',
    items: [
      { productId: 33, title: 'Cat Tree Tower', sku: 'TA-PB-003', quantity: 1, price: 89.99, image: '/images/products/cat-tree-tower-1.jpg' },
    ],
    subtotal: 89.99, shipping: 0, tax: 7.20, total: 97.19,
    paymentStatus: 'paid', fulfillmentStatus: 'pending',
    shippingAddress: { name: 'Daniel Harris', street: '963 Cherry Ave', city: 'Philadelphia', state: 'PA', zip: '19101', country: 'US' },
    notes: '', createdAt: '2026-03-11T14:00:00Z', updatedAt: '2026-03-11T14:00:00Z',
  },
  {
    id: 'ord_013', orderNumber: 'TA-10013', customerId: 'cust_013', customerName: 'Olivia Scott', customerEmail: 'oscott@email.com',
    items: [
      { productId: 26, title: 'Automatic Laser Cat Toy', sku: 'TA-PT-006', quantity: 1, price: 24.99, image: '/images/products/automatic-laser-cat-toy-1.jpg' },
      { productId: 28, title: 'Squeaky Plush Dog Toy Set', sku: 'TA-PT-008', quantity: 1, price: 19.99, image: '/images/products/squeaky-plush-dog-toy-set-1.jpg' },
    ],
    subtotal: 44.98, shipping: 5.99, tax: 3.60, total: 54.57,
    paymentStatus: 'paid', fulfillmentStatus: 'delivered',
    shippingAddress: { name: 'Olivia Scott', street: '159 Magnolia Blvd', city: 'Atlanta', state: 'GA', zip: '30301', country: 'US' },
    notes: '', createdAt: '2026-03-03T07:45:00Z', updatedAt: '2026-03-05T15:20:00Z',
  },
  {
    id: 'ord_014', orderNumber: 'TA-10014', customerId: 'cust_014', customerName: 'William Davis', customerEmail: 'wdavis@email.com',
    items: [
      { productId: 45, title: 'Hypoallergenic Dog Shampoo', sku: 'TA-PG-005', quantity: 3, price: 14.99, image: '/images/products/hypoallergenic-dog-shampoo-1.jpg' },
    ],
    subtotal: 44.97, shipping: 5.99, tax: 3.60, total: 54.56,
    paymentStatus: 'failed', fulfillmentStatus: 'cancelled',
    shippingAddress: { name: 'William Davis', street: '267 Palm St', city: 'Miami', state: 'FL', zip: '33101', country: 'US' },
    notes: 'Payment declined. Order auto-cancelled.', createdAt: '2026-03-11T11:30:00Z', updatedAt: '2026-03-11T11:35:00Z',
  },
  {
    id: 'ord_015', orderNumber: 'TA-10015', customerId: 'cust_001', customerName: 'Sarah Johnson', customerEmail: 'sarah.j@email.com',
    items: [
      { productId: 7, title: 'Pumpkin & Turkey Soft Treats', sku: 'TA-DF-007', quantity: 2, price: 11.99, image: '/images/products/pumpkin-turkey-soft-treats-1.jpg' },
      { productId: 8, title: 'Joint Support Treats', sku: 'TA-DF-008', quantity: 1, price: 26.99, image: '/images/products/joint-support-treats-1.jpg' },
    ],
    subtotal: 50.97, shipping: 0, tax: 4.08, total: 55.05,
    paymentStatus: 'paid', fulfillmentStatus: 'processing',
    shippingAddress: { name: 'Sarah Johnson', street: '123 Oak Lane', city: 'Portland', state: 'OR', zip: '97201', country: 'US' },
    notes: '', createdAt: '2026-03-11T16:00:00Z', updatedAt: '2026-03-11T16:00:00Z',
  },
];

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersByStatus(status: string): Order[] {
  if (status === 'all') return orders;
  return orders.filter((o) => o.fulfillmentStatus === status);
}
