import { Component, OnInit, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="contact-page">
      <div class="contact-inner">
        <div class="contact-info">
          <p class="eyebrow">GET IN TOUCH</p>
          <h1>We're here<br>to help.</h1>
          <p class="sub">Have a question about your order, sizing, or anything else? Reach out — we typically respond within 2 hours.</p>

          <div class="info-items">
            <div class="info-item">
              <span class="info-icon"><i class="fa-regular fa-envelope"></i></span>
              <div>
                <p class="info-label">Email</p>
                <a href="mailto:support@oneelement.in">support&#64;oneelement.in</a>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon"><i class="fa-brands fa-whatsapp"></i></span>
              <div>
                <p class="info-label">WhatsApp</p>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank">Chat with us</a>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon"><i class="fa-regular fa-clock"></i></span>
              <div>
                <p class="info-label">Hours</p>
                <p>Mon–Sat, 10am–7pm IST</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon"><i class="fa-solid fa-location-dot"></i></span>
              <div>
                <p class="info-label">Registered Office</p>
                <p>Hyderabad, Telangana, India</p>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-wrap">
          @if (!sent()) {
            <form (ngSubmit)="submit()" class="contact-form">
              <h2>Send a message</h2>
              <div class="form-group">
                <label>Your Name</label>
                <input type="text" [(ngModel)]="form.name" name="name" placeholder="Rahul Kumar" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="form.email" name="email" placeholder="rahul@example.com" required />
              </div>
              <div class="form-group">
                <label>Subject</label>
                <select [(ngModel)]="form.subject" name="subject">
                  <option value="">Select a topic</option>
                  <option>Order Issue</option>
                  <option>Size & Fit</option>
                  <option>Returns & Exchange</option>
                  <option>Payment</option>
                  <option>Wholesale / Bulk</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Message</label>
                <textarea [(ngModel)]="form.message" name="message" rows="5" placeholder="Tell us how we can help..."></textarea>
              </div>
              <button type="submit" class="btn-submit">SEND MESSAGE →</button>
            </form>
          } @else {
            <div class="success-msg">
              <span>✓</span>
              <h2>Message sent!</h2>
              <p>We'll get back to you within 2 hours on working days.</p>
              <button (click)="sent.set(false)" class="btn-submit">Send Another</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page { min-height: 100vh; background: var(--bg-primary); padding: 120px 80px 80px; }
    .contact-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
    @media (max-width: 900px) { .contact-page { padding: 100px 24px 60px; } .contact-inner { grid-template-columns: 1fr; gap: 48px; } }
    .eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--accent); margin-bottom: 16px; font-weight: 700; }
    h1 { font-family: var(--font-display); font-size: clamp(40px, 6vw, 64px); font-weight: 900; color: #fff; line-height: 1; margin-bottom: 20px; }
    .sub { font-size: 16px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 40px; }
    .info-items { display: flex; flex-direction: column; gap: 24px; }
    .info-item { display: flex; align-items: flex-start; gap: 16px; }
    .info-icon { font-size: 20px; margin-top: 2px; }
    .info-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
    .info-item a, .info-item p:last-child { font-size: 15px; color: rgba(255,255,255,0.75); text-decoration: none; }
    .info-item a:hover { color: var(--accent); }
    .contact-form-wrap { background: var(--surface); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 36px; }
    h2 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 28px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
    label { font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase; }
    input, select, textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 13px 16px; font-size: 15px; font-family: var(--font-body); border-radius: 8px; outline: none; transition: border-color 0.2s; resize: none; }
    input:focus, select:focus, textarea:focus { border-color: var(--accent); }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
    option { background: #1a1a1a; }
    .btn-submit { width: 100%; background: var(--accent); color: #fff; border: none; font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: 0.12em; padding: 16px; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
    .btn-submit:hover { opacity: 0.88; }
    .success-msg { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .success-msg span { font-size: 48px; color: #4caf50; }
    .success-msg p { color: rgba(255,255,255,0.5); font-size: 15px; }
  `]
})
export class ContactComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit(): void {
    this.titleService.setTitle('Contact Us | ONE ELEMENT Activewear');
    this.metaService.updateTag({ name: 'description', content: 'Get in touch with ONE ELEMENT. Questions about orders, sizing, or returns? We typically respond within 2 hours.' });
  }

  sent = signal(false);
  form = { name: '', email: '', subject: '', message: '' };
  submit() { this.sent.set(true); this.form = { name: '', email: '', subject: '', message: '' }; }
}
