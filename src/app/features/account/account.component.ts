import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SavedAddress } from '../../core/models/product.model';

type View = 'login' | 'register' | 'forgot';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private analyticsService = inject(AnalyticsService);

  view = signal<View>('login');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  errorMsg = signal('');
  successMsg = signal('');
  submitting = signal(false);
  activeTab = signal<'orders' | 'profile' | 'addresses'>('orders');

  // Addresses
  addresses = signal<SavedAddress[]>([]);
  addressesLoading = signal(false);
  showAddressForm = signal(false);
  addressSaving = signal(false);
  addressForm = {
    label: 'Home', firstName: '', lastName: '', phone: '',
    address: '', city: '', state: '', pincode: '', isDefault: false
  };
  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry', 'Jammu & Kashmir', 'Ladakh'
  ];

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn() && this.activeTab() === 'addresses') {
        this.loadAddresses();
      }
    });
  }

  setView(v: View): void {
    this.view.set(v);
    this.errorMsg.set('');
    this.successMsg.set('');
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');
  }

  async loadAddresses(): Promise<void> {
    this.addressesLoading.set(true);
    try {
      const addrs = await this.firestoreService.getAddresses();
      this.addresses.set(addrs.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)));
    } catch {}
    this.addressesLoading.set(false);
  }

  openAddressForm(): void {
    this.addressForm = { label: 'Home', firstName: '', lastName: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false };
    this.showAddressForm.set(true);
  }

  async saveAddress(): Promise<void> {
    if (!this.addressForm.address || !this.addressForm.city || !this.addressForm.pincode) return;
    this.addressSaving.set(true);
    try {
      await this.firestoreService.saveAddress({ ...this.addressForm });
      this.showAddressForm.set(false);
      await this.loadAddresses();
    } catch {}
    this.addressSaving.set(false);
  }

  async deleteAddress(id: string): Promise<void> {
    if (!id) return;
    await this.firestoreService.deleteAddress(id);
    await this.loadAddresses();
  }

  async setDefault(id: string): Promise<void> {
    if (!id) return;
    await this.firestoreService.setDefaultAddress(id);
    await this.loadAddresses();
  }

  onTabChange(tab: 'orders' | 'profile' | 'addresses'): void {
    this.activeTab.set(tab);
    if (tab === 'addresses' && !this.addresses().length) {
      this.loadAddresses();
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMsg.set('');
    this.submitting.set(true);
    try {
      await this.authService.loginWithGoogle();
      this.analyticsService.trackLogin('google');
    } catch (e: any) {
      this.errorMsg.set(this.friendlyError(e.code));
    } finally {
      this.submitting.set(false);
    }
  }

  async loginWithEmail(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.errorMsg.set('Please enter your email and password.');
      return;
    }
    this.errorMsg.set('');
    this.submitting.set(true);
    try {
      await this.authService.loginWithEmail(this.email(), this.password());
      this.analyticsService.trackLogin('email');
    } catch (e: any) {
      this.errorMsg.set(this.friendlyError(e.code));
    } finally {
      this.submitting.set(false);
    }
  }

  async register(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.errorMsg.set('Please fill in all fields.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }
    if (this.password().length < 6) {
      this.errorMsg.set('Password must be at least 6 characters.');
      return;
    }
    this.errorMsg.set('');
    this.submitting.set(true);
    try {
      await this.authService.registerWithEmail(this.email(), this.password());
      this.analyticsService.trackSignUp('email');
    } catch (e: any) {
      this.errorMsg.set(this.friendlyError(e.code));
    } finally {
      this.submitting.set(false);
    }
  }

  async forgotPassword(): Promise<void> {
    if (!this.email()) {
      this.errorMsg.set('Enter your email address above.');
      return;
    }
    this.errorMsg.set('');
    this.submitting.set(true);
    try {
      await this.authService.resetPassword(this.email());
      this.successMsg.set('Reset link sent — check your inbox.');
    } catch (e: any) {
      this.errorMsg.set(this.friendlyError(e.code));
    } finally {
      this.submitting.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  get displayName(): string {
    const u = this.authService.user();
    return u?.displayName || u?.email?.split('@')[0] || 'ATHLETE';
  }

  get avatarUrl(): string | null {
    return this.authService.user()?.photoURL ?? null;
  }

  get userEmail(): string {
    return this.authService.user()?.email ?? '';
  }

  private friendlyError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No account found with that email.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}
