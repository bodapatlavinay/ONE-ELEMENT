import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, OnDestroy {
  private sortClickListener?: () => void;
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  allProducts = signal<Product[]>([]);
  isLoading = signal(true);
  isSidebarOpen = signal(false);
  isSortOpen = signal(false);

  // Filters
  selectedGender = signal('all');
  selectedBadge = signal('all');
  selectedSort = signal('default');
  searchQuery = signal('');
  priceMax = signal(10000);
  selectedTag = signal('');       // sport tag from navbar (e.g. 'running', 'training')
  selectedCategory = signal(''); // category tag from navbar (e.g. 'tops', 'shorts')

  // Track what was set by URL navigation (not counted as user-applied filters)
  private urlBaseline = { gender: 'all', badge: 'all', tag: '', category: '' };

  genders = ['all', 'Men', 'Women', 'Unisex'];
  badges = ['all', 'NEW', 'BESTSELLER', 'SALE', 'LIMITED'];
  sorts = [
    { value: 'default', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest First' },
  ];

  selectedSortLabel = computed(() =>
    this.sorts.find(s => s.value === this.selectedSort())?.label ?? 'Featured'
  );

  pageTitle = computed(() => {
    const g = this.selectedGender();
    const c = this.selectedCategory();
    const tag = this.selectedTag();
    const badge = this.selectedBadge();

    if (c) return c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (tag) return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (badge !== 'all') return badge === 'NEW' ? 'NEW ARRIVALS' : badge === 'SALE' ? 'SALE' : badge;
    if (g !== 'all') return `SHOP ${g.toUpperCase()}`;
    return 'ALL PRODUCTS';
  });

  filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    if (this.selectedGender() !== 'all') {
      const g = this.selectedGender().toLowerCase();
      // Unisex products appear under both Men and Women
      list = list.filter(p => p.gender.toLowerCase() === g || p.gender.toLowerCase() === 'unisex');
    }
    if (this.selectedBadge() !== 'all') {
      list = list.filter(p => p.badge === this.selectedBadge());
    }
    if (this.selectedTag()) {
      const t = this.selectedTag().toLowerCase();
      list = list.filter(p => p.tags.some(tag => tag.toLowerCase() === t));
    }
    if (this.selectedCategory()) {
      const c = this.selectedCategory().toLowerCase();
      // Related tag groups — selecting one shows all related
      const relatedTags: Record<string, string[]> = {
        'jacket': ['jacket', 'vest'],
        'tank':   ['tank', 'tops'],
        'tops':   ['tops', 'tank'],
        'set':    ['set', 'bundle', 'sets'],
        'leggings': ['leggings', 'tights'],
      };
      const matches = relatedTags[c] ?? [c, c.replace(/s$/, ''), c + 's'];
      list = list.filter(p => p.tags.some(tag => matches.includes(tag.toLowerCase())));
    }
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    list = list.filter(p => p.price <= this.priceMax());

    switch (this.selectedSort()) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating.rate - a.rating.rate); break;
      case 'newest': list.sort((a, b) => b.id - a.id); break;
    }
    return list;
  });

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts.set(products);
      this.isLoading.set(false);
    });

    this.route.queryParams.subscribe(params => {
      // Normalize gender to match genders array casing
      const g = params['gender'];
      const normalizedGender = g ? (g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()) : 'all';
      this.selectedGender.set(normalizedGender);
      this.selectedTag.set(params['tag'] || '');
      this.selectedCategory.set(params['category'] || '');
      this.searchQuery.set(params['search'] || '');

      let badge = 'all';
      if (params['filter'] === 'new') badge = 'NEW';
      else if (params['filter'] === 'sale') badge = 'SALE';
      else if (params['filter'] === 'bestseller') badge = 'BESTSELLER';
      this.selectedBadge.set(badge);

      // Record URL baseline — these don't count as user-applied filters
      this.urlBaseline = {
        gender: normalizedGender,
        badge,
        tag: params['tag'] || '',
        category: params['category'] || ''
      };

      // Update page title and meta dynamically
      const title = this.pageTitle();
      this.titleService.setTitle(`${title} | ONE ELEMENT Activewear`);
      this.metaService.updateTag({ name: 'description', content: `Shop ${title.toLowerCase()} at ONE ELEMENT — premium activewear made in India. Free shipping above ₹2999.` });
    });
  }

  toggleSort(): void {
    this.isSortOpen.set(!this.isSortOpen());
    if (this.isSortOpen()) {
      // Close on next outside click
      setTimeout(() => {
        this.sortClickListener = () => { this.isSortOpen.set(false); document.removeEventListener('click', this.sortClickListener!); };
        document.addEventListener('click', this.sortClickListener);
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.sortClickListener) document.removeEventListener('click', this.sortClickListener);
  }

  resetFilters(): void {
    this.selectedGender.set('all');
    this.selectedBadge.set('all');
    this.selectedSort.set('default');
    this.searchQuery.set('');
    this.priceMax.set(10000);
    this.selectedTag.set('');
    this.selectedCategory.set('');
  }

  get activeFilterCount(): number {
    let count = 0;
    // Only count filters the customer explicitly changed beyond what the URL pre-set
    if (this.selectedGender() !== 'all' && this.selectedGender() !== this.urlBaseline.gender) count++;
    if (this.selectedBadge() !== 'all' && this.selectedBadge() !== this.urlBaseline.badge) count++;
    if (this.selectedTag() && this.selectedTag() !== this.urlBaseline.tag) count++;
    if (this.selectedCategory() && this.selectedCategory() !== this.urlBaseline.category) count++;
    if (this.priceMax() < 10000) count++;
    if (this.searchQuery()) count++;
    return count;
  }
}
