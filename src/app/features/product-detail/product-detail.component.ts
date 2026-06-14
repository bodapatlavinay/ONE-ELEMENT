import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
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
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private document = inject(DOCUMENT);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private schemaScript: HTMLScriptElement | null = null;
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
          this.injectProductSchema(product);
          this.titleService.setTitle(`${product.title} — ₹${product.price.toLocaleString('en-IN')} | ONE ELEMENT`);
          const desc = product.description?.slice(0, 155) || `Shop ${product.title} at ONE ELEMENT Activewear.`;
          this.metaService.updateTag({ name: 'description', content: desc });
          this.metaService.updateTag({ property: 'og:title', content: `${product.title} | ONE ELEMENT` });
          this.metaService.updateTag({ property: 'og:description', content: desc });
          this.metaService.updateTag({ property: 'og:image', content: product.image });
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

  private readonly colorHexMap: Record<string, string> = {
    // Blacks
    'onyx black': '#111111', 'jet black': '#111111', 'carbon black': '#111111',
    'midnight black': '#111111', 'solid black': '#111111', 'black': '#111111',
    // Whites / Creams
    'arctic white': '#F2F2F2', 'cloud white': '#F2F2F2', 'stone white': '#D0C9C0',
    'off white': '#F0EDE6', 'ivory': '#FFFAE6', 'cream': '#F5F0E8', 'white': '#F2F2F2',
    // Greys
    'steel grey': '#8A8A8A', 'steel gray': '#8A8A8A', 'light grey': '#AAAAAA',
    'graphite': '#4A4A4A', 'charcoal': '#3C3C3C', 'ash grey': '#9A9A9A',
    'grey': '#7A7A7A', 'gray': '#7A7A7A',
    // Navies / Blues
    'midnight navy': '#1B2A4A', 'navy storm': '#243B5A', 'navy blue': '#1B2A4A',
    'navy': '#1B2A4A', 'royal blue': '#2756CC', 'slate blue': '#4A6FA5',
    'sky blue': '#5AADE0', 'cobalt': '#1A52CC', 'blue': '#1E4DB7',
    // Reds / Crimsons
    'crimson': '#C0392B', 'scarlet': '#C0392B', 'cherry red': '#B01C2E',
    'brick red': '#943126', 'maroon': '#800000', 'burgundy': '#6D1A2A', 'red': '#C0392B',
    // Pinks / Roses
    'dusty rose': '#C6857A', 'blush': '#E8A8A0', 'hot pink': '#D63384',
    'rose': '#DB7093', 'mauve': '#B07A86', 'pink': '#D63384',
    // Greens
    'forest green': '#2D6A4F', 'army green': '#4B5320', 'sage': '#7A9E7E',
    'mint': '#3EB489', 'hunter green': '#2E5933', 'olive': '#6B7A3E', 'green': '#2D5A27',
    // Oranges / Yellows
    'burnt orange': '#CC5500', 'amber': '#FFBF00', 'mustard': '#E1AD21',
    'orange': '#FF6B00', 'yellow': '#F0B429',
    // Purples
    'lavender': '#9B7BC8', 'violet': '#7F3FBF', 'plum': '#673A6F', 'purple': '#6B21A8',
    // Browns / Tans
    'tan': '#C8A882', 'camel': '#C19A6B', 'mocha': '#7B4F3A', 'brown': '#7C5230',
    'beige': '#D4C5A9', 'sand': '#C8BFB0', 'khaki': '#C3B091',
    // Teals / Cyans
    'teal': '#1A7A6E', 'turquoise': '#30D5C8', 'cyan': '#0EA5C8',
  };

  getColorHex(color: string): string {
    const lower = color.toLowerCase().trim();
    // 1. Exact match first
    if (this.colorHexMap[lower]) return this.colorHexMap[lower];
    // 2. Keyword match — longest keys first (most specific wins)
    const keys = Object.keys(this.colorHexMap).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (lower.includes(key)) return this.colorHexMap[key];
    }
    return '#555555';
  }

  selectColor(color: string): void {
    this.selectedColor.set(color);
    this.activeImage.set(0);
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
    if (!p) return [];
    const color = this.selectedColor();
    // Use per-color images if available for this color
    if (color && p.colorImages?.[color]?.length) {
      return p.colorImages[color];
    }
    return p.images?.length ? p.images : [p.image];
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

  private injectProductSchema(product: any): void {
    // Remove any existing schema
    if (this.schemaScript) {
      this.schemaScript.remove();
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.images?.length ? product.images : [product.image],
      brand: { '@type': 'Brand', name: 'One Element' },
      offers: {
        '@type': 'Offer',
        url: `https://oneelement.in/product/${product.id}`,
        priceCurrency: 'INR',
        price: product.price,
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'One Element Activewear' }
      },
      ...(product.rating?.count > 0 ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.rate,
          reviewCount: product.rating.count
        }
      } : {})
    };
    this.schemaScript = this.document.createElement('script');
    this.schemaScript.type = 'application/ld+json';
    this.schemaScript.text = JSON.stringify(schema);
    this.document.head.appendChild(this.schemaScript);
  }

  ngOnDestroy(): void {
    if (this.schemaScript) {
      this.schemaScript.remove();
    }
  }
}
