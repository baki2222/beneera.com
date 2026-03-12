// ── Admin Panel Types ──

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: Address;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  addresses: Address[];
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  type: 'contact' | 'product' | 'support' | 'wholesale';
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'open' | 'replied' | 'closed';
  notes: string;
  productSlug?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'staff';
  avatar?: string;
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface ContentBlock {
  id: string;
  section: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
  active: boolean;
}

export interface AdminPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  altText: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  dailySales: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  topCategories: { name: string; sold: number; revenue: number }[];
  recentActivity: { id: string; action: string; detail: string; time: string }[];
}

export type AdminSession = {
  user: AdminUser;
  loggedInAt: string;
} | null;
