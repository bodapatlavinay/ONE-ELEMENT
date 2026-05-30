import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchQuery = signal('');

  navLinks = [
    { label: 'New Arrivals', path: '/shop', query: { filter: 'new' } },
    { label: 'Men', path: '/shop', query: { gender: 'men' } },
    { label: 'Women', path: '/shop', query: { gender: 'women' } },
    { label: 'Unisex', path: '/shop', query: { gender: 'unisex' } },
    { label: 'Sale', path: '/shop', query: { filter: 'sale' } },
    { label: 'About', path: '/about', query: {} }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobileMenu(): void { this.isMobileMenuOpen.set(!this.isMobileMenuOpen()); }
  closeMobileMenu(): void { this.isMobileMenuOpen.set(false); }
  toggleSearch(): void { this.isSearchOpen.set(!this.isSearchOpen()); }

  onSearch(): void {
    if (this.searchQuery().trim()) {
      this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery() } });
      this.isSearchOpen.set(false);
      this.searchQuery.set('');
    }
  }

  navigateToCart(): void {
    this.cartService.openCart();
  }
}
