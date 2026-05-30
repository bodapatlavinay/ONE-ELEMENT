import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  toastService = inject(ToastService);
  router = inject(Router);

  step = signal<1 | 2 | 3>(1);
  isPlacing = signal(false);
  orderPlaced = signal(false);
  orderId = signal('');

  form = {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    paymentMethod: 'upi'
  };

  states = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

  get shipping(): number { return this.cartService.subtotal() >= 2999 ? 0 : 199; }
  get total(): number { return this.cartService.subtotal() + this.shipping; }

  nextStep(): void { if (this.step() < 3) this.step.set((this.step() + 1) as 1|2|3); }
  prevStep(): void { if (this.step() > 1) this.step.set((this.step() - 1) as 1|2|3); }

  placeOrder(): void {
    this.isPlacing.set(true);
    setTimeout(() => {
      this.orderId.set('OE' + Date.now().toString().slice(-8));
      this.orderPlaced.set(true);
      this.cartService.clearCart();
      this.isPlacing.set(false);
    }, 2000);
  }
}
