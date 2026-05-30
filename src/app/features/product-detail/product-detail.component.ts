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
  changeQty(delta: number): void {
    const max = this.product()?.stock || 10;
    this.quantity.set(Math.max(1, Math.min(max, this.quantity() + delta)));
  }
}
