import { Injectable } from '@angular/core';
import { getAnalytics, Analytics, logEvent, isSupported } from 'firebase/analytics';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private analytics: Analytics | null = null;

  constructor() {
    isSupported().then(yes => {
      if (yes) this.analytics = getAnalytics();
    }).catch(() => {});
  }

  private log(name: string, params?: Record<string, any>): void {
    if (!this.analytics) return;
    try { logEvent(this.analytics, name, params); } catch {}
  }

  trackViewProduct(id: number, name: string, price: number): void {
    this.log('view_item', { item_id: id, item_name: name, value: price, currency: 'INR' });
  }

  trackAddToCart(id: number, name: string, price: number, qty = 1): void {
    this.log('add_to_cart', { item_id: id, item_name: name, value: price * qty, currency: 'INR', quantity: qty });
  }

  trackAddToWishlist(id: number, name: string): void {
    this.log('add_to_wishlist', { item_id: id, item_name: name });
  }

  trackRemoveFromWishlist(id: number, name: string): void {
    this.log('remove_from_wishlist', { item_id: id, item_name: name });
  }

  trackBeginCheckout(value: number, numItems: number): void {
    this.log('begin_checkout', { value, currency: 'INR', num_items: numItems });
  }

  trackSearch(term: string): void {
    this.log('search', { search_term: term });
  }

  trackLogin(method: string): void {
    this.log('login', { method });
  }

  trackSignUp(method: string): void {
    this.log('sign_up', { method });
  }

  trackApplyCoupon(code: string): void {
    this.log('apply_coupon', { coupon: code });
  }

  trackViewReviews(productId: number): void {
    this.log('view_reviews', { item_id: productId });
  }

  trackSubmitReview(productId: number, rating: number): void {
    this.log('submit_review', { item_id: productId, rating });
  }
}
