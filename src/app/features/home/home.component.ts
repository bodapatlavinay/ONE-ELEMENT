import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  featuredProducts = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);

  heroSlides = [
    {
      label: 'New Season Drop',
      headline: 'PUSH EVERY\nLIMIT.',
      sub: 'Premium activewear engineered for India\'s relentless athletes.',
      cta: 'Shop Men',
      ctaLink: '/shop',
      ctaQuery: { gender: 'men' },
      ctaSecondary: 'Shop Women',
      ctaSecondaryLink: '/shop',
      ctaSecondaryQuery: { gender: 'women' },
      bg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
      align: 'left'
    }
  ];

  categories = [
    { label: 'MEN', sub: 'Training · Running · Lifestyle', link: '/shop', query: { gender: 'men' }, img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80' },
    { label: 'WOMEN', sub: 'Yoga · Training · Performance', link: '/shop', query: { gender: 'women' }, img: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80' },
    { label: 'UNISEX', sub: 'Everyday Essentials', link: '/shop', query: { gender: 'unisex' }, img: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80' }
  ];

  features = [
    { icon: '⚡', title: 'HeatGear® Fabric', desc: '4-way stretch, anti-odour, moisture-wicking technology' },
    { icon: '🌊', title: 'AquaGuard Coating', desc: 'Water-resistant finish for all weather training' },
    { icon: '🎯', title: 'Precision Fit', desc: 'Engineered cuts for unrestricted range of motion' },
    { icon: '♻️', title: 'EcoThread Blend', desc: '40% recycled materials in every product' }
  ];

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(p => this.featuredProducts.set(p));
    this.productService.getNewArrivals().subscribe(p => this.newArrivals.set(p));
  }
}
