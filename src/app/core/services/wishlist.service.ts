import { Injectable, signal, computed } from '@angular/core';
import { Product, WishlistItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private _items = signal<WishlistItem[]>(this.loadFromStorage());

  items = this._items.asReadonly();
  count = computed(() => this._items().length);

  isWishlisted(productId: number): boolean {
    return this._items().some(i => i.product.id === productId);
  }

  toggle(product: Product): void {
    if (this.isWishlisted(product.id)) {
      this._items.set(this._items().filter(i => i.product.id !== product.id));
    } else {
      this._items.set([...this._items(), { product, addedAt: new Date() }]);
    }
    this.saveToStorage();
  }

  removeFromWishlist(productId: number): void {
    this._items.set(this._items().filter(i => i.product.id !== productId));
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try { localStorage.setItem('oe_wishlist', JSON.stringify(this._items())); } catch {}
  }

  private loadFromStorage(): WishlistItem[] {
    try {
      const data = localStorage.getItem('oe_wishlist');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }
}
