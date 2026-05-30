import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
<div class="wishlist-page">
  <div class="page-header">
    <h1>WISHLIST</h1>
    <span class="count">{{ wishlistService.count() }} item{{ wishlistService.count() !== 1 ? 's' : '' }} saved</span>
  </div>
  @if (wishlistService.items().length === 0) {
    <div class="empty-state">
      <div class="empty-icon">🤍</div>
      <h2>Your wishlist is empty</h2>
      <p>Save your favourites by tapping the heart icon.</p>
      <a routerLink="/shop" class="btn-primary">EXPLORE PRODUCTS</a>
    </div>
  } @else {
    <div class="wishlist-grid">
      @for (item of wishlistService.items(); track item.product.id) {
        <app-product-card [product]="item.product" />
      }
    </div>
  }
</div>
  `,
  styles: [`
    .wishlist-page { min-height: 100vh; padding: 120px 80px 80px; @media (max-width: 768px) { padding: 100px 16px 40px; } }
    .page-header { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
      h1 { font-family: var(--font-display); font-size: 48px; font-weight: 900; color: #fff; margin: 0 0 6px; }
      .count { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); letter-spacing: 0.08em; }
    }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; text-align: center; gap: 16px;
      .empty-icon { font-size: 60px; opacity: 0.5; }
      h2 { font-family: var(--font-display); font-size: 28px; color: #fff; margin: 0; }
      p { color: var(--text-muted); font-size: 15px; }
    }
    .btn-primary { display: inline-flex; background: var(--accent); color: #000; font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.12em; padding: 14px 32px; border-radius: 3px; text-decoration: none; transition: background 0.2s; &:hover { background: #fff; } }
    .wishlist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; @media (max-width: 1100px) { grid-template-columns: repeat(3, 1fr); } @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
  `]
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  toastService = inject(ToastService);
}
