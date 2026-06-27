import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ShopifyService } from '../../core/services/shopify.service';
import { AuthService } from '../../core/services/auth.service';

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
  shopifyService = inject(ShopifyService);
  authService = inject(AuthService);
  router = inject(Router);

  step = signal<1 | 2 | 3>(1);
  isPlacing = signal(false);
  orderPlaced = signal(false);
  orderId = signal('');
  checkoutError = signal('');

  form = (() => {
    const user = this.authService.user();
    const displayName = user?.displayName ?? '';
    const nameParts = displayName.trim().split(' ');
    return {
      firstName: nameParts[0] ?? '',
      lastName: nameParts.slice(1).join(' ') ?? '',
      email: user?.email ?? '',
      phone: user?.phoneNumber ?? '',
      address: '', city: '', state: '', pincode: '',
      paymentMethod: 'upi'
    };
  })();

  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  get shipping(): number { return this.cartService.subtotal() >= 2999 ? 0 : 199; }
  get total(): number { return this.cartService.subtotal() + this.shipping; }

  nextStep(): void { if (this.step() < 3) this.step.set((this.step() + 1) as 1 | 2 | 3); }
  prevStep(): void { if (this.step() > 1) this.step.set((this.step() - 1) as 1 | 2 | 3); }

  placeOrder(): void {
    this.checkoutError.set('');

    // Build line items — only include items that have a Shopify variantId
    const items = this.cartService.items()
      .filter(i => !!i.variantId)
      .map(i => ({ variantId: i.variantId!, quantity: i.quantity }));

    if (items.length === 0) {
      // No Shopify variant IDs (store using local fallback data) — show a friendly error
      this.checkoutError.set('Checkout is only available for products linked to the live Shopify store. Please ensure your Shopify store has published products.');
      return;
    }

    this.isPlacing.set(true);

    this.shopifyService.createCheckout(items, {
      email: this.form.email,
      phone: this.form.phone,
      address1: this.form.address,
      city: this.form.city,
      province: this.form.state,
      zip: this.form.pincode,
      countryCode: 'IN'
    }).subscribe(checkoutUrl => {
      this.isPlacing.set(false);
      if (checkoutUrl) {
        // Redirect to Shopify's hosted checkout (handles payment, order confirmation, emails)
        window.location.href = checkoutUrl;
      } else {
        this.checkoutError.set('Could not create checkout. Please try again.');
      }
    });
  }
}
