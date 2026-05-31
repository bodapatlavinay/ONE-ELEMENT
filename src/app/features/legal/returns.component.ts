import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="legal-page">
      <div class="legal-container">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <h1>Returns & Refunds</h1>
        <p class="updated">Last updated: May 2026</p>

        <div class="highlight">
          <span>30-Day Returns</span> — No questions asked on unused items with original tags.
        </div>

        <h2>Eligibility</h2>
        <p>Items are eligible for return within 30 days of delivery if they are unworn, unwashed, and in original packaging with all tags attached. Sale items are final sale and not eligible for returns.</p>

        <h2>How to Initiate a Return</h2>
        <p>1. Email <a href="mailto:returns@oneelement.in">returns&#64;oneelement.in</a> with your order number and reason for return.<br>
        2. We'll send you a prepaid return shipping label within 24 hours.<br>
        3. Drop the package at the nearest courier point.<br>
        4. Refund processed within 5–7 business days of receiving the item.</p>

        <h2>Exchanges</h2>
        <p>We offer free size exchanges. Contact us and we'll arrange a pickup and re-delivery at no extra cost.</p>

        <h2>Refund Method</h2>
        <p>Refunds are issued to the original payment method. UPI and card refunds take 3–5 business days. Store credit is issued immediately if preferred.</p>

        <h2>Damaged or Wrong Items</h2>
        <p>If you received a damaged or incorrect item, email us with a photo within 48 hours of delivery. We'll ship a replacement at no charge.</p>
      </div>
    </div>
  `,
  styles: [`
    .legal-page { min-height: 100vh; background: var(--bg-primary); padding: 120px 0 80px; }
    .legal-container { max-width: 720px; margin: 0 auto; padding: 0 24px; }
    .back-link { color: var(--accent); text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block; margin-bottom: 32px; }
    h1 { font-family: var(--font-display); font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 8px; }
    .updated { color: var(--text-muted); font-size: 14px; margin-bottom: 40px; }
    .highlight { background: rgba(226,88,34,0.1); border: 1px solid rgba(226,88,34,0.25); border-radius: 8px; padding: 16px 20px; font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
    .highlight span { font-weight: 700; color: var(--accent); }
    h2 { font-size: 18px; font-weight: 700; color: #fff; margin: 32px 0 12px; }
    p { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 16px; }
    a { color: var(--accent); }
  `]
})
export class ReturnsComponent {}
