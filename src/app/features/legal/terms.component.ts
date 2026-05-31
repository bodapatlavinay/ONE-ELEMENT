import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-container">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <h1>Terms of Use</h1>
        <p class="updated">Last updated: May 2026</p>

        <h2>1. Acceptance</h2>
        <p>By accessing or purchasing from One Element Activewear, you agree to these Terms. If you do not agree, please do not use the site.</p>

        <h2>2. Products & Pricing</h2>
        <p>All prices are in Indian Rupees (₹) and inclusive of GST. We reserve the right to change prices at any time. Product colours may vary slightly from screen to screen.</p>

        <h2>3. Orders</h2>
        <p>An order confirmation email does not constitute acceptance of your order. We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraud. Full refunds are issued for cancelled orders.</p>

        <h2>4. Shipping</h2>
        <p>We ship Pan India. Standard delivery: 4–7 business days. Express delivery: 1–3 business days (additional charges apply). Free shipping on orders above ₹2,999.</p>

        <h2>5. Intellectual Property</h2>
        <p>All content on this site — logos, images, text, and design — is the property of One Element Activewear Pvt. Ltd. and may not be reproduced without written permission.</p>

        <h2>6. Governing Law</h2>
        <p>These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>

        <h2>7. Contact</h2>
        <p>One Element Activewear Pvt. Ltd.<br>Email: legal&#64;oneelement.in</p>
      </div>
    </div>
  `,
  styles: [`
    .legal-page { min-height: 100vh; background: var(--bg-primary); padding: 120px 0 80px; }
    .legal-container { max-width: 720px; margin: 0 auto; padding: 0 24px; }
    .back-link { color: var(--accent); text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block; margin-bottom: 32px; }
    h1 { font-family: var(--font-display); font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 8px; }
    .updated { color: var(--text-muted); font-size: 14px; margin-bottom: 40px; }
    h2 { font-size: 18px; font-weight: 700; color: #fff; margin: 32px 0 12px; }
    p { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 16px; }
  `]
})
export class TermsComponent {}
