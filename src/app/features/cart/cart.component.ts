import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="cart-page">
  <div class="cart-header">
    <h1>YOUR BAG</h1>
    <span class="item-count">{{ cartService.totalItems() }} item{{ cartService.totalItems() !== 1 ? 's' : '' }}</span>
  </div>

  @if (cartService.items().length === 0) {
    <div class="empty-cart">
      <div class="empty-icon">🛍️</div>
      <h2>Your bag is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <a routerLink="/shop" class="btn-primary">CONTINUE SHOPPING</a>
    </div>
  } @else {
    <div class="cart-layout">
      <div class="cart-items">
        @for (item of cartService.items(); track item.product.id + item.selectedSize) {
          <div class="cart-row">
            <img [src]="item.product.image" [alt]="item.product.title" class="row-img" />
            <div class="row-details">
              <a [routerLink]="['/product', item.product.id]" class="row-name">{{ item.product.title }}</a>
              <div class="row-meta">
                <span>{{ item.selectedSize }}</span> · <span>{{ item.selectedColor }}</span>
              </div>
              <div class="row-bottom">
                <div class="qty-ctrl">
                  <button (click)="cartService.updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="cartService.updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)">+</button>
                </div>
                <span class="row-price">₹{{ (item.product.price * item.quantity) | number:'1.0-0' }}</span>
                <button class="remove-btn" (click)="cartService.removeFromCart(item.product.id, item.selectedSize, item.selectedColor)">Remove</button>
              </div>
            </div>
          </div>
        }
      </div>
      <div class="cart-summary">
        <h3>ORDER SUMMARY</h3>
        <div class="summary-lines">
          <div class="summary-line"><span>Subtotal</span><span>₹{{ cartService.subtotal() | number:'1.0-0' }}</span></div>
          @if (cartService.savings() > 0) {
            <div class="summary-line green"><span>Savings</span><span>−₹{{ cartService.savings() | number:'1.0-0' }}</span></div>
          }
          <div class="summary-line"><span>Shipping</span><span>{{ cartService.subtotal() >= 2999 ? 'FREE' : '₹199' }}</span></div>
          <div class="summary-line total"><span>Total</span><span>₹{{ (cartService.subtotal() + (cartService.subtotal() >= 2999 ? 0 : 199)) | number:'1.0-0' }}</span></div>
        </div>
        <a routerLink="/checkout" class="btn-checkout">PROCEED TO CHECKOUT →</a>
        <a routerLink="/shop" class="btn-continue">Continue Shopping</a>
      </div>
    </div>
  }
</div>
  `,
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartService);
}
