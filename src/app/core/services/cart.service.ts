import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());
  private _isOpen = signal(false);

  items = this._items.asReadonly();
  isOpen = this._isOpen.asReadonly();

  totalItems = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  subtotal = computed(() => this._items().reduce((sum, i) => sum + (i.product.price * i.quantity), 0));
  savings = computed(() => this._items().reduce((sum, i) => {
    const orig = i.product.originalPrice || i.product.price;
    return sum + ((orig - i.product.price) * i.quantity);
  }, 0));

  addToCart(product: Product, size: string, color: string, qty = 1): void {
    // Resolve the correct Shopify variant ID for the selected size
    const variantId = product.variantMap?.[size] ?? product.variantId;

    const current = this._items();
    const idx = current.findIndex(i =>
      i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
    );
    if (idx > -1) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
      this._items.set(updated);
    } else {
      this._items.set([...current, { product, quantity: qty, selectedSize: size, selectedColor: color, variantId }]);
    }
    this.saveToStorage();
    this.openCart();
  }

  removeFromCart(productId: number, size: string, color: string): void {
    this._items.set(this._items().filter(i =>
      !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)
    ));
    this.saveToStorage();
  }

  updateQuantity(productId: number, size: string, color: string, qty: number): void {
    if (qty <= 0) { this.removeFromCart(productId, size, color); return; }
    const updated = this._items().map(i =>
      i.product.id === productId && i.selectedSize === size && i.selectedColor === color
        ? { ...i, quantity: qty } : i
    );
    this._items.set(updated);
    this.saveToStorage();
  }

  clearCart(): void {
    this._items.set([]);
    localStorage.removeItem('oe_cart');
  }

  openCart(): void { this._isOpen.set(true); }
  closeCart(): void { this._isOpen.set(false); }
  toggleCart(): void { this._isOpen.set(!this._isOpen()); }

  private saveToStorage(): void {
    try { localStorage.setItem('oe_cart', JSON.stringify(this._items())); } catch {}
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem('oe_cart');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }
}
