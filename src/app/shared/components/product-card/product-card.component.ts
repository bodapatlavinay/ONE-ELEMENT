import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  toastService = inject(ToastService);

  isHovered = signal(false);
  selectedSize = signal('');
  showSizeSelect = signal(false);
  hoveredColor = signal<string | null>(null);

  get cardImage(): string {
    const color = this.hoveredColor();
    if (color && this.product.colorImages?.[color]?.length) {
      return this.product.colorImages[color][0];
    }
    return this.product.image;
  }

  get hasColorImages(): boolean {
    return !!(this.product.colorImages && Object.keys(this.product.colorImages).length > 0);
  }

  getColorThumb(color: string): string {
    // Use the color-specific image if available, else fall back to main image
    return this.product.colorImages?.[color]?.[0] ?? this.product.image;
  }

  private readonly colorHexMap: Record<string, string> = {
    // Blacks
    'onyx black': '#111111', 'jet black': '#111111', 'carbon black': '#111111',
    'midnight black': '#111111', 'solid black': '#111111', 'black': '#111111',
    // Whites / Creams
    'arctic white': '#F2F2F2', 'cloud white': '#F2F2F2', 'stone white': '#D0C9C0',
    'off white': '#F0EDE6', 'ivory': '#FFFAE6', 'cream': '#F5F0E8', 'white': '#F2F2F2',
    // Greys
    'steel grey': '#8A8A8A', 'steel gray': '#8A8A8A', 'light grey': '#AAAAAA',
    'graphite': '#4A4A4A', 'charcoal': '#3C3C3C', 'ash grey': '#9A9A9A',
    'grey': '#7A7A7A', 'gray': '#7A7A7A',
    // Navies / Blues
    'midnight navy': '#1B2A4A', 'navy storm': '#243B5A', 'navy blue': '#1B2A4A',
    'navy': '#1B2A4A', 'royal blue': '#2756CC', 'slate blue': '#4A6FA5',
    'sky blue': '#5AADE0', 'cobalt': '#1A52CC', 'blue': '#1E4DB7',
    // Reds / Crimsons
    'crimson': '#C0392B', 'scarlet': '#C0392B', 'cherry red': '#B01C2E',
    'brick red': '#943126', 'maroon': '#800000', 'burgundy': '#6D1A2A', 'red': '#C0392B',
    // Pinks / Roses
    'dusty rose': '#C6857A', 'blush': '#E8A8A0', 'hot pink': '#D63384',
    'rose': '#DB7093', 'mauve': '#B07A86', 'pink': '#D63384',
    // Greens
    'forest green': '#2D6A4F', 'army green': '#4B5320', 'sage': '#7A9E7E',
    'mint': '#3EB489', 'hunter green': '#2E5933', 'olive': '#6B7A3E', 'green': '#2D5A27',
    // Oranges / Yellows
    'burnt orange': '#CC5500', 'amber': '#FFBF00', 'mustard': '#E1AD21',
    'orange': '#FF6B00', 'yellow': '#F0B429',
    // Purples
    'lavender': '#9B7BC8', 'violet': '#7F3FBF', 'plum': '#673A6F', 'purple': '#6B21A8',
    // Browns / Tans
    'tan': '#C8A882', 'camel': '#C19A6B', 'mocha': '#7B4F3A', 'brown': '#7C5230',
    'beige': '#D4C5A9', 'sand': '#C8BFB0', 'khaki': '#C3B091',
    // Teals / Cyans
    'teal': '#1A7A6E', 'turquoise': '#30D5C8', 'cyan': '#0EA5C8',
  };

  getColorHex(color: string): string {
    const lower = color.toLowerCase().trim();
    // 1. Exact match first
    if (this.colorHexMap[lower]) return this.colorHexMap[lower];
    // 2. Keyword match — longest keys first (most specific wins)
    const keys = Object.keys(this.colorHexMap).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (lower.includes(key)) return this.colorHexMap[key];
    }
    return '#555555';
  }

  onColorClick(color: string, e: Event): void {
    e.stopPropagation();
    // Toggle: tap same color again to deselect (important on mobile — no mouseleave to reset)
    this.hoveredColor.set(this.hoveredColor() === color ? null : color);
  }

  get isWishlisted(): boolean {
    return this.wishlistService.isWishlisted(this.product.id);
  }

  get discountPercent(): number {
    if (!this.product.originalPrice) return 0;
    return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
  }

  toggleWishlist(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.wishlistService.toggle(this.product);
    this.toastService.show(
      this.isWishlisted ? `${this.product.title} added to wishlist` : `Removed from wishlist`,
      'success'
    );
  }

  quickAdd(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.showSizeSelect.set(!this.showSizeSelect());
  }

  selectSizeAndAdd(size: string, e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.cartService.addToCart(this.product, size, this.product.colors[0], 1);
    this.toastService.show(`${this.product.title} (${size}) added to cart!`, 'success');
    this.showSizeSelect.set(false);
  }
}
