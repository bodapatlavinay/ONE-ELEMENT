import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  customerService = inject(CustomerService);
  // Login form
  email = signal('');
  password = signal('');
  errorMsg = signal('');
  activeTab = signal<'orders' | 'profile'>('orders');

  ngOnInit(): void {
    // Already logged in — nothing to do, template shows dashboard
  }

  login(): void {
    this.errorMsg.set('');
    if (!this.email() || !this.password()) {
      this.errorMsg.set('Please enter your email and password.');
      return;
    }
    this.customerService.login(this.email(), this.password()).subscribe(result => {
      if (!result.success) this.errorMsg.set(result.error || 'Login failed.');
    });
  }

  logout(): void {
    this.customerService.logout();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatStatus(status: string): string {
    return status?.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase()) ?? '—';
  }

  statusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'paid' || s === 'fulfilled') return 'status--success';
    if (s === 'pending' || s === 'in_progress' || s === 'partially_fulfilled') return 'status--pending';
    if (s === 'refunded' || s === 'voided') return 'status--refunded';
    return 'status--default';
  }
}
