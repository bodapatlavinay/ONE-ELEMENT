import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartSidebarComponent } from './shared/components/cart-sidebar/cart-sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CartSidebarComponent, ToastComponent],
  template: `
    <app-navbar />
    <app-cart-sidebar />
    <app-toast />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main { min-height: 100vh; }
  `]
})
export class AppComponent {}
