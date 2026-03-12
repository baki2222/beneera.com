export interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  sku: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAtPrice: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specifications: Record<string, string>;
  shippingNote: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  badges: string[];
  images: string[];
  seoTitle: string;
  metaDescription: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    full: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  navigation: NavItem[];
  footerLinks: {
    shop: NavItem[];
    customerService: NavItem[];
    legal: NavItem[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
