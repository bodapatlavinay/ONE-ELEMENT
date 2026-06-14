import { Component, OnInit, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
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
export class HomeComponent implements OnInit, AfterViewInit {
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  featuredProducts = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);

  categories = [
    { label: 'MEN', sub: 'Training · Running · Lifestyle', link: '/shop', query: { gender: 'men' }, img: 'assets/men.webp' },
    { label: 'WOMEN', sub: 'Yoga · Training · Performance', link: '/shop', query: { gender: 'women' }, img: 'assets/women.webp' },
  ];

  newsletterEmail = signal('');
  newsletterSubmitted = signal(false);

  subscribeNewsletter(): void {
    const email = this.newsletterEmail().trim();
    if (!email || !email.includes('@')) return;
    const subs: string[] = JSON.parse(localStorage.getItem('oe_subscribers') || '[]');
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem('oe_subscribers', JSON.stringify(subs));
    }
    this.newsletterSubmitted.set(true);
  }

  ngOnInit(): void {
    this.titleService.setTitle('ONE ELEMENT | Premium Activewear Made in India');
    this.metaService.updateTag({ name: 'description', content: 'Shop premium activewear at ONE ELEMENT — 4-way stretch, moisture-wicking activewear. Free shipping above ₹2999.' });
    this.metaService.updateTag({ property: 'og:title', content: 'ONE ELEMENT | Premium Activewear Made in India' });
    this.metaService.updateTag({ property: 'og:description', content: 'Premium activewear engineered for athletes. Shop men\'s and women\'s training, running & yoga gear.' });
    this.productService.getFeaturedProducts().subscribe(p => this.featuredProducts.set(p));
    this.productService.getNewArrivals().subscribe(p => this.newArrivals.set(p));
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.anim-target').forEach(el => observer.observe(el));
  }
}
