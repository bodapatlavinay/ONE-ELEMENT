import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-container">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <h1>Privacy Policy</h1>
        <p class="updated">Last updated: May 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide when placing an order — name, email, phone number, shipping address, and payment details. Payment details are processed securely by Shopify and Razorpay and are never stored on our servers.</p>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is used to process and deliver your orders, send order confirmations and shipping updates, respond to customer service inquiries, and send promotional offers if you opt in.</p>

        <h2>3. Data Sharing</h2>
        <p>We do not sell or rent your personal data. We share data only with trusted partners required to fulfil your order — shipping providers (Delhivery, Shiprocket), payment processors (Razorpay, Shopify Payments), and email/SMS platforms (Klaviyo, Interakt).</p>

        <h2>4. Cookies</h2>
        <p>We use cookies to improve your shopping experience, remember your cart, and analyse site traffic via Google Analytics. You can disable cookies in your browser settings.</p>

        <h2>5. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@oneelement.in">support&#64;oneelement.in</a>.</p>

        <h2>6. Contact</h2>
        <p>One Element Activewear Pvt. Ltd.<br>Email: support&#64;oneelement.in<br>Phone: +91 XXXXX XXXXX</p>
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
    a { color: var(--accent); }
  `]
})
export class PrivacyComponent {}
