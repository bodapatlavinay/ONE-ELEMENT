import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
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
  ];

  features = [
    { icon: 'fa-solid fa-bolt', title: 'HeatGear® Fabric', desc: '4-way stretch, anti-odour, moisture-wicking technology' },
    { icon: 'fa-solid fa-droplet', title: 'AquaGuard Coating', desc: 'Water-resistant finish for all weather training' },
    { icon: 'fa-solid fa-crosshairs', title: 'Precision Fit', desc: 'Engineered cuts for unrestricted range of motion' },
    { icon: 'fa-solid fa-leaf', title: 'EcoThread Blend', desc: '40% recycled materials in every product' }
  ];

  newsletterEmail = signal('');
  newsletterSubmitted = signal(false);

  subscribeNewsletter(): void {
    const email = this.newsletterEmail().trim();
    if (!email || !email.includes('@')) return;
    // Store in localStorage so submissions persist across page loads
    const subs: string[] = JSON.parse(localStorage.getItem('oe_subscribers') || '[]');
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem('oe_subscribers', JSON.stringify(subs));
    }
    this.newsletterSubmitted.set(true);
  }

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(p => this.featuredProducts.set(p));
    this.productService.getNewArrivals().subscribe(p => this.newArrivals.set(p));
  }
}
