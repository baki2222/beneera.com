import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import existing mock data
import { products } from '../src/data/products';
import { categories } from '../src/data/categories';
import { orders } from '../src/data/admin/orders';
import { customers } from '../src/data/admin/customers';
import { inquiries } from '../src/data/admin/inquiries';
import { coupons } from '../src/data/admin/coupons';
import { adminPages } from '../src/data/admin/pages';

async function main() {
  console.log('🌱 Seeding Beneera database...\n');

  // ── Categories ──
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        productCount: cat.productCount,
      },
    });
  }
  console.log(`   ✓ ${categories.length} categories\n`);

  // ── Products ──
  console.log('📦 Seeding products...');
  for (const p of products) {
    const cat = await prisma.category.findFirst({
      where: { name: p.category },
    });

    // Map stockStatus to numeric stock
    const stockMap: Record<string, number> = {
      in_stock: 50,
      low_stock: 5,
      out_of_stock: 0,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle || '',
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice || 0,
        description: p.fullDescription || '',
        shortDescription: p.shortDescription || '',
        images: p.images || [],
        badges: p.badges || [],
        features: p.features || [],
        specifications: p.specifications as any || {},
        stock: stockMap[p.stockStatus] ?? 50,
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 150) + 10,
        published: true,
        seoTitle: p.seoTitle || '',
        metaDescription: p.metaDescription || '',
        categoryId: cat?.id || null,
      },
    });
  }
  console.log(`   ✓ ${products.length} products\n`);

  // ── Customers ──
  console.log('👥 Seeding customers...');
  for (const c of customers) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        orderCount: c.orderCount,
        totalSpent: c.totalSpent,
        tags: c.tags,
        notes: c.notes || '',
        addresses: c.addresses as any,
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log(`   ✓ ${customers.length} customers\n`);

  // ── Orders ──
  console.log('🛒 Seeding orders...');
  for (const o of orders) {
    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: {
        id: o.id,
        orderNumber: o.orderNumber,
        customerId: o.customerId || null,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        fulfillmentStatus: o.fulfillmentStatus,
        paymentStatus: o.paymentStatus,
        subtotal: o.subtotal,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total,
        notes: o.notes || '',
        shippingAddress: o.shippingAddress as any,
        createdAt: new Date(o.createdAt),
        items: {
          create: o.items.map((item: any) => ({
            title: item.title,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '',
          })),
        },
      },
    });
  }
  console.log(`   ✓ ${orders.length} orders\n`);

  // ── Inquiries ──
  console.log('💬 Seeding inquiries...');
  for (const inq of inquiries) {
    await prisma.inquiry.upsert({
      where: { id: inq.id },
      update: {},
      create: {
        id: inq.id,
        name: inq.name,
        email: inq.email,
        subject: inq.subject,
        message: inq.message,
        type: inq.type,
        status: inq.status,
        notes: inq.notes || '',
        createdAt: new Date(inq.createdAt),
      },
    });
  }
  console.log(`   ✓ ${inquiries.length} inquiries\n`);

  // ── Coupons ──
  console.log('🎟️ Seeding coupons...');
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minCartAmount: c.minCartAmount,
        expiryDate: c.expiryDate,
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
        active: c.active,
      },
    });
  }
  console.log(`   ✓ ${coupons.length} coupons\n`);

  // ── Admin Users ──
  console.log('🔐 Seeding admin users...');
  const defaultUsers = [
    { id: 'usr_001', name: 'Beneera Admin', email: 'admin@beneera.com', password: 'admin123', role: 'owner', active: true, lastLogin: new Date('2026-03-12T20:00:00Z') },
    { id: 'usr_002', name: 'Support Team', email: 'support@beneera.com', password: 'admin123', role: 'admin', active: true, lastLogin: new Date('2026-03-12T15:30:00Z') },
  ];
  for (const u of defaultUsers) {
    await prisma.adminUser.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log(`   ✓ ${defaultUsers.length} admin users\n`);

  // ── Pages ──
  console.log('📄 Seeding pages...');
  for (const p of adminPages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        content: p.content,
        seoTitle: p.seoTitle || '',
        metaDescription: p.metaDescription || '',
        status: p.status,
        updatedAt: new Date(p.updatedAt),
      },
    });
  }
  console.log(`   ✓ ${adminPages.length} pages\n`);

  // ── Content Blocks ──
  console.log('📝 Seeding content blocks...');
  const contentBlocks = [
    { section: 'Hero', label: 'Hero Title', type: 'text', value: 'Your One-Stop Shop for Automotive Parts & Accessories' },
    { section: 'Hero', label: 'Hero Subtitle', type: 'textarea', value: 'Shop premium replacement parts, car accessories, truck parts, and more — all at competitive prices.' },
    { section: 'Hero', label: 'Hero CTA Text', type: 'text', value: 'Shop Now' },
    { section: 'Hero', label: 'Hero CTA Link', type: 'text', value: '/shop' },
    { section: 'Announcement', label: 'Announcement Bar Text', type: 'text', value: '🚚 Free Shipping on Orders Over $49!' },
    { section: 'Announcement', label: 'Active', type: 'text', value: 'true' },
    { section: 'Footer', label: 'Support Email', type: 'text', value: 'support@beneera.com' },
    { section: 'Footer', label: 'Phone', type: 'text', value: '+1 (307) 278-4868' },
    { section: 'Footer', label: 'Address', type: 'text', value: '30 N Gould St # 44190, Sheridan, WY 82801' },
    { section: 'Newsletter', label: 'Newsletter Heading', type: 'text', value: 'Stay in the Loop' },
    { section: 'Newsletter', label: 'Newsletter Description', type: 'textarea', value: 'Subscribe for new product updates, exclusive offers, and helpful automotive tips.' },
  ];
  // Clear existing content blocks first
  await prisma.contentBlock.deleteMany();
  for (const cb of contentBlocks) {
    await prisma.contentBlock.create({ data: cb });
  }
  console.log(`   ✓ ${contentBlocks.length} content blocks\n`);

  // ── Settings ──
  console.log('⚙️ Seeding settings...');
  const settings = [
    { key: 'store_name', value: 'Beneera' },
    { key: 'tagline', value: 'Your One-Stop Shop for Automotive Parts & Accessories' },
    { key: 'currency', value: 'USD' },
    { key: 'tax_rate', value: '8' },
    { key: 'free_shipping_threshold', value: '49' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`   ✓ ${settings.length} settings\n`);

  console.log('✅ Beneera database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
