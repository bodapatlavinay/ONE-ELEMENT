import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
<div class="not-found-page">
  <div class="nf-content">
    <span class="nf-code">404</span>
    <h1>PAGE NOT FOUND</h1>
    <p>Looks like this page went off the beaten track. Let's get you back.</p>
    <div class="nf-actions">
      <a routerLink="/" class="btn-primary">GO HOME</a>
      <a routerLink="/shop" class="btn-ghost">SHOP NOW</a>
    </div>
  </div>
</div>
  `,
  styles: [`
    .not-found-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px; text-align: center; }
    .nf-content { display: flex; flex-direction: column; align-items: center; gap: 20px; }
    .nf-code { font-family: var(--font-display); font-size: 160px; font-weight: 900; color: rgba(255,255,255,0.05); line-height: 1; display: block; margin-bottom: -20px; }
    h1 { font-family: var(--font-display); font-size: 40px; font-weight: 900; color: #fff; margin: 0; }
    p { color: var(--text-muted); font-size: 16px; max-width: 360px; line-height: 1.6; margin: 0; }
    .nf-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
    .btn-primary { display: inline-flex; background: var(--accent); color: #000; font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.12em; padding: 14px 28px; border-radius: 3px; text-decoration: none; transition: background 0.2s; &:hover { background: #fff; } }
    .btn-ghost { display: inline-flex; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; padding: 14px 28px; border-radius: 3px; text-decoration: none; transition: all 0.2s; &:hover { border-color: rgba(255,255,255,0.5); color: #fff; } }
  `]
})
export class NotFoundComponent {}
