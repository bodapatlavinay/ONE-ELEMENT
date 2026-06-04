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

  categories = [
    { label: 'MEN', sub: 'Training · Running · Lifestyle', link: '/shop', query: { gender: 'men' }, img: 'assets/men.webp' },
    { label: 'WOMEN', sub: 'Yoga · Training · Performance', link: '/shop', query: { gender: 'women' }, img: 'assets/women.webp' },
    { label: 'UNISEX', sub: 'Everyday Essentials', link: '/shop', query: { gender: 'unisex' }, img: 'assets/unisex.webp' }
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
