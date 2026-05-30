import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  cartService = inject(CartService);

  get shipping(): number {
    return this.cartService.subtotal() >= 2999 ? 0 : 199;
  }

  get total(): number {
    return this.cartService.subtotal() + this.shipping;
  }
}
