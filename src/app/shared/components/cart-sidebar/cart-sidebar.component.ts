import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ShopifyService } from '../../../core/services/shopify.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  shopifyService = inject(ShopifyService);

  isCheckingOut = signal(false);

  get shipping(): number {
    return this.cartService.subtotal() >= 2999 ? 0 : 199;
  }

  get total(): number {
    return this.cartService.subtotal() + this.shipping;
  }

  proceedToCheckout(): void {
    const items = this.cartService.items()
      .filter(i => !!i.variantId)
      .map(i => ({ variantId: i.variantId!, quantity: i.quantity }));

    if (items.length === 0) {
      // No Shopify variant IDs — fallback to custom checkout page
      window.location.href = '/checkout';
      return;
    }

    this.isCheckingOut.set(true);
    this.shopifyService.createCheckout(items).subscribe(url => {
      this.isCheckingOut.set(false);
      if (url) {
        window.location.href = url;
      } else {
        window.location.href = '/checkout';
      }
    });
  }
}
