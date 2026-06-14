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

  private readonly colorHexMap: Record<string, string> = {
    'onyx black': '#111111', 'black': '#111111',
    'stone white': '#C8BFB0', 'white': '#F2F2F2', 'off white': '#F0EDE6',
    'navy': '#1B2A4A', 'navy blue': '#1B2A4A',
    'red': '#C0392B', 'crimson': '#C0392B', 'maroon': '#800000',
    'grey': '#7A7A7A', 'gray': '#7A7A7A', 'charcoal': '#3C3C3C',
    'green': '#2D5A27', 'olive': '#6B7A3E', 'forest green': '#2D6A4F',
    'blue': '#1E4DB7', 'royal blue': '#2756CC', 'slate blue': '#4A6FA5',
    'orange': '#FF6B00', 'yellow': '#F0B429', 'pink': '#D63384',
    'purple': '#6B21A8', 'brown': '#7C5230', 'beige': '#D4C5A9',
    'sand': '#C8BFB0', 'khaki': '#C3B091', 'teal': '#1A7A6E',
  };

  getColorHex(color: string): string {
    return this.colorHexMap[color.toLowerCase()] ?? '#555555';
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
