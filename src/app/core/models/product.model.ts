export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  rating: Rating;
  stock: number;
  badge?: 'NEW' | 'SALE' | 'BESTSELLER' | 'LIMITED';
  sizes: string[];
  colors: string[];
  gender: 'Men' | 'Women' | 'Unisex';
  tags: string[];
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
