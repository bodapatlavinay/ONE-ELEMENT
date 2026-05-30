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
