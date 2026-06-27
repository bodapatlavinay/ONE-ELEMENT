import { Injectable, inject } from '@angular/core';
import {
  getFirestore, Firestore,
  doc, setDoc, getDoc, deleteDoc,
  collection, getDocs, addDoc,
  query, where, orderBy,
  updateDoc, Timestamp
} from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Review, SavedAddress, WishlistItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private db: Firestore;
  private authService = inject(AuthService);

  constructor() {
    this.db = getFirestore();
  }

  private get uid(): string | null {
    return this.authService.user()?.uid ?? null;
  }

  // ── Wishlist ─────────────────────────────────────────────────

  async saveWishlist(items: WishlistItem[]): Promise<void> {
    const uid = this.uid;
    if (!uid) return;
    const ref = doc(this.db, 'users', uid, 'wishlist', 'items');
    // Store only product IDs + addedAt to stay lean; product data is fetched from Shopify
    const payload = items.map(i => ({ productId: i.product.id, addedAt: i.addedAt }));
    await setDoc(ref, { items: JSON.stringify(payload), updatedAt: Timestamp.now() });
  }

  /** Returns raw {productId, addedAt} pairs — caller must hydrate with product data */
  async loadWishlistIds(): Promise<{ productId: number; addedAt: Date }[]> {
    const uid = this.uid;
    if (!uid) return [];
    const ref = doc(this.db, 'users', uid, 'wishlist', 'items');
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    try {
      const raw: { productId: number; addedAt: string }[] = JSON.parse(snap.data()['items'] ?? '[]');
      return raw.map(r => ({ productId: r.productId, addedAt: new Date(r.addedAt) }));
    } catch { return []; }
  }

  // ── Reviews ──────────────────────────────────────────────────

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    const ref = collection(this.db, 'reviews');
    await addDoc(ref, { ...review, createdAt: Timestamp.now() });
  }

  async getReviews(productId: number): Promise<Review[]> {
    const q = query(
      collection(this.db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as any),
      createdAt: (d.data()['createdAt'] as Timestamp).toDate()
    } as Review));
  }

  async hasUserReviewed(productId: number): Promise<boolean> {
    const uid = this.uid;
    if (!uid) return false;
    const q = query(
      collection(this.db, 'reviews'),
      where('productId', '==', productId),
      where('userId', '==', uid)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }

  // ── Saved Addresses ──────────────────────────────────────────

  async getAddresses(): Promise<SavedAddress[]> {
    const uid = this.uid;
    if (!uid) return [];
    const ref = collection(this.db, 'users', uid, 'addresses');
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedAddress));
  }

  async saveAddress(address: Omit<SavedAddress, 'id'>): Promise<string> {
    const uid = this.uid;
    if (!uid) throw new Error('Not authenticated');
    const ref = collection(this.db, 'users', uid, 'addresses');
    const docRef = await addDoc(ref, address);
    return docRef.id;
  }

  async updateAddress(addressId: string, data: Partial<SavedAddress>): Promise<void> {
    const uid = this.uid;
    if (!uid) return;
    await updateDoc(doc(this.db, 'users', uid, 'addresses', addressId), data as any);
  }

  async deleteAddress(addressId: string): Promise<void> {
    const uid = this.uid;
    if (!uid) return;
    await deleteDoc(doc(this.db, 'users', uid, 'addresses', addressId));
  }

  async setDefaultAddress(addressId: string): Promise<void> {
    const uid = this.uid;
    if (!uid) return;
    const addresses = await this.getAddresses();
    for (const addr of addresses) {
      if (addr.id && addr.isDefault) {
        await updateDoc(doc(this.db, 'users', uid, 'addresses', addr.id), { isDefault: false });
      }
    }
    await updateDoc(doc(this.db, 'users', uid, 'addresses', addressId), { isDefault: true });
  }
}
