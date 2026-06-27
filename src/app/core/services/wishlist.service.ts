import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Product, WishlistItem } from '../models/product.model';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private productService = inject(ProductService);

  private _items = signal<WishlistItem[]>(this.loadFromStorage());
  private _syncing = signal(false);

  items = this._items.asReadonly();
  count = computed(() => this._items().length);
  syncing = this._syncing.asReadonly();

  constructor() {
    // When auth state changes, sync wishlist with Firestore
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.syncFromCloud();
      } else {
        // Logged out — keep only localStorage copy
        this._items.set(this.loadFromStorage());
      }
    });
  }

  private async syncFromCloud(): Promise<void> {
    this._syncing.set(true);
    try {
      const cloudIds = await this.firestoreService.loadWishlistIds();
      if (!cloudIds.length) {
        // Nothing in cloud — push local items up if any
        const local = this._items();
        if (local.length) await this.firestoreService.saveWishlist(local);
        this._syncing.set(false);
        return;
      }

      // Hydrate cloud IDs with actual product data
      this.productService.getAllProducts().subscribe(products => {
        const hydrated: WishlistItem[] = cloudIds
          .map(c => {
            const product = products.find(p => p.id === c.productId);
            return product ? { product, addedAt: c.addedAt } : null;
          })
          .filter((i): i is WishlistItem => i !== null);

        // Merge: cloud takes precedence; add local-only items that aren't in cloud
        const cloudProductIds = new Set(hydrated.map(i => i.product.id));
        const localOnly = this._items().filter(i => !cloudProductIds.has(i.product.id));
        const merged = [...hydrated, ...localOnly];

        this._items.set(merged);
        this.saveToStorage();
        if (localOnly.length) {
          // Push merged list back to cloud
          this.firestoreService.saveWishlist(merged).catch(() => {});
        }
        this._syncing.set(false);
      });
    } catch {
      this._syncing.set(false);
    }
  }

  isWishlisted(productId: number): boolean {
    return this._items().some(i => i.product.id === productId);
  }

  toggle(product: Product): void {
    if (this.isWishlisted(product.id)) {
      this._items.set(this._items().filter(i => i.product.id !== product.id));
    } else {
      this._items.set([...this._items(), { product, addedAt: new Date() }]);
    }
    this.persist();
  }

  removeFromWishlist(productId: number): void {
    this._items.set(this._items().filter(i => i.product.id !== productId));
    this.persist();
  }

  private persist(): void {
    this.saveToStorage();
    if (this.authService.user()) {
      this.firestoreService.saveWishlist(this._items()).catch(() => {});
    }
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
