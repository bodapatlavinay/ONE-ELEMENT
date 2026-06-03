import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  toastService = inject(ToastService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedSize = signal('');
  selectedColor = signal('');
  quantity = signal(1);
  activeImage = signal(0);
  activeTab = signal<'description' | 'specs' | 'reviews'>('description');
  isLoading = signal(true);
  sizeError = signal(false);

  // Lightbox
  lightboxOpen = signal(false);
  lightboxZoom = signal(1);

  openLightbox(): void {
    this.lightboxOpen.set(true);
    this.lightboxZoom.set(1);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  zoomIn(): void  { this.lightboxZoom.set(Math.min(this.lightboxZoom() + 0.5, 4)); }
  zoomOut(): void { this.lightboxZoom.set(Math.max(this.lightboxZoom() - 0.5, 1)); }

  specs = [
    { label: 'Material', value: 'HeatGear® 92% Polyester, 8% Elastane' },
    { label: 'Fit', value: 'Fitted / Compression' },
    { label: 'Technology', value: '4-Way Stretch, Anti-Odour, Moisture-Wicking' },
    { label: 'Care', value: 'Machine Wash Cold, Do Not Tumble Dry' },
    { label: 'Origin', value: 'Made in India' },
    { label: 'Sustainability', value: '40% Recycled Materials' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.isLoading.set(true);
      this.selectedSize.set('');
      this.selectedColor.set('');
      this.quantity.set(1);
      this.activeImage.set(0);

      this.productService.getProductById(id).subscribe(product => {
        this.product.set(product || null);
        if (product) {
          this.selectedColor.set(product.colors[0]);
          this.productService.getRelatedProducts(product).subscribe(r => this.relatedProducts.set(r));
        }
        this.isLoading.set(false);
      });
    });
  }

  get isWishlisted(): boolean {
    return this.product() ? this.wishlistService.isWishlisted(this.product()!.id) : false;
  }

  get discountPercent(): number {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
    this.sizeError.set(false);
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  addToCart(): void {
    if (!this.selectedSize()) { this.sizeError.set(true); return; }
    const p = this.product();
    if (!p) return;
    this.cartService.addToCart(p, this.selectedSize(), this.selectedColor(), this.quantity());
    this.toastService.show(`${p.title} added to cart!`, 'success');
  }

  toggleWishlist(): void {
    const p = this.product();
    if (!p) return;
    this.wishlistService.toggle(p);
    this.toastService.show(this.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist', 'success');
  }

  setImage(i: number): void { this.activeImage.set(i); }

  get images(): string[] {
    const p = this.product();
    return p ? (p.images?.length ? p.images : [p.image]) : [];
  }

  prevImage(): void {
    this.setImage(Math.max(this.activeImage() - 1, 0));
  }

  nextImage(): void {
    this.setImage(Math.min(this.activeImage() + 1, this.images.length - 1));
  }

  // Touch swipe support
  private touchStartX = 0;

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent): void {
    const diff = this.touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? this.nextImage() : this.prevImage();
    }
  }

  changeQty(delta: number): void {
    const max = this.product()?.stock || 10;
    this.quantity.set(Math.max(1, Math.min(max, this.quantity() + delta)));
  }
}
