import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { ShopifyService } from './shopify.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private shopify = inject(ShopifyService);
  private _cache = signal<Product[]>([]);

  // One Element brand enrichment data
  private brandData = {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: {
      'men': ['Carbon Black', 'Steel Grey', 'Navy Storm', 'Crimson', 'Arctic White'],
      'women': ['Onyx Black', 'Dusty Rose', 'Slate Blue', 'Forest Green', 'Arctic White'],
      'unisex': ['Jet Black', 'Cloud White', 'Graphite', 'Olive', 'Midnight Navy']
    },
    categories: {
      "men's clothing": { label: 'Men', gender: 'Men' as const, sport: 'Training' },
      "women's clothing": { label: 'Women', gender: 'Women' as const, sport: 'Training' },
      "electronics": { label: 'Unisex', gender: 'Unisex' as const, sport: 'Accessories' },
      "jewelery": { label: 'Women', gender: 'Women' as const, sport: 'Accessories' }
    },
    badges: ['NEW', 'SALE', 'BESTSELLER', 'LIMITED', undefined, undefined, undefined] as const
  };

  private activewearProducts: Product[] = [
    {
      id: 101, title: 'ONE ELEMENT CoreFlex Training Tee', price: 1299, originalPrice: 1799,
      description: 'Engineered with 4-way stretch HeatGear® fabric. Anti-odour technology. Mesh ventilation panels for max airflow during intense training sessions.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80','https://images.unsplash.com/photo-1503341338985-95ad5a5c9a47?w=600&q=80'],
      rating: { rate: 4.7, count: 312 }, stock: 48, badge: 'BESTSELLER',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Carbon Black','Steel Grey','Crimson'], gender: 'Men', tags: ['training','compression','gym']
    },
    {
      id: 102, title: 'ONE ELEMENT StormRun Jacket', price: 4999, originalPrice: 6499,
      description: 'Windproof, water-resistant shell. Reflective details for low-light visibility. Packable design fits in its own pocket.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
      rating: { rate: 4.8, count: 189 }, stock: 22, badge: 'NEW',
      sizes: ['S','M','L','XL','XXL'], colors: ['Jet Black','Midnight Navy'], gender: 'Unisex', tags: ['running','outdoor','jacket']
    },
    {
      id: 103, title: 'ONE ELEMENT PowerKnit Sports Bra', price: 1599,
      description: 'Medium-impact support. HeatGear® moisture transport. Racerback design with removable cups. Built-in shelf bra.',
      category: "women's clothing", image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'],
      rating: { rate: 4.6, count: 445 }, stock: 60, badge: 'BESTSELLER',
      sizes: ['XS','S','M','L','XL'], colors: ['Onyx Black','Dusty Rose','Slate Blue'], gender: 'Women', tags: ['yoga','training','sports-bra']
    },
    {
      id: 104, title: 'ONE ELEMENT FlexStride Leggings', price: 2999, originalPrice: 3599,
      description: 'Ultra-high waistband with phone pocket. Squat-proof 4-way stretch. Anti-chafe flat seams. Compression support for all-day wear.',
      category: "women's clothing", image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80'],
      rating: { rate: 4.9, count: 782 }, stock: 35, badge: 'BESTSELLER',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Jet Black','Graphite','Midnight Navy'], gender: 'Women', tags: ['yoga','running','leggings']
    },
    {
      id: 105, title: 'ONE ELEMENT IronGrid Compression Shorts', price: 1899,
      description: 'MapleThread® compression mesh. 9" inseam. Anti-roll waistband. Ideal for HIIT, cycling, and cross-training.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80'],
      rating: { rate: 4.5, count: 267 }, stock: 55, badge: 'NEW',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Carbon Black','Steel Grey','Navy Storm'], gender: 'Men', tags: ['training','compression','shorts']
    },
    {
      id: 106, title: 'ONE ELEMENT ZeroWeight Training Vest', price: 3299,
      description: 'Featherlight 78g construction. 360° ventilation. Bonded seams eliminate chafe. Perfect for hot-climate training.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&q=80'],
      rating: { rate: 4.4, count: 143 }, stock: 28, badge: 'LIMITED',
      sizes: ['S','M','L','XL'], colors: ['Carbon Black','Arctic White'], gender: 'Men', tags: ['running','training','vest']
    },
    {
      id: 107, title: 'ONE ELEMENT NovaSculpt Tank', price: 1499, originalPrice: 1999,
      description: 'Draped open-back design. Buttery-soft modal blend. Anti-static finish. Studio to street versatility.',
      category: "women's clothing", image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80'],
      rating: { rate: 4.7, count: 334 }, stock: 42, badge: 'SALE',
      sizes: ['XS','S','M','L','XL'], colors: ['Onyx Black','Forest Green','Dusty Rose'], gender: 'Women', tags: ['yoga','lifestyle','tank']
    },
    {
      id: 108, title: 'ONE ELEMENT AllElement Hoodie', price: 5499,
      description: 'Heavyweight 400GSM fleece. Kangaroo pocket. Ribbed cuffs and hem. Unisex oversized fit. Your off-duty essential.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'],
      rating: { rate: 4.8, count: 612 }, stock: 18, badge: 'NEW',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Jet Black','Cloud White','Graphite','Olive'], gender: 'Unisex', tags: ['lifestyle','streetwear','hoodie']
    },
    {
      id: 109, title: 'ONE ELEMENT ProRun Elite Shorts', price: 2199,
      description: '5" split-seam design. Built-in liner. Lightweight stretch woven. Secure zip pocket. Race-day ready.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80'],
      rating: { rate: 4.6, count: 198 }, stock: 44, badge: 'BESTSELLER',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Carbon Black','Navy Storm','Crimson'], gender: 'Men', tags: ['running','race','shorts']
    },
    {
      id: 110, title: 'ONE ELEMENT Seamless Flow Set', price: 6799, originalPrice: 8499,
      description: 'Matching bra and legging set. 360° seamless knit construction. Second-skin compression. Sweat-wicking fabric.',
      category: "women's clothing", image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80'],
      rating: { rate: 4.9, count: 521 }, stock: 15, badge: 'LIMITED',
      sizes: ['XS','S','M','L','XL'], colors: ['Onyx Black','Slate Blue'], gender: 'Women', tags: ['yoga','set','bundle']
    },
    {
      id: 111, title: 'ONE ELEMENT ThermoGrid Base Layer', price: 3499,
      description: 'ColdGear® infrared inner lining. Fitted cut. Anti-odour tech. Ideal under jersey or as standalone layer.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80'],
      rating: { rate: 4.5, count: 167 }, stock: 30, badge: 'NEW',
      sizes: ['S','M','L','XL','XXL'], colors: ['Carbon Black','Steel Grey'], gender: 'Men', tags: ['winter','baselayer','training']
    },
    {
      id: 112, title: 'ONE ELEMENT CloudMove Joggers', price: 3199, originalPrice: 3999,
      description: 'Tapered fit. Adjustable drawcord waistband. Two hand pockets + back zip pocket. Soft brushed interior.',
      category: "men's clothing", image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
      rating: { rate: 4.7, count: 398 }, stock: 38, badge: 'SALE',
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Jet Black','Graphite','Midnight Navy','Olive'], gender: 'Unisex', tags: ['lifestyle','jogger','streetwear']
    }
  ];

  private getAll(): Observable<Product[]> {
    if (this._cache().length) return of(this._cache());
    return this.shopify.getProducts(50).pipe(
      map(shopifyProducts => shopifyProducts.length ? shopifyProducts : this.activewearProducts),
      tap(products => this._cache.set(products))
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.getAll();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getAll().pipe(map(products => products.find(p => p.id === id)));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getAll().pipe(map(products => {
      if (category === 'all') return products;
      return products.filter(p =>
        p.gender.toLowerCase() === category.toLowerCase() ||
        p.tags.includes(category.toLowerCase())
      );
    }));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getAll().pipe(map(products =>
      products.filter(p => p.badge === 'BESTSELLER' || p.badge === 'NEW').slice(0, 6)
    ));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.getAll().pipe(map(products =>
      products.filter(p => p.badge === 'NEW').slice(0, 4)
    ));
  }

  searchProducts(query: string): Observable<Product[]> {
    const q = query.toLowerCase();
    return this.getAll().pipe(map(products =>
      products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.gender.toLowerCase().includes(q)
      )
    ));
  }

  getRelatedProducts(product: Product): Observable<Product[]> {
    return this.getAll().pipe(map(products =>
      products.filter(p =>
        p.id !== product.id &&
        (p.gender === product.gender || p.tags.some(t => product.tags.includes(t)))
      ).slice(0, 4)
    ));
  }
}
