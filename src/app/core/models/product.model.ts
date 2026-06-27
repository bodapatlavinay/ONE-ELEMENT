export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  colorImages?: Record<string, string[]>;  // color → image URLs for variant image switching
  rating: Rating;
  stock: number;
  badge?: 'NEW' | 'SALE' | 'BESTSELLER' | 'LIMITED';
  sizes: string[];
  colors: string[];
  gender: 'Men' | 'Women' | 'Unisex';
  tags: string[];
  variantId?: string;                    // Shopify variant GID for the first/default variant
  variantMap?: Record<string, string>;   // size → Shopify variant GID for checkout
  shopifyId?: string;                    // Full Shopify product GID
}

export interface Rating {
  rate: number;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantId?: string;   // Shopify variant GID for this size/color combination
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface FilterState {
  category: string;
  gender: string;
  priceMin: number;
  priceMax: number;
  sortBy: string;
  search: string;
}

export interface Review {
  id?: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SavedAddress {
  id?: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
